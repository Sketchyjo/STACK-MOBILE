import express from 'express';
import { z } from 'zod';
import { authenticateToken, requireWalletOwnership, optionalAuth } from '../middleware/auth';
import { 
  createUser, 
  findUserByWalletAddress, 
  updateUser, 
  getOrCreateUser,
  getUserStats
} from '../services/userService';

const router = express.Router();

// Validation schemas
const CreateUserSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email format').optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

const UpdateUserSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  isCurator: z.boolean().optional(),
});

/**
 * @route POST /api/users
 * @desc Create a new user
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const validatedData = CreateUserSchema.parse(req.body);
    
    const user = await createUser(validatedData);
    
    // Don't return sensitive information
    const { ...userResponse } = user;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    }
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        error: error.message,
      });
    }
    
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @route GET /api/users/me
 * @desc Get current authenticated user's profile
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await findUserByWalletAddress(req.user.address);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * @route GET /api/users/:walletAddress
 * @desc Get user by wallet address
 * @access Public (with optional auth for additional data)
 */
router.get('/:walletAddress', optionalAuth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const user = await findUserByWalletAddress(walletAddress);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return limited data for public access
    const publicUserData = {
      id: user.id,
      walletAddress: user.walletAddress,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    // If authenticated and viewing own profile, return full data
    if (req.user && req.user.address.toLowerCase() === walletAddress.toLowerCase()) {
      res.status(200).json({
        success: true,
        user,
        isOwnProfile: true,
      });
    } else {
      res.status(200).json({
        success: true,
        user: publicUserData,
        isOwnProfile: false,
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * @route PUT /api/users/:walletAddress
 * @desc Update user profile
 * @access Private (own profile only)
 */
router.put('/:walletAddress', authenticateToken, requireWalletOwnership, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const validatedData = UpdateUserSchema.parse(req.body);
    
    const user = await updateUser(walletAddress, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    }
    
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @route GET /api/users/:walletAddress/stats
 * @desc Get user statistics
 * @access Public (with optional auth for additional data)
 */
router.get('/:walletAddress/stats', optionalAuth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const stats = await getUserStats(walletAddress);
    
    // Return limited stats for public access
    const publicStats = {
      portfolioCount: stats.portfolioCount,
      memberSince: stats.memberSince,
    };

    // If authenticated and viewing own profile, return full stats
    if (req.user && req.user.address.toLowerCase() === walletAddress.toLowerCase()) {
      res.status(200).json({
        success: true,
        stats,
        isOwnProfile: true,
      });
    } else {
      res.status(200).json({
        success: true,
        stats: publicStats,
        isOwnProfile: false,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

/**
 * @route POST /api/users/auth/register
 * @desc Register or login user with wallet authentication
 * @access Private (requires authentication)
 */
router.post('/auth/register', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { email, displayName, bio, avatarUrl } = req.body;
    
    const user = await getOrCreateUser(req.user.address, {
      email,
      displayName,
      bio,
      avatarUrl,
    });
    
    res.status(200).json({
      success: true,
      message: user.createdAt.getTime() === user.updatedAt.getTime() 
        ? 'User registered successfully' 
        : 'User logged in successfully',
      user,
      isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(),
    });
  } catch (error) {
    console.error('Error in auth register:', error);
    res.status(500).json({ error: 'Failed to register/login user' });
  }
});

export { router as userRouter };