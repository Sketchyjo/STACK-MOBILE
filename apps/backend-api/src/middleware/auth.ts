import { Request, Response, NextFunction } from 'express';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { thirdwebClient } from '../thirdwebClient';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        address: string;
        chainId?: number;
      };
    }
  }
}

// Initialize Thirdweb Auth (same instance as routes)
const thirdwebAuth = createAuth({
  domain: process.env.CLIENT_DOMAIN || 'localhost:3001',
  client: thirdwebClient,
  adminAccount: privateKeyToAccount({
    client: thirdwebClient,
    privateKey: process.env.ADMIN_PRIVATE_KEY!,
  }),
});

/**
 * Middleware to authenticate requests using JWT tokens
 * Checks for JWT in cookies or Authorization header
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get JWT from cookie first, then from Authorization header
    let jwt = req.cookies?.jwt;

    if (!jwt) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        jwt = authHeader.substring(7);
      }
    }

    if (!jwt) {
      return res.status(401).json({
        error: 'Access denied. No authentication token provided.'
      });
    }

    // Verify JWT with Thirdweb Auth
    const authResult = await thirdwebAuth.verifyJWT({ jwt });

    if (!authResult.valid) {
      return res.status(401).json({
        error: 'Access denied. Invalid authentication token.'
      });
    }

    // Add user info to request object
    req.user = {
      address: authResult.parsedJWT.sub!,
      chainId: (authResult.parsedJWT.ctx as any)?.chainId,
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      error: 'Access denied. Token verification failed.'
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user info to request if token is valid, but doesn't block if invalid
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get JWT from cookie first, then from Authorization header
    let jwt = req.cookies?.jwt;

    if (!jwt) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        jwt = authHeader.substring(7);
      }
    }

    if (jwt) {
      // Verify JWT with Thirdweb Auth
      const authResult = await thirdwebAuth.verifyJWT({ jwt });

      if (authResult.valid) {
        // Add user info to request object
        req.user = {
          address: authResult.parsedJWT.sub!,
          chainId: (authResult.parsedJWT.ctx as any)?.chainId,
        };
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue without authentication for optional auth
    next();
  }
}

/**
 * Middleware to check if user owns a specific wallet address
 * Should be used after authenticateToken middleware
 */
export function requireWalletOwnership(req: Request, res: Response, next: NextFunction) {
  const { walletAddress } = req.params;

  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (!walletAddress) {
    return res.status(400).json({
      error: 'Wallet address parameter is required'
    });
  }

  if (req.user.address.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. You can only access your own wallet data.'
    });
  }

  next();
}

/**
 * Rate limiting middleware for authentication endpoints
 */
export function authRateLimit(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of attempts.entries()) {
      if (now > value.resetTime) {
        attempts.delete(key);
      }
    }

    const clientAttempts = attempts.get(clientId);

    if (!clientAttempts) {
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientAttempts.count >= maxAttempts) {
      return res.status(429).json({
        error: 'Too many authentication attempts. Please try again later.',
        retryAfter: Math.ceil((clientAttempts.resetTime - now) / 1000),
      });
    }

    clientAttempts.count++;
    next();
  };
}
