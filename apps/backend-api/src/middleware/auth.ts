import { Request, Response, NextFunction } from 'express';
import { createCivicAuthInstance } from '../civicAuthConfig';
import jsonwebtoken from 'jsonwebtoken';

/**
 * Middleware to set up Civic Auth instance for each request
 * This should be applied globally to make civicAuth available on all requests
 */
export function setupCivicAuth(req: Request, res: Response, next: NextFunction) {
  req.civicAuth = createCivicAuthInstance(req, res);
  next();
}

/**
 * Middleware to authenticate requests using Civic Auth
 * Checks if user is logged in via Civic Auth session
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.civicAuth) {
      return res.status(500).json({
        error: 'Civic Auth not initialized. Make sure setupCivicAuth middleware is applied.'
      });
    }

    // Check if user is logged in via Civic Auth
    const isLoggedIn = await req.civicAuth.isLoggedIn();
    
    if (!isLoggedIn) {
      // Fallback: Try to authenticate with JWT token for backward compatibility
      let jwt = req.cookies?.jwt;

      if (!jwt) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          jwt = authHeader.substring(7);
        }
      }

      if (jwt && process.env.JWT_SECRET) {
        try {
          const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET) as any;
          
          // Add user info to request object for legacy JWT
          req.user = {
            address: decoded.walletAddress,
            email: decoded.email,
            id: decoded.userId,
          };
          
          return next();
        } catch (jwtError) {
          // JWT verification failed, continue with Civic Auth error
        }
      }

      return res.status(401).json({
        error: 'Access denied. No valid authentication found.'
      });
    }

    // Get user info from Civic Auth
    const user = await req.civicAuth.getUser();
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied. Unable to retrieve user information.'
      });
    }

    // Add user info to request object
    req.user = {
      address: user.walletAddress || user.address,
      email: user.email,
      id: user.id || user.sub,
      ...user // Include all user properties
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      error: 'Access denied. Authentication failed.'
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user info to request if authenticated, but doesn't block if not
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.civicAuth) {
      return next(); // Continue without auth if Civic Auth not initialized
    }

    // Check if user is logged in via Civic Auth
    const isLoggedIn = await req.civicAuth.isLoggedIn();
    
    if (isLoggedIn) {
      const user = await req.civicAuth.getUser();
      
      if (user) {
        req.user = {
          address: user.walletAddress || user.address,
          email: user.email,
          id: user.id || user.sub,
          ...user
        };
      }
    } else {
      // Fallback: Try JWT token for backward compatibility
      let jwt = req.cookies?.jwt;

      if (!jwt) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          jwt = authHeader.substring(7);
        }
      }

      if (jwt && process.env.JWT_SECRET) {
        try {
          const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET) as any;
          
          req.user = {
            address: decoded.walletAddress,
            email: decoded.email,
            id: decoded.userId,
          };
        } catch (jwtError) {
          // JWT verification failed, continue without auth
        }
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

  if (!req.user.address || req.user.address.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. You can only access your own wallet data.'
    });
  }

  next();
}

/**
 * Middleware specifically for Civic Auth authentication
 * Only uses Civic Auth, no JWT fallback
 */
export async function requireCivicAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.civicAuth) {
      return res.status(500).json({
        error: 'Civic Auth not initialized'
      });
    }

    const isLoggedIn = await req.civicAuth.isLoggedIn();
    
    if (!isLoggedIn) {
      return res.status(401).json({
        error: 'Civic Auth authentication required'
      });
    }

    const user = await req.civicAuth.getUser();
    
    if (!user) {
      return res.status(401).json({
        error: 'Unable to retrieve user information'
      });
    }

    req.user = {
      address: user.walletAddress || user.address,
      email: user.email,
      id: user.id || user.sub,
      ...user
    };

    next();
  } catch (error) {
    console.error('Civic Auth middleware error:', error);
    return res.status(401).json({
      error: 'Civic Auth authentication failed'
    });
  }
}
