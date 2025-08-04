import { Router } from 'express';
import { prisma } from '@stack/shared-types';
import { z } from 'zod';

const router = Router();

// Query schema for feed customization
const feedQuerySchema = z.object({
  limit: z.string().transform(Number).optional().default('10'),
  includeBaskets: z
    .string()
    .transform(val => val === 'true')
    .optional()
    .default('true'),
  includeQuests: z
    .string()
    .transform(val => val === 'true')
    .optional()

    .default('true'),
  includeTips: z
    .string()
    .transform(val => val === 'true')
    .optional()
    .default('true'),
});

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to extract category from assets
const extractCategoryFromAssets = (assets: any): string => {
  if (!Array.isArray(assets) || assets.length === 0) {
    return 'Mixed';
  }

  const assetTypes = assets.map(
    asset => asset.type || asset.symbol?.toLowerCase()
  );

  if (assetTypes.some(type => ['btc', 'eth', 'crypto'].includes(type))) {
    return 'Crypto';
  }
  if (assetTypes.some(type => ['stock', 'equity'].includes(type))) {
    return 'Stocks';

  }
  if (assetTypes.some(type => ['bond', 'treasury'].includes(type))) {
    return 'Bonds';
  }
  if (assetTypes.some(type => ['reit', 'real estate'].includes(type))) {

    return 'Real Estate';
  }

  return 'Mixed';
};

/**
 * @route GET /api/feed
 * @desc Get personalized feed with baskets, quests, and AI tips
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const query = feedQuerySchema.parse(req.query);
    const feedItems: any[] = [];

    // Fetch random baskets if requested
    if (query.includeBaskets) {
      const baskets = await prisma.basket.findMany({
        take: 20, // Get more than needed to allow for randomization
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          iconUrl: true,
          riskLevel: true,
          assets: true,
          isCommunity: true,
          curatorId: true,
          createdAt: true,
          holdings: {
            select: {
              currentValue: true,
              totalAmountInvested: true,
            },
          },
        },
      });

      // Process and randomize baskets
      const processedBaskets = baskets.map((basket: any) => {
        const category = extractCategoryFromAssets(basket.assets);

        let performance = {
          value: Math.random() * 30 - 10, // Random performance between -10% and 20%
          isPositive: Math.random() > 0.4, // 60% chance of positive performance
          chartData: Array.from(
            { length: 7 },
            () => Math.floor(Math.random() * 100) + 20
          ),
        };

        // If we have real holdings data, use it
        if (basket.holdings.length > 0) {
          const totalInvested = basket.holdings.reduce(
            (sum: number, holding: any) =>
              sum + Number(holding.totalAmountInvested),
            0
          );
          const totalCurrent = basket.holdings.reduce(
            (sum: number, holding: any) => sum + Number(holding.currentValue),
            0
          );

          if (totalInvested > 0) {
            const returnPercentage =
              ((totalCurrent - totalInvested) / totalInvested) * 100;
            performance.value = Number(returnPercentage.toFixed(2));
            performance.isPositive = returnPercentage >= 0;
          }
        }

        // Generate mock stocks data from assets
        const stocks = Array.isArray(basket.assets)
          ? basket.assets.slice(0, 3).map((asset: any, index: number) => ({
              id: `s${index + 1}`,
              symbol:
                asset.symbol ||
                asset.name?.substring(0, 4).toUpperCase() ||
                'STOCK',
              avatar: `https://placehold.co/24x24/${['000000', 'EA4335', '00A4EF', '34A853'][index % 4]}/FFFFFF?text=${(asset.symbol || asset.name || 'S')[0]}`,
              allocation: asset.weight
                ? Math.round(asset.weight * 100)
                : Math.floor(Math.random() * 40) + 20,
            }))
          : [];

        const { holdings, ...basketData } = basket;
        console.log("basket", basketData.assets)
        return {
          id: basketData.id,
          type: 'basket' as const,
          data: {
            id: basketData.id,
            name: basketData.name,
            description: basketData.description,
            iconUrl:
              basketData.iconUrl ||
              `https://placehold.co/48x48/6366F1/FFFFFF?text=${basketData.name[0]}`,
            riskLevel: basketData.riskLevel,
            category: category,
            performance: {
              percentage: performance.value,
              period: '1M',
              isPositive: performance.isPositive,
            },
            totalValue: Math.floor(Math.random() * 100000) + 10000,

           assetCount: stocks.length,
            assets: stocks.map((stock: any) => ({
              symbol: stock.symbol,
              allocation: stock.allocation,
              name: stock.symbol,
              avatar: stock.logoUrl,
            })),
          },
        };
      });

      // Randomly select 2-3 baskets
      const selectedBaskets = shuffleArray(processedBaskets).slice(
        0,
        Math.floor(Math.random() * 2) + 2
      );
      feedItems.push(...selectedBaskets);
    }

    // Fetch random quests if requested
    if (query.includeQuests) {
      const quests = await prisma.quest.findMany({
        where: {
          isActive: true,
        },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          rewardType: true,
          rewardValue: true,
          targetValue: true,
          targetCount: true,
        },
      });

      const processedQuests = quests.map((quest: any) => ({
        id: quest.id,
        type: 'quest' as const,
        data: {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          type: quest.type,
          reward: {
            type: quest.rewardType || 'POINTS',
            value: quest.rewardValue
              ? Number(quest.rewardValue)
              : Math.floor(Math.random() * 200) + 50,
          },
          progress: {
            current: Math.floor(Math.random() * 80),
            target: quest.targetValue ? Number(quest.targetValue) : 100,
            percentage: Math.floor(Math.random() * 80),
          },
          isCompleted: false,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      }));

      // Randomly select 1-2 quests
      const selectedQuests = shuffleArray(processedQuests).slice(
        0,
        Math.floor(Math.random() * 2) + 1
      );
      feedItems.push(...selectedQuests);
    }

    // Fetch random AI tips if requested
    if (query.includeTips) {
      const tips = await prisma.expertTip.findMany({
        where: {
          isActive: true,
        },
        take: 10,
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
        },
      });

      const processedTips = tips.map((tip: any) => ({
        id: tip.id,
        type: 'ai_tip' as const,
        data: {
          id: tip.id,
          title: tip.title,
          content: tip.content,
          category: tip.category,
          readTime: Math.floor(tip.content.length / 200) + 1,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
        },
      }));

      // Randomly select 1-2 tips
      const selectedTips = shuffleArray(processedTips).slice(
        0,
        Math.floor(Math.random() * 2) + 1
      );
      feedItems.push(...selectedTips);
    }

    // Shuffle the final feed and limit results
    const finalFeed = shuffleArray(feedItems).slice(0, query.limit);

    res.json({
      items: finalFeed,
      total: finalFeed.length,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch feed data',
    });
  }
});

// Helper function to get quest icon based on type
function getQuestIcon(questType: string): string {
  const iconMap: Record<string, string> = {
    INVESTMENT_AMOUNT: 'target',
    INVESTMENT_COUNT: 'git-merge',
    CARD_USAGE: 'credit-card',
    SOCIAL_ACTION: 'users',
    STREAK: 'zap',
  };

  return iconMap[questType] || 'target';
}

export { router as feedRouter };
