import { Router } from 'express';
import { z } from 'zod';
import { checkDatabaseConnection } from '@stack/shared-types';

const router = Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'STACK Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Detailed health check with database status
router.get('/detailed', async (req, res) => {
  try {
    const dbHealthy = await checkDatabaseConnection();
    
    const healthData = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'STACK Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbHealthy ? 'connected' : 'disconnected',
    };

    const statusCode = dbHealthy ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    });
  }
});

export { router as healthRouter };