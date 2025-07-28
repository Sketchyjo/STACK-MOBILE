import express from 'express';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { thirdwebClient } from '../thirdwebClient';
import { createWallet } from '../services/walletService';
import { getOrCreateUser, updateUser } from '../services/userService';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const StarterInvestmentSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Terms and conditions must be accepted'
  }),
});

// Initialize Thirdweb Auth
const thirdwebAuth = createAuth({
  domain: process.env.CLIENT_DOMAIN || 'localhost:3001',
  client: thirdwebClient,
  adminAccount: privateKeyToAccount({
    client: thirdwebClient,
    privateKey: process.env.ADMIN_PRIVATE_KEY!,
  }),
});

/**
 * @route POST /api/onboarding/starter-investment
 * @desc Create wallet and provide starter investment slice
 * @access Private (requires authentication)
 */
router.post('/starter-investment', async (req, res) => {
  try {
    // Check for JWT token
    const jwt = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');

    if (!jwt) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify JWT
    const authResult = await thirdwebAuth.verifyJWT({ jwt });

    if (!authResult.valid) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    // Validate request body
    const validatedData = StarterInvestmentSchema.parse(req.body);
    const walletAddress = authResult.parsedJWT.sub!;

    // Get user from database
    const user = await getOrCreateUser(walletAddress);

    // Check if user already has a starter investment
    if (user.hasStarterInvestment) {
      return res.status(400).json({ 
        error: 'User already has a starter investment',
        message: 'Starter investment can only be claimed once per user'
      });
    }

    try {
      // Create a new wallet for the user if they don't have one
      let userWallet = user.walletAddress;
      
      if (!userWallet) {
        const walletResult = await createWallet(user.id);
        userWallet = walletResult.address;
        
        // Update user with wallet address
        await updateUser(user.id, { walletAddress: userWallet });
      }

      // Simulate starter investment allocation
      // In a real implementation, this would:
      // 1. Allocate fractional shares to the user's portfolio
      // 2. Create investment records in the database
      // 3. Initialize the user's portfolio with starter assets
      
      const starterInvestmentAmount = 25; // $25 starter investment
      const starterAssets = [
        { symbol: 'AAPL', allocation: 0.3, value: 7.5 },
        { symbol: 'GOOGL', allocation: 0.25, value: 6.25 },
        { symbol: 'MSFT', allocation: 0.25, value: 6.25 },
        { symbol: 'TSLA', allocation: 0.2, value: 5.0 },
      ];

      // Update user to mark starter investment as claimed
      const updatedUser = await updateUser(user.id, { 
        hasStarterInvestment: true,
        starterInvestmentClaimedAt: new Date(),
      });

      res.status(200).json({
        success: true,
        message: 'Starter investment successfully allocated',
        data: {
          user: {
            id: updatedUser.id,
            walletAddress: updatedUser.walletAddress,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            hasStarterInvestment: updatedUser.hasStarterInvestment,
          },
          starterInvestment: {
            amount: starterInvestmentAmount,
            currency: 'USD',
            assets: starterAssets,
            allocatedAt: new Date().toISOString(),
          },
        },
      });

    } catch (walletError) {
      console.error('Error creating wallet or allocating investment:', walletError);
      return res.status(500).json({ 
        error: 'Failed to process starter investment',
        message: 'Unable to create wallet or allocate starter investment'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error processing starter investment:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process starter investment request'
    });
  }
});

/**
 * @route GET /api/onboarding/status
 * @desc Get user's onboarding status
 * @access Private (requires authentication)
 */
router.get('/status', async (req, res) => {
  try {
    // Check for JWT token
    const jwt = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');

    if (!jwt) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify JWT
    const authResult = await thirdwebAuth.verifyJWT({ jwt });

    if (!authResult.valid) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    const walletAddress = authResult.parsedJWT.sub!;

    // Get user from database
    const user = await getOrCreateUser(walletAddress);

    res.status(200).json({
      success: true,
      data: {
        hasCompletedOnboarding: !!user.hasStarterInvestment,
        hasStarterInvestment: !!user.hasStarterInvestment,
        starterInvestmentClaimedAt: user.starterInvestmentClaimedAt,
        walletAddress: user.walletAddress,
      },
    });

  } catch (error) {
    console.error('Error getting onboarding status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get onboarding status'
    });
  }
});

export default router;