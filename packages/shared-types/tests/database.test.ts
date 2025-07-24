import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { checkDatabaseConnection, disconnectDatabase } from '../src/database';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

describe('Database Connection', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.$disconnect();
    await disconnectDatabase();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.userTipInteraction.deleteMany();
    await prisma.userFeedInteraction.deleteMany();
    await prisma.userQuest.deleteMany();
    await prisma.userBattlePass.deleteMany();
    await prisma.portfolioHolding.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.autoInvestment.deleteMany();
    await prisma.investmentSchedule.deleteMany();
    await prisma.userPreference.deleteMany();
    await prisma.virtualCard.deleteMany();
    await prisma.portfolio.deleteMany();
    await prisma.user.deleteMany();
    await prisma.feedItem.deleteMany();
    await prisma.expertTip.deleteMany();
    await prisma.quest.deleteMany();
    await prisma.battlePass.deleteMany();
    await prisma.basket.deleteMany();
  });

  it('should connect to the database successfully', async () => {
    const isConnected = await checkDatabaseConnection();
    expect(isConnected).toBe(true);
  });

  it('should create and retrieve a user', async () => {
    const userData = {
      walletAddress: '0x1234567890123456789012345678901234567890',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const createdUser = await prisma.user.create({
      data: userData,
    });

    expect(createdUser.id).toBeDefined();
    expect(createdUser.walletAddress).toBe(userData.walletAddress);
    expect(createdUser.displayName).toBe(userData.displayName);
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.isCurator).toBe(false);

    const retrievedUser = await prisma.user.findUnique({
      where: { id: createdUser.id },
    });

    expect(retrievedUser).toEqual(createdUser);
  });

  it('should create a basket with proper relationships', async () => {
    const basketData = {
      name: 'Test Basket',
      description: 'A test basket for unit testing',
      riskLevel: 'MEDIUM' as const,
      assets: [
        { symbol: 'AAPL', weight: 0.5, name: 'Apple Inc.' },
        { symbol: 'MSFT', weight: 0.5, name: 'Microsoft Corporation' },
      ],
      isCommunity: false,
    };

    const createdBasket = await prisma.basket.create({
      data: basketData,
    });

    expect(createdBasket.id).toBeDefined();
    expect(createdBasket.name).toBe(basketData.name);
    expect(createdBasket.riskLevel).toBe(basketData.riskLevel);
    expect(createdBasket.assets).toEqual(basketData.assets);
  });

  it('should create a user with portfolio and holdings', async () => {
    // Create a basket first
    const basket = await prisma.basket.create({
      data: {
        name: 'Test Basket',
        description: 'Test basket',
        riskLevel: 'MEDIUM',
        assets: [{ symbol: 'AAPL', weight: 1.0, name: 'Apple Inc.' }],
      },
    });

    // Create a user
    const user = await prisma.user.create({
      data: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        displayName: 'Test User',
      },
    });

    // Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id,
        totalValue: 1000,
      },
    });

    // Create portfolio holding
    const holding = await prisma.portfolioHolding.create({
      data: {
        portfolioId: portfolio.id,
        basketId: basket.id,
        unitsOwned: 10,
        totalAmountInvested: 1000,
        currentValue: 1100,
      },
    });

    // Verify relationships
    const userWithPortfolio = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        portfolio: {
          include: {
            holdings: {
              include: {
                basket: true,
              },
            },
          },
        },
      },
    });

    expect(userWithPortfolio?.portfolio).toBeDefined();
    expect(userWithPortfolio?.portfolio?.holdings).toHaveLength(1);
    expect(userWithPortfolio?.portfolio?.holdings[0].basket.name).toBe('Test Basket');
  });

  it('should create and manage quests', async () => {
    // Create a quest
    const quest = await prisma.quest.create({
      data: {
        title: 'Test Quest',
        description: 'A test quest',
        type: 'INVESTMENT_AMOUNT',
        targetValue: 100,
        rewardType: 'XP',
        rewardValue: 50,
      },
    });

    // Create a user
    const user = await prisma.user.create({
      data: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        displayName: 'Test User',
      },
    });

    // Create user quest progress
    const userQuest = await prisma.userQuest.create({
      data: {
        userId: user.id,
        questId: quest.id,
        progress: 50,
      },
    });

    expect(userQuest.progress).toBe(50);
    expect(userQuest.isCompleted).toBe(false);

    // Update progress to complete
    const completedQuest = await prisma.userQuest.update({
      where: { id: userQuest.id },
      data: {
        progress: 100,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    expect(completedQuest.isCompleted).toBe(true);
    expect(completedQuest.completedAt).toBeDefined();
  });

  it('should handle transactions properly', async () => {
    // Create a user
    const user = await prisma.user.create({
      data: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        displayName: 'Test User',
      },
    });

    // Create a transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: 100,
        type: 'INVESTMENT',
        status: 'COMPLETED',
        description: 'Test investment transaction',
      },
    });

    expect(transaction.amount).toBe(100);
    expect(transaction.type).toBe('INVESTMENT');
    expect(transaction.status).toBe('COMPLETED');

    // Query transactions by user
    const userTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
    });

    expect(userTransactions).toHaveLength(1);
    expect(userTransactions[0].id).toBe(transaction.id);
  });
});