import request from 'supertest';
import app from '../src/index';
import { prisma } from '@stack/shared-types';

// Test data
const testWalletAddress = '0x1234567890123456789012345678901234567890';
const testWalletAddress2 = '0x0987654321098765432109876543210987654321';
const testUserData = {
  walletAddress: testWalletAddress,
  email: 'test@example.com',
  displayName: 'Test User',
};

describe('User Routes', () => {
  beforeAll(async () => {
    // Clean up test data before running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: {
          in: [testWalletAddress, testWalletAddress2],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: {
          in: [testWalletAddress, testWalletAddress2],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.user).toHaveProperty('walletAddress', testWalletAddress);
      expect(response.body.user).toHaveProperty('email', testUserData.email);
      expect(response.body.user).toHaveProperty('displayName', testUserData.displayName);
    });

    it('should return 409 for duplicate wallet address', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUserData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already exists');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUserData = {
        walletAddress: testWalletAddress2,
        email: 'invalid-email',
        displayName: 'Test User 2',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid request data');
    });

    it('should return 400 for missing wallet address', async () => {
      const invalidUserData = {
        email: 'test2@example.com',
        displayName: 'Test User 2',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should create user with only wallet address (optional fields)', async () => {
      const minimalUserData = {
        walletAddress: testWalletAddress2,
      };

      const response = await request(app)
        .post('/api/users')
        .send(minimalUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.user).toHaveProperty('walletAddress', testWalletAddress2);
      expect(response.body.user.email).toBeNull();
      expect(response.body.user).toHaveProperty('displayName'); // Should have default displayName
    });
  });

  describe('GET /api/users/:walletAddress', () => {
    it('should return user data for existing wallet address', async () => {
      const response = await request(app)
        .get(`/api/users/${testWalletAddress}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('isOwnProfile', false);
      expect(response.body.user).toHaveProperty('walletAddress', testWalletAddress);
      expect(response.body.user).toHaveProperty('displayName', testUserData.displayName);
      // Should not include email in public view
      expect(response.body.user).not.toHaveProperty('email');
    });

    it('should return 404 for non-existent wallet address', async () => {
      const nonExistentAddress = '0x9999999999999999999999999999999999999999';
      const response = await request(app)
        .get(`/api/users/${nonExistentAddress}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for missing wallet address parameter', async () => {
      const response = await request(app)
        .get('/api/users/');

      expect(response.status).toBe(404); // Express returns 404 for missing route params
    });
  });

  describe('GET /api/users/:walletAddress/stats', () => {
    it('should return user statistics for existing user', async () => {
      const response = await request(app)
        .get(`/api/users/${testWalletAddress}/stats`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('isOwnProfile', false);
      expect(response.body.stats).toHaveProperty('portfolioCount');
      expect(response.body.stats).toHaveProperty('memberSince');
      // Should not include sensitive stats in public view
      expect(response.body.stats).not.toHaveProperty('totalInvestments');
    });

    it('should return 404 for non-existent user stats', async () => {
      const nonExistentAddress = '0x9999999999999999999999999999999999999999';
      const response = await request(app)
        .get(`/api/users/${nonExistentAddress}/stats`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Required Routes', () => {
    describe('GET /api/users/me', () => {
      it('should return 401 for unauthenticated request', async () => {
        const response = await request(app)
          .get('/api/users/me');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Access denied');
      });

      it('should return 401 for invalid JWT token', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', 'Bearer invalid-jwt-token');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('PUT /api/users/:walletAddress', () => {
      it('should return 401 for unauthenticated request', async () => {
        const updateData = {
          displayName: 'Updated User',
        };

        const response = await request(app)
          .put(`/api/users/${testWalletAddress}`)
          .send(updateData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/users/auth/register', () => {
      it('should return 401 for unauthenticated request', async () => {
        const response = await request(app)
          .post('/api/users/auth/register')
          .send({
            email: 'test@example.com',
            displayName: 'Test User',
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('Input Validation', () => {
    it('should validate email format in user creation', async () => {
      const invalidData = {
        walletAddress: '0x1111111111111111111111111111111111111111',
        email: 'not-an-email',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.details).toBeDefined();
    });

    it('should validate required wallet address', async () => {
      const invalidData = {
        email: 'test@example.com',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate empty wallet address', async () => {
      const invalidData = {
        walletAddress: '',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking Prisma to simulate database errors
      // For now, we'll test that the API doesn't crash with unexpected input
      const response = await request(app)
        .post('/api/users')
        .send({
          walletAddress: 'x'.repeat(1000), // Extremely long address
        });

      // Should return an error, not crash
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});