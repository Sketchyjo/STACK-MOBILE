import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import onboardingRouter from './routes/onboarding';
import { basketsRouter } from './routes/baskets';
import { errorHandler } from './middleware/errorHandler';
import { testEmailConfiguration } from './services/emailService';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/baskets', basketsRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, async () => {
    console.log(`🚀 STACK Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    
    // Test email configuration on startup
    console.log('📧 Testing email configuration...');
    await testEmailConfiguration();
  });
}

export default app;
