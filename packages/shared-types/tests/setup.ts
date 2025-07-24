import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.test if it exists, otherwise .env
const envPath = join(__dirname, '..', '.env.test');
config({ path: envPath });

// If no test database URL is provided, use the regular database URL
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  console.warn('Warning: No DATABASE_URL or TEST_DATABASE_URL found. Database tests may fail.');
}

// Set test timeout
jest.setTimeout(30000);