

import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}).$extends(withAccelerate())

declare global {
  // eslint-disable-next-line no-var
  var __prisma: typeof prisma | undefined;
}

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
