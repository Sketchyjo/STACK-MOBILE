import { prisma } from '@stack/shared-types';
import bcrypt from 'bcrypt';

interface UserSeedData {
  email: string;
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isCurator: boolean;
  nationality?: string;
  referralCode: string;
  hasStarterInvestment: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
}

const userTemplates: UserSeedData[] = [
  {
    email: 'alice.johnson@example.com',
    walletAddress: '0x1234567890123456789012345678901234567890',
    displayName: 'Alice Johnson',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech enthusiast and early crypto adopter. Love investing in innovative companies.',
    isCurator: true,
    nationality: 'US',
    referralCode: 'ALICE2024',
    hasStarterInvestment: true,
    phoneNumber: '+1-555-0101',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    email: 'bob.smith@example.com',
    walletAddress: '0x2345678901234567890123456789012345678901',
    displayName: 'Bob Smith',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Financial advisor turned DeFi investor. Passionate about sustainable investing.',
    isCurator: true,
    nationality: 'CA',
    referralCode: 'BOBSMITH',
    hasStarterInvestment: true,
    phoneNumber: '+1-555-0102',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    email: 'carol.davis@example.com',
    walletAddress: '0x3456789012345678901234567890123456789012',
    displayName: 'Carol Davis',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Healthcare professional interested in biotech investments and ESG funds.',
    isCurator: false,
    nationality: 'US',
    referralCode: 'CAROL123',
    hasStarterInvestment: true,
    phoneNumber: '+1-555-0103',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    email: 'david.wilson@example.com',
    walletAddress: '0x4567890123456789012345678901234567890123',
    displayName: 'David Wilson',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Software engineer with a passion for fintech and blockchain technology.',
    isCurator: true,
    nationality: 'UK',
    referralCode: 'DAVIDW24',
    hasStarterInvestment: false,
    phoneNumber: '+44-555-0104',
    phoneVerified: false,
    emailVerified: true,
  },
  {
    email: 'emma.brown@example.com',
    walletAddress: '0x5678901234567890123456789012345678901234',
    displayName: 'Emma Brown',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Marketing professional exploring alternative investments and crypto.',
    isCurator: false,
    nationality: 'AU',
    referralCode: 'EMMAB2024',
    hasStarterInvestment: true,
    phoneNumber: '+61-555-0105',
    phoneVerified: true,
    emailVerified: false,
  },
  {
    email: 'frank.miller@example.com',
    walletAddress: '0x6789012345678901234567890123456789012345',
    displayName: 'Frank Miller',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Retired finance executive, now angel investor and mentor.',
    isCurator: true,
    nationality: 'US',
    referralCode: 'FRANK2024',
    hasStarterInvestment: true,
    phoneNumber: '+1-555-0106',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    email: 'grace.lee@example.com',
    walletAddress: '0x7890123456789012345678901234567890123456',
    displayName: 'Grace Lee',
    avatarUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    bio: 'Data scientist interested in algorithmic trading and AI-driven investments.',
    isCurator: false,
    nationality: 'SG',
    referralCode: 'GRACELEE',
    hasStarterInvestment: false,
    phoneNumber: '+65-555-0107',
    phoneVerified: true,
    emailVerified: true,
  },
  {
    email: 'henry.garcia@example.com',
    walletAddress: '0x8901234567890123456789012345678901234567',
    displayName: 'Henry Garcia',
    avatarUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    bio: 'Entrepreneur and startup founder with focus on green technology investments.',
    isCurator: true,
    nationality: 'ES',
    referralCode: 'HENRYG24',
    hasStarterInvestment: true,
    phoneNumber: '+34-555-0108',
    phoneVerified: true,
    emailVerified: true,
  },
];

export async function seedUsers() {
  console.log('👥 Starting user seeding...');

  try {
    // Clear existing users (this will cascade to related data)
    await prisma.user.deleteMany({});
    console.log('🗑️ Cleared existing users');

    let successCount = 0;

    for (const template of userTemplates) {
      try {
        // Generate password hash for users with email
        const passwordHash = template.email
          ? await bcrypt.hash('password123', 10)
          : undefined;

        const user = await prisma.user.create({
          data: {
            email: template.email,
            walletAddress: template.walletAddress,
            displayName: template.displayName,
            avatarUrl: template.avatarUrl,
            bio: template.bio,
            isCurator: template.isCurator,
            nationality: template.nationality,
            referralCode: template.referralCode,
            hasStarterInvestment: template.hasStarterInvestment,
            phoneNumber: template.phoneNumber,
            phoneVerified: template.phoneVerified,
            emailVerified: template.emailVerified,
            passwordHash,
            starterInvestmentClaimedAt: template.hasStarterInvestment
              ? new Date()
              : null,
            // Create portfolio for each user
            portfolio: {
              create: {
                totalValue: Math.random() * 50000 + 1000, // Random portfolio value between $1k-$51k
              },
            },
          },
          include: {
            portfolio: true,
          },
        });

        console.log(`✅ Created user: ${user.displayName} (${user.email})`);
        successCount++;
      } catch (error) {
        console.error(
          `❌ Failed to create user ${template.displayName}:`,
          error
        );
      }
    }

    console.log(`🎉 User seeding completed! Created ${successCount} users`);
  } catch (error) {
    console.error('💥 User seeding failed:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✨ User seeding process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 User seeding process failed:', error);
      process.exit(1);
    });
}
