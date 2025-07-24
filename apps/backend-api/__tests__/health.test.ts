import request from 'supertest';
import app from '../src/index';
import { Server } from 'http';

describe('Health Check API', () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0); // Use port 0 for random available port
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'STACK Backend API',
        version: '1.0.0',
      });

      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'STACK Backend API',
        version: '1.0.0',
        database: 'not_configured',
      });

      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.memory).toBeDefined();
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Route not found',
      });
    });
  });
});