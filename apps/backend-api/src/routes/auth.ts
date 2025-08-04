import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../services/userService';
import { createWallet } from '../services/walletService';
import { sendOTPEmail } from '../services/emailService';
import { createOTP, verifyOTP } from '../services/otpService';

const router = express.Router();

// Validation schemas
const EmailSchema = z.object({
  email: z.string().email('Valid email is required'),
});

const VerifyOTPSchema = z.object({
  email: z.string().email('Valid email is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const CompleteSignupSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  referralCode: z.string().optional(),
});

const SignupDataSchema = z.object({
  email: z.string().email('Valid email is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  referralCode: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * @route POST /api/auth/request-otp
 * @desc Request OTP for email verification
 * @access Public
 */
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = EmailSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create and send OTP
    const { code, expiresAt } = await createOTP(email);
    await sendOTPEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresAt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Request OTP error:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      code: 'OTP_SEND_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP for email verification (step 1 of signup)
 * @access Public
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = VerifyOTPSchema.parse(req.body);

    // Verify OTP
    const isValidOTP = await verifyOTP(email, otp);
    if (!isValidOTP) {
      return res.status(400).json({
        error: 'Invalid or expired OTP',
        code: 'INVALID_OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Failed to verify OTP',
      code: 'OTP_VERIFICATION_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/complete-signup
 * @desc Complete signup after OTP verification (step 2 of signup)
 * @access Public
 */
router.post('/complete-signup', async (req, res) => {
  try {
    const validatedData = CompleteSignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create wallet for the user
    let walletAddress: string;
    try {
      const walletInfo = await createWallet(validatedData.email);
      walletAddress = walletInfo.address;
    } catch (walletError) {
      console.error('Wallet creation error:', walletError);
      return res.status(500).json({
        error: 'Failed to create wallet',
        code: 'WALLET_CREATION_FAILED'
      });
    }

    // Create user
    const userData = {
      email: validatedData.email,
      passwordHash,
      displayName: validatedData.displayName,
      walletAddress,
      phoneNumber: validatedData.phoneNumber,
      nationality: validatedData.nationality,
      referralCode: validatedData.referralCode,
      emailVerified: true,
    };

    const user = await createUser(userData);

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        email: user.email,
        walletAddress: user.walletAddress
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        phoneNumber: user.phoneNumber,
        nationality: user.nationality,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Complete signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return res.status(409).json({
          error: 'An account with this email already exists',
          code: 'EMAIL_EXISTS'
        });
      }
    }

    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/signup
 * @desc Complete signup with verified OTP and user data (legacy endpoint)
 * @access Public
 */
router.post('/signup', async (req, res) => {
  try {
    const validatedData = SignupDataSchema.parse(req.body);

    // Verify OTP
    const isValidOTP = await verifyOTP(validatedData.email, validatedData.otp);
    if (!isValidOTP) {
      return res.status(400).json({
        error: 'Invalid or expired OTP',
        code: 'INVALID_OTP'
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create wallet for the user
    let walletAddress: string;
    try {
      const walletInfo = await createWallet(validatedData.email);
      walletAddress = walletInfo.address;
    } catch (walletError) {
      console.error('Wallet creation error:', walletError);
      return res.status(500).json({
        error: 'Failed to create wallet',
        code: 'WALLET_CREATION_FAILED'
      });
    }

    // Create user
    const userData = {
      email: validatedData.email,
      passwordHash,
      displayName: validatedData.displayName,
      walletAddress,
      phoneNumber: validatedData.phoneNumber,
      nationality: validatedData.nationality,
      referralCode: validatedData.referralCode,
      emailVerified: true,
    };

    const user = await createUser(userData);

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        email: user.email,
        walletAddress: user.walletAddress
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        phoneNumber: user.phoneNumber,
        nationality: user.nationality,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return res.status(409).json({
          error: 'An account with this email already exists',
          code: 'EMAIL_EXISTS'
        });
      }
    }

    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login with email and password
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        error: 'Please verify your email before logging in',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        userId: user.id,
        email: user.email,
        walletAddress: user.walletAddress
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
        phoneNumber: user.phoneNumber,
        nationality: user.nationality,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/resend-otp
 * @desc Resend OTP to email
 * @access Public
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = EmailSchema.parse(req.body);

    // Create and send new OTP
    const { code, expiresAt } = await createOTP(email);
    await sendOTPEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully',
      expiresAt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: 'Failed to resend OTP',
      code: 'OTP_RESEND_FAILED'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post('/logout', (req, res) => {
  // Since we're using JWT tokens, logout is handled client-side
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export { router as authRouter };
