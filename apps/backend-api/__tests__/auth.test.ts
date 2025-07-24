import request from 'supertest';
import app from '../src/index';
import { prisma } from '@stack/shared-types';
import jwt from 'jsonwebtoken';

// Test data
const testWalletAddress = '0x1234567890123456789012345678901234567890';
const testChainId = '11155111'; // Sepolia testnet

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Clean up test data before running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: testWalletAddress,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: testWalletAddress,
      },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/auth/login', () => {
    it('should generate login payload with valid address', async () => {
      const response = await request(app)
        .get('/api/auth/login')
        .query({
          address: testWalletAddress,
          chainId: testChainId,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('payload');
      expect(response.body.payload).toHaveProperty('address', testWalletAddress);
      expect(response.body.payload).toHaveProperty('chainId', parseInt(testChainId));
      expect(response.body.payload).toHaveProperty('domain');
      expect(response.body.payload).toHaveProperty('nonce');
      expect(response.body.payload).toHaveProperty('expirationTime');
    });

    it('should return 400 for missing address', async () => {
      const response = await request(app)
        .get('/api/auth/login')
        .query({
          chainId: testChainId,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid request parameters');
    });

    it('should return 400 for empty address', async () => {
      const response = await request(app)
        .get('/api/auth/login')
        .query({
          address: '',
          chainId: testChainId,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for invalid payload structure', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          invalidPayload: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid request payload');
    });

    it('should return 401 for invalid signature', async () => {
      const invalidPayload = {
        payload: {
          address: testWalletAddress,
          chainId: parseInt(testChainId),
          domain: 'localhost:3001',
          expirationTime: new Date(Date.now() + 60000).toISOString(),
          issuedAt: new Date().toISOString(),
          nonce: 'test-nonce',
          uri: 'http://localhost:3001',
          version: '1',
        },
        signature: '0xinvalidsignature',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidPayload);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid authentication payload');
    });
  });

  describe('GET /api/auth/status', () => {
    it('should return false for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/auth/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isAuthenticated', false);
    });

    it('should return false for invalid JWT cookie', async () => {
      const response = await request(app)
        .get('/api/auth/status')
        .set('Cookie', 'jwt=invalid-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isAuthenticated', false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout and clear cookie', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
      
      // Check that Set-Cookie header clears the jwt cookie
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader[0]).toContain('jwt=;');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple requests within rate limit', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .get('/api/auth/login')
          .query({
            address: testWalletAddress,
            chainId: testChainId,
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Test with malformed address that might cause internal errors
      const response = await request(app)
        .get('/api/auth/login')
        .query({
          address: 'not-a-valid-ethereum-address',
          chainId: 'invalid-chain-id',
        });

      // Should still return a proper error response, not crash
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});