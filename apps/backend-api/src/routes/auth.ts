import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createAuth, type VerifyLoginPayloadParams } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { thirdwebClient } from '../thirdwebClient';
import { createUser, findUserByWalletAddress, findUserByEmail, findUserByVerificationToken, getOrCreateUser, updateUser } from '../services/userService';
import { createWallet } from '../services/walletService';
import { sendEmailVerification } from '../services/emailService';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const router = express.Router();

// Validation schemas
const LoginQuerySchema = z.object({
  address: z.string().min(1, 'Address is required'),
  chainId: z.string().optional(),
});

const LoginPayloadSchema = z.object({
  payload: z.object({
    address: z.string(),
    chainId: z.number().optional(),
    domain: z.string(),
    expirationTime: z.string(),
    issuedAt: z.string(),
    nonce: z.string(),
    statement: z.string().optional(),
    uri: z.string(),
    version: z.string(),
  }),
  signature: z.string(),
});

const RegisterSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

const EmailSignupSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  referralCode: z.string().optional(),
});

const EmailLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
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
 * @route GET /api/auth/login
 * @desc Generate login payload for wallet authentication
 * @access Public
 */
router.get('/login', async (req, res) => {
  try {
    const validatedQuery = LoginQuerySchema.parse(req.query);
    const { address, chainId } = validatedQuery;

    const payload = await thirdwebAuth.generatePayload({
      address,
      chainId: chainId ? parseInt(chainId) : undefined,
    });

    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        details: error.errors,
      });
    }

    console.error('Error generating login payload:', error);
    res.status(500).json({ error: 'Failed to generate login payload' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Verify login payload and generate JWT with user creation
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const validatedPayload = LoginPayloadSchema.parse(req.body);

    const verifiedPayload = await thirdwebAuth.verifyPayload(validatedPayload as any);

    if (verifiedPayload.valid) {
      const jwt = await thirdwebAuth.generateJWT({
        payload: verifiedPayload.payload,
      });

      // Get or create user in database
      const user = await getOrCreateUser(verifiedPayload.payload.address);

      // Set secure HTTP-only cookie
      res.cookie('jwt', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json({
        success: true,
        token: jwt,
        address: verifiedPayload.payload.address,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          displayName: user.displayName,
          email: user.email,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          isCurator: user.isCurator,
          createdAt: user.createdAt,
        },
        isNewUser: user.createdAt.getTime() === user.updatedAt.getTime(),
      });
    }

    res.status(401).json({ error: 'Invalid authentication payload' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request payload',
        details: error.errors,
      });
    }

    console.error('Error verifying login:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * @route POST /api/auth/register
 * @desc Complete user registration with additional profile data
 * @access Public (requires valid JWT)
 */
router.post('/register', async (req, res) => {
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

    const validatedData = RegisterSchema.parse(req.body);
    const walletAddress = authResult.parsedJWT.sub!;

    // Update user with additional profile data
    const user = await getOrCreateUser(walletAddress, validatedData);

    res.status(200).json({
      success: true,
      message: 'User registration completed successfully',
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        isCurator: user.isCurator,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error completing registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @route GET /api/auth/status
 * @desc Check authentication status
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const jwt = req.cookies?.jwt;

    if (!jwt) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const authResult = await thirdwebAuth.verifyJWT({ jwt });

    if (!authResult.valid) {
      return res.status(200).json({ isAuthenticated: false });
    }

    return res.status(200).json({
      isAuthenticated: true,
      address: authResult.parsedJWT.sub,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user and clear JWT cookie
 * @access Public
 */
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Email/Password Signup
router.post('/signup', async (req, res) => {
  try {
    const validatedData = EmailSignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Generate 6-digit email verification code
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create wallet for the user (temporarily using dummy address for testing)
    let walletAddress: string;
    try {
      const walletInfo = await createWallet(validatedData.email);
      walletAddress = walletInfo.address;
    } catch (error) {
      console.log('⚠️ Wallet creation failed, using dummy address for testing:', error);
      // Generate a dummy wallet address for testing
      walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    }

    // Create user with email verification pending
    const userData = {
      email: validatedData.email,
      passwordHash,
      displayName: validatedData.displayName,
      walletAddress,
      phoneNumber: validatedData.phoneNumber,
      nationality: validatedData.nationality,
      referralCode: validatedData.referralCode,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: false,
    };

    const user = await createUser(userData);

    // Send verification email
    await sendEmailVerification(
      validatedData.email,
      emailVerificationToken,
      validatedData.displayName
    );

    res.status(201).json({
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Email signup error:', error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed on the fields: (`email`)')) {
        return res.status(409).json({
          error: 'An account with this email already exists',
          code: 'EMAIL_EXISTS'
        });
      }
      if (error.message.includes('Unique constraint failed on the fields: (`walletAddress`)')) {
        return res.status(409).json({
          error: 'Wallet address already associated with another account',
          code: 'WALLET_EXISTS'
        });
      }
    }

    return res.status(500).json({
      error: 'Registration failed. Please try again.',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Email/Password Login
router.post('/login/email', async (req, res) => {
  try {
    const validatedData = EmailLoginSchema.parse(req.body);

    // Find user by email
    const user = await findUserByEmail(validatedData.email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate new 6-digit verification code
      const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with new token using walletAddress
      await updateUser(user.walletAddress, {
        emailVerificationToken,
        emailVerificationExpires,
      });

      // Send verification email
      await sendEmailVerification(
        user.email!,
        emailVerificationToken,
        user.displayName || 'User'
      );

      return res.status(401).json({
        success: false,
        error: 'Please verify your email before logging in',
        code: 'EMAIL_NOT_VERIFIED',
        message: 'A new verification email has been sent to your email address'
      });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        walletAddress: user.walletAddress,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        nationality: user.nationality,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Email login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const validatedData = VerifyEmailSchema.parse(req.body);

    // Find user by verification token
    const userWithToken = await findUserByVerificationToken(validatedData.token);

    if (!userWithToken) {
      return res.status(400).json({
        error: 'Invalid or expired verification token'
      });
    }

    // Update user to mark email as verified using walletAddress
    const updatedUser = await updateUser(userWithToken.walletAddress, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    res.json({
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        walletAddress: updatedUser.walletAddress,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend Email Verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new 6-digit verification code
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token using walletAddress
    await updateUser(user.walletAddress, {
      emailVerificationToken,
      emailVerificationExpires,
    });

    // Send verification email
    await sendEmailVerification(
      email,
      emailVerificationToken,
      user.displayName || 'User'
    );

    res.json({
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRouter };
