import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample baskets
  const techBasket = await prisma.basket.create({
    data: {
      name: 'Tech Giants',
      description: 'A diversified basket of leading technology companies',
      riskLevel: 'MEDIUM',
      assets: [
        { symbol: 'AAPL', weight: 0.25, name: 'Apple Inc.' },
        { symbol: 'MSFT', weight: 0.25, name: 'Microsoft Corporation' },
        { symbol: 'GOOGL', weight: 0.25, name: 'Alphabet Inc.' },
        { symbol: 'AMZN', weight: 0.25, name: 'Amazon.com Inc.' }
      ],
      isCommunity: false,
    },
  });

  const sustainableBasket = await prisma.basket.create({
    data: {
      name: 'Sustainable Future',
      description: 'ESG-focused investments for a sustainable tomorrow',
      riskLevel: 'MEDIUM',
      assets: [
        { symbol: 'TSLA', weight: 0.3, name: 'Tesla Inc.' },
        { symbol: 'NEE', weight: 0.2, name: 'NextEra Energy' },
        { symbol: 'ENPH', weight: 0.2, name: 'Enphase Energy' },
        { symbol: 'ICLN', weight: 0.3, name: 'iShares Global Clean Energy ETF' }
      ],
      isCommunity: false,
    },
  });

  const conservativeBasket = await prisma.basket.create({
    data: {
      name: 'Conservative Growth',
      description: 'Low-risk investments for steady growth',
      riskLevel: 'LOW',
      assets: [
        { symbol: 'VTI', weight: 0.4, name: 'Vanguard Total Stock Market ETF' },
        { symbol: 'BND', weight: 0.3, name: 'Vanguard Total Bond Market ETF' },
        { symbol: 'VEA', weight: 0.2, name: 'Vanguard FTSE Developed Markets ETF' },
        { symbol: 'VWO', weight: 0.1, name: 'Vanguard FTSE Emerging Markets ETF' }
      ],
      isCommunity: false,
    },
  });

  // Create sample quests
  const firstInvestmentQuest = await prisma.quest.create({
    data: {
      title: 'First Investment',
      description: 'Make your first investment of any amount',
      type: 'INVESTMENT_AMOUNT',
      targetValue: 1,
      rewardType: 'XP',
      rewardValue: 100,
      isActive: true,
    },
  });

  const weeklyInvestorQuest = await prisma.quest.create({
    data: {
      title: 'Weekly Investor',
      description: 'Invest for 7 consecutive days',
      type: 'STREAK',
      targetCount: 7,
      rewardType: 'BONUS_INVESTMENT',
      rewardValue: 5,
      isActive: true,
    },
  });

  const bigSpenderQuest = await prisma.quest.create({
    data: {
      title: 'Big Spender',
      description: 'Use your virtual card for purchases totaling $100',
      type: 'CARD_USAGE',
      targetValue: 100,
      rewardType: 'XP',
      rewardValue: 250,
      isActive: true,
    },
  });

  // Create sample battle pass
  const currentBattlePass = await prisma.battlePass.create({
    data: {
      season: 'Season 1: Foundation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      isActive: true,
      tiers: [
        { tier: 1, xpRequired: 0, rewards: [{ type: 'XP', value: 50 }] },
        { tier: 2, xpRequired: 100, rewards: [{ type: 'COSMETIC', value: 'Bronze Badge' }] },
        { tier: 3, xpRequired: 250, rewards: [{ type: 'BONUS_INVESTMENT', value: 5 }] },
        { tier: 4, xpRequired: 500, rewards: [{ type: 'COSMETIC', value: 'Silver Badge' }] },
        { tier: 5, xpRequired: 1000, rewards: [{ type: 'BONUS_INVESTMENT', value: 10 }] },
        { tier: 6, xpRequired: 2000, rewards: [{ type: 'COSMETIC', value: 'Gold Badge' }] },
        { tier: 7, xpRequired: 3500, rewards: [{ type: 'BONUS_INVESTMENT', value: 25 }] },
        { tier: 8, xpRequired: 5000, rewards: [{ type: 'COSMETIC', value: 'Platinum Badge' }] },
        { tier: 9, xpRequired: 7500, rewards: [{ type: 'BONUS_INVESTMENT', value: 50 }] },
        { tier: 10, xpRequired: 10000, rewards: [{ type: 'COSMETIC', value: 'Diamond Badge' }] }
      ],
    },
  });

  // Create sample expert tips
  const diversificationTip = await prisma.expertTip.create({
    data: {
      title: 'The Power of Diversification',
      content: 'Diversifying your investments across different asset classes and sectors can help reduce risk while maintaining growth potential. Consider spreading your investments across multiple baskets.',
      category: 'INVESTMENT_STRATEGY',
      triggerEvent: 'POST_INVESTMENT',
      isActive: true,
    },
  });

  const dollarCostAveragingTip = await prisma.expertTip.create({
    data: {
      title: 'Dollar-Cost Averaging Strategy',
      content: 'Investing a fixed amount regularly, regardless of market conditions, can help smooth out market volatility over time. Set up automatic investments to take advantage of this strategy.',
      category: 'INVESTMENT_STRATEGY',
      triggerEvent: 'WEEKLY_SUMMARY',
      isActive: true,
    },
  });

  const marketVolatilityTip = await prisma.expertTip.create({
    data: {
      title: 'Understanding Market Volatility',
      content: 'Market ups and downs are normal. Stay focused on your long-term goals and avoid making emotional decisions during volatile periods.',
      category: 'FINANCIAL_EDUCATION',
      triggerEvent: 'MARKET_MOVEMENT',
      isActive: true,
    },
  });

  // Create sample feed items
  const techBasketFeed = await prisma.feedItem.create({
    data: {
      type: 'BASKET_RECOMMENDATION',
      title: 'Tech Giants Basket',
      description: 'Invest in the world\'s leading technology companies',
      targetId: techBasket.id,
      priority: 10,
      isActive: true,
    },
  });

  const sustainableFeed = await prisma.feedItem.create({
    data: {
      type: 'BASKET_RECOMMENDATION',
      title: 'Sustainable Future',
      description: 'Build a greener portfolio with ESG-focused investments',
      targetId: sustainableBasket.id,
      priority: 8,
      isActive: true,
    },
  });

  const questFeed = await prisma.feedItem.create({
    data: {
      type: 'QUEST_SUGGESTION',
      title: 'Complete Your First Investment',
      description: 'Start your investment journey and earn XP',
      targetId: firstInvestmentQuest.id,
      priority: 15,
      isActive: true,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`Created ${3} baskets`);
  console.log(`Created ${3} quests`);
  console.log(`Created ${1} battle pass`);
  console.log(`Created ${3} expert tips`);
  console.log(`Created ${3} feed items`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });