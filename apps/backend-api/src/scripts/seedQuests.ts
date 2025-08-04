import { prisma } from '@stack/shared-types';

interface QuestSeedData {
  id: string;
  title: string;
  description: string;
  type: 'INVESTMENT_AMOUNT' | 'INVESTMENT_COUNT' | 'CARD_USAGE' | 'SOCIAL_ACTION' | 'STREAK';
  targetValue?: number;
  targetCount?: number;
  rewardType: 'XP' | 'BONUS_INVESTMENT' | 'COSMETIC' | 'DISCOUNT';
  rewardValue?: number;
}

const questTemplates: QuestSeedData[] = [
  // Investment Amount Quests
  {
    id: 'first-investment-100',
    title: 'First Steps',
    description: 'Make your first investment of $100 or more to start your journey!',
    type: 'INVESTMENT_AMOUNT',
    targetValue: 100,
    rewardType: 'XP',
    rewardValue: 500,
  },
  {
    id: 'investment-milestone-500',
    title: 'Building Momentum',
    description: 'Invest a total of $500 across all your baskets',
    type: 'INVESTMENT_AMOUNT',
    targetValue: 500,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 25,
  },
  {
    id: 'investment-milestone-1000',
    title: 'Serious Investor',
    description: 'Reach $1,000 in total investments and unlock exclusive features',
    type: 'INVESTMENT_AMOUNT',
    targetValue: 1000,
    rewardType: 'XP',
    rewardValue: 1500,
  },
  {
    id: 'investment-milestone-5000',
    title: 'Portfolio Builder',
    description: 'Achieve $5,000 in total investments and join the elite investors',
    type: 'INVESTMENT_AMOUNT',
    targetValue: 5000,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 100,
  },

  // Investment Count Quests
  {
    id: 'diversify-3-baskets',
    title: 'Diversification Master',
    description: 'Invest in 3 different baskets to spread your risk',
    type: 'INVESTMENT_COUNT',
    targetCount: 3,
    rewardType: 'XP',
    rewardValue: 750,
  },
  {
    id: 'diversify-5-baskets',
    title: 'Portfolio Architect',
    description: 'Build a well-rounded portfolio with 5 different baskets',
    type: 'INVESTMENT_COUNT',
    targetCount: 5,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 50,
  },
  {
    id: 'weekly-investments-7',
    title: 'Consistent Investor',
    description: 'Make investments for 7 consecutive days',
    type: 'INVESTMENT_COUNT',
    targetCount: 7,
    rewardType: 'XP',
    rewardValue: 1000,
  },

  // Card Usage Quests
  {
    id: 'first-card-purchase',
    title: 'Card Debut',
    description: 'Make your first purchase with your STACK virtual card',
    type: 'CARD_USAGE',
    targetCount: 1,
    rewardType: 'XP',
    rewardValue: 300,
  },
  {
    id: 'card-spending-100',
    title: 'Spender',
    description: 'Spend $100 using your STACK card',
    type: 'CARD_USAGE',
    targetValue: 100,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 10,
  },
  {
    id: 'card-spending-500',
    title: 'Big Spender',
    description: 'Spend $500 using your STACK card and earn rewards',
    type: 'CARD_USAGE',
    targetValue: 500,
    rewardType: 'DISCOUNT',
    rewardValue: 5, // 5% discount
  },

  // Social Action Quests
  {
    id: 'complete-profile',
    title: 'Profile Complete',
    description: 'Complete your profile by adding a bio and avatar',
    type: 'SOCIAL_ACTION',
    targetCount: 1,
    rewardType: 'XP',
    rewardValue: 200,
  },
  {
    id: 'refer-friend',
    title: 'Share the Wealth',
    description: 'Refer a friend to STACK and help them start investing',
    type: 'SOCIAL_ACTION',
    targetCount: 1,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 50,
  },
  {
    id: 'refer-3-friends',
    title: 'Community Builder',
    description: 'Refer 3 friends to STACK and build your network',
    type: 'SOCIAL_ACTION',
    targetCount: 3,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 200,
  },

  // Streak Quests
  {
    id: 'login-streak-7',
    title: 'Week Warrior',
    description: 'Log in to STACK for 7 consecutive days',
    type: 'STREAK',
    targetCount: 7,
    rewardType: 'XP',
    rewardValue: 500,
  },
  {
    id: 'login-streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day login streak and show your dedication',
    type: 'STREAK',
    targetCount: 30,
    rewardType: 'BONUS_INVESTMENT',
    rewardValue: 100,
  },
  {
    id: 'investment-streak-14',
    title: 'Investment Habit',
    description: 'Make an investment every day for 14 consecutive days',
    type: 'STREAK',
    targetCount: 14,
    rewardType: 'XP',
    rewardValue: 2000,
  },

  // Advanced Quests
  {
    id: 'high-risk-investment',
    title: 'Risk Taker',
    description: 'Invest in a high-risk basket and embrace the volatility',
    type: 'INVESTMENT_COUNT',
    targetCount: 1,
    rewardType: 'XP',
    rewardValue: 800,
  },
  {
    id: 'tech-basket-investor',
    title: 'Tech Enthusiast',
    description: 'Invest in any technology-focused basket',
    type: 'INVESTMENT_COUNT',
    targetCount: 1,
    rewardType: 'XP',
    rewardValue: 400,
  },
  {
    id: 'crypto-basket-investor',
    title: 'Crypto Pioneer',
    description: 'Invest in a cryptocurrency basket and join the digital revolution',
    type: 'INVESTMENT_COUNT',
    targetCount: 1,
    rewardType: 'XP',
    rewardValue: 600,
  },
];

/**
 * Seed initial quests into the database
 */
export async function seedQuests(): Promise<void> {
  console.log('🎯 Starting quest seeding...');

  try {
    // Check if quests already exist
    const existingQuests = await prisma.quest.count();
    if (existingQuests > 0) {
      console.log('✅ Quests already seeded, skipping...');
      return;
    }

    // Create quests
    for (const questTemplate of questTemplates) {
      try {
        await prisma.quest.create({
          data: {
            id: questTemplate.id,
            title: questTemplate.title,
            description: questTemplate.description,
            type: questTemplate.type,
            targetValue: questTemplate.targetValue ? questTemplate.targetValue.toString() : null,
            targetCount: questTemplate.targetCount,
            rewardType: questTemplate.rewardType,
            rewardValue: questTemplate.rewardValue ? questTemplate.rewardValue.toString() : null,
            isActive: true,
          },
        });

        console.log(`✅ Created quest: ${questTemplate.title}`);
      } catch (error) {
        console.error(`❌ Failed to create quest ${questTemplate.title}:`, error);
      }
    }

    console.log(`🎯 Successfully seeded ${questTemplates.length} quests!`);
  } catch (error) {
    console.error('❌ Error seeding quests:', error);
    throw error;
  }
}

/**
 * Run the seeding function if this file is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuests()
    .then(() => {
      console.log('✅ Quest seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Quest seeding failed:', error);
      process.exit(1);
    });
}

export default seedQuests;