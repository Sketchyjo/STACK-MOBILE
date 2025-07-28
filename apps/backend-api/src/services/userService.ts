
import { prisma } from '@stack/shared-types';
import { z } from 'zod';

// Remove the local prisma instance since we're using the shared one

// Validation schemas
const CreateUserSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email format').optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable(),
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  referralCode: z.string().optional(),
  passwordHash: z.string().optional(),
  emailVerified: z.boolean().optional(),
  emailVerificationToken: z.string().optional(),
  emailVerificationExpires: z.date().optional(),
});

const UpdateUserSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').optional(),
  email: z.string().email('Invalid email format').optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable(),
  isCurator: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  referralCode: z.string().optional(),
  passwordHash: z.string().optional(),
  emailVerified: z.boolean().optional(),
  emailVerificationToken: z.string().nullable().optional(),
  emailVerificationExpires: z.date().nullable().optional(),
  phoneVerified: z.boolean().optional(),
  hasStarterInvestment: z.boolean().optional(),
  starterInvestmentClaimedAt: z.date().nullable().optional(),
});

export interface CreateUserData {
  walletAddress: string;
  displayName: string;
  email?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string;
  nationality?: string;
  referralCode?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

export interface UpdateUserData {
  displayName?: string;
  email?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isCurator?: boolean;
  phoneNumber?: string;
  nationality?: string;
  referralCode?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  phoneVerified?: boolean;
  hasStarterInvestment?: boolean;
  starterInvestmentClaimedAt?: Date | null;
}

/**
 * Create a new user with wallet address
 */
export async function createUser(userData: CreateUserData) {
  try {
    const validatedData = CreateUserSchema.parse(userData);

    // Check if user already exists (case-insensitive)
    const existingUser = await findUserByWalletAddress(validatedData.walletAddress);

    if (existingUser) {
      throw new Error('User with this wallet address already exists');
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        walletAddress: validatedData.walletAddress,
        displayName: validatedData.displayName,
        email: validatedData.email,
        bio: validatedData.bio,
        avatarUrl: validatedData.avatarUrl,
        phoneNumber: validatedData.phoneNumber,
        nationality: validatedData.nationality,
        referralCode: validatedData.referralCode && validatedData.referralCode.trim() !== '' ? validatedData.referralCode : null,
        passwordHash: validatedData.passwordHash,
        emailVerified: validatedData.emailVerified || false,
        emailVerificationToken: validatedData.emailVerificationToken,
        emailVerificationExpires: validatedData.emailVerificationExpires,
        isCurator: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return user;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * Find user by wallet address (case-insensitive)
 */
export async function findUserByWalletAddress(walletAddress: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: {
          equals: walletAddress,
          mode: 'insensitive'
        }
      },
    });

    return user;
  } catch (error) {
    console.error('Error finding user by wallet address:', error);
    throw new Error('Failed to find user');
  }
}

/**
 * Find user by email (case-insensitive)
 */
export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
    });

    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Failed to find user');
  }
}

/**
 * Update user information
 */
export async function updateUser(walletAddress: string, updateData: UpdateUserData) {
  try {
    const validatedData = UpdateUserSchema.parse(updateData);

    // Find the user first to get the exact wallet address from DB
    const existingUser = await findUserByWalletAddress(walletAddress);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const user = await prisma.user.update({
      where: { walletAddress: existingUser.walletAddress },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return user;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * Get or create user (for authentication flow)
 */
export async function getOrCreateUser(walletAddress: string, additionalData?: Partial<CreateUserData>) {
  try {
    // Try to find existing user
    let user = await findUserByWalletAddress(walletAddress);

    if (!user) {
      // Create new user if doesn't exist
      const defaultDisplayName = additionalData?.displayName || `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
      user = await createUser({
        walletAddress,
        displayName: defaultDisplayName,
        ...additionalData,
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
}

/**
 * Find user by email verification token
 */
export async function findUserByVerificationToken(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error finding user by verification token:', error);
    throw new Error('Failed to find user by verification token');
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(walletAddress: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: {
          equals: walletAddress,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: {
            loans: true,
            createdBaskets: true,
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get portfolio count (whether user has a portfolio)
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            holdings: true,
          },
        },
      },
    });

    return {
      userId: user.id,
      walletAddress: user.walletAddress,
      portfolioCount: portfolio ? 1 : 0, // User either has a portfolio or doesn't
      totalInvestments: portfolio?._count.holdings || 0,
      totalLoans: user._count.loans,
      totalBaskets: user._count.createdBaskets,
      totalTransactions: user._count.transactions,
      memberSince: user.createdAt,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}
