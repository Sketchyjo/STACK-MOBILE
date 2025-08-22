import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { CookieStorage, CivicAuth } from '@civic/auth/server';

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.CIVIC_CLIENT_ID) {
  throw new Error('CIVIC_CLIENT_ID environment variable is required');
}

// Civic Auth configuration
export const civicAuthConfig = {
  clientId: process.env.CIVIC_CLIENT_ID,
  redirectUrl: process.env.CIVIC_REDIRECT_URL || 'http://localhost:3001/auth/callback',
  postLogoutRedirectUrl: process.env.CIVIC_POST_LOGOUT_REDIRECT_URL || 'http://localhost:8081/',
  loginSuccessUrl: process.env.CIVIC_LOGIN_SUCCESS_URL || 'http://localhost:8081/',
  oauthServer: process.env.CIVIC_OAUTH_SERVER || 'https://auth.civic.com/oauth'
};

/**
 * Express Cookie Storage implementation for Civic Auth
 * Handles cookie management with proper security settings
 */
export class ExpressCookieStorage extends CookieStorage {
  constructor(
    private req: Request,
    private res: Response,
  ) {
    // Detect if we're running on HTTPS (production) or HTTP (localhost)
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

    super({
      secure: isHttps, // Use secure cookies for HTTPS
      sameSite: isHttps ? 'none' : 'lax', // none for HTTPS cross-origin, lax for localhost
      httpOnly: false, // Allow frontend JavaScript to access cookies
      path: '/', // Ensure cookies are available for all paths
    });
  }

  async get(key: string): Promise<string | null> {
    return Promise.resolve(this.req.cookies[key] ?? null);
  }

  async set(key: string, value: string): Promise<void> {
    this.res.cookie(key, value, this.settings);
    this.req.cookies[key] = value; // Store for immediate access within same request
  }

  async delete(key: string): Promise<void> {
    this.res.clearCookie(key);
  }
}

/**
 * Create a new CivicAuth instance for a request
 */
export function createCivicAuthInstance(req: Request, res: Response): CivicAuth {
  const storage = new ExpressCookieStorage(req, res);
  return new CivicAuth(storage, civicAuthConfig);
}

// Extend Express Request type to include Civic Auth instances
declare global {
  namespace Express {
    interface Request {
      storage?: ExpressCookieStorage;
      civicAuth?: CivicAuth;
      user?: {
        address?: string;
        email?: string;
        id?: string;
        [key: string]: any;
      };
    }
  }
}