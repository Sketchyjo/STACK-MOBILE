import { Router } from 'express';
import { prisma } from '@stack/shared-types';
import { z } from 'zod';

const router = Router();

// Query schema for filtering and searching
const basketQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

// Helper function to extract category from assets
const extractCategoryFromAssets = (assets: any): string => {
  if (!Array.isArray(assets) || assets.length === 0) {
    return 'Mixed';
  }

  // Simple category mapping based on asset types
  const assetTypes = assets.map(asset => asset.type || asset.symbol?.toLowerCase());

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

// GET /baskets - Get all baskets with optional filtering
router.get('/', async (req, res) => {
  try {
    const query = basketQuerySchema.parse(req.query);

    // Build where clause for filtering
    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.riskLevel) {
      where.riskLevel = query.riskLevel;
    }

    // Get baskets with pagination
    const baskets = await prisma.basket.findMany({
      where,
      take: query.limit || 20,
      skip: query.offset || 0,
      orderBy: [
        { createdAt: 'desc' }
      ],
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
        updatedAt: true,
        // Include performance data from holdings if available
        holdings: {
          select: {
            currentValue: true,
            totalAmountInvested: true,
          }
        }
      }
    });

    // Calculate performance indicators and format response for each basket
    const basketsWithPerformance = baskets.map((basket: any) => {
      const category = extractCategoryFromAssets(basket.assets);

      // Filter by category if specified
      if (query.category && category !== query.category) {
        return null;
      }

      let performance = {
        percentage: 0,
        period: '1D',
        isPositive: false,
      };

      let totalValue = 0;
      let assetCount = 0;

      if (basket.holdings.length > 0) {
        const totalInvested = basket.holdings.reduce((sum: number, holding: any) =>
          sum + Number(holding.totalAmountInvested), 0);
        const totalCurrent = basket.holdings.reduce((sum: number, holding: any) =>
          sum + Number(holding.currentValue), 0);

        if (totalInvested > 0) {
          const returnPercentage = ((totalCurrent - totalInvested) / totalInvested) * 100;
          performance = {
            percentage: Number(returnPercentage.toFixed(2)),
            period: '1D',
            isPositive: returnPercentage >= 0,
          };
        }

        totalValue = totalCurrent;
      }

      // Count assets from the assets JSON
      if (Array.isArray(basket.assets)) {
        assetCount = basket.assets.length;
      }

      // Remove holdings from response as we've processed them
      const { holdings, ...basketData } = basket;

      return {
        id: basketData.id,
        name: basketData.name,
        description: basketData.description,
        iconUrl: basketData.iconUrl,
        riskLevel: basketData.riskLevel,
        category,
        performance,
        totalValue,
        assetCount,
        assets: basketData.assets, // Include full asset details
      };
    }).filter(Boolean); // Remove null entries from category filtering

    // Get total count for pagination
    const totalCount = await prisma.basket.count({ where });

    res.json({
      baskets: basketsWithPerformance,
      pagination: {
        total: totalCount,
        limit: query.limit || 20,
        offset: query.offset || 0,
        hasMore: (query.offset || 0) + (query.limit || 20) < totalCount,
      }
    });

  } catch (error) {
    console.error('Error fetching baskets:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch baskets',
    });
  }
});

// GET /baskets/:id - Get specific basket details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const basket = await prisma.basket.findUnique({
      where: { id },
      include: {
        holdings: {
          select: {
            currentValue: true,
            totalAmountInvested: true,
            unitsOwned: true,
          }
        }
      }
    });
    
    if (!basket) {
      return res.status(404).json({
        error: 'Basket not found',
      });
    }
    
    const category = extractCategoryFromAssets(basket.assets);
    
    let performance = {
      percentage: 0,
      period: '1D',
      isPositive: false,
    };
    
    let totalValue = 0;
    let assetCount = 0;
    
    if (basket.holdings.length > 0) {
      const totalInvested = basket.holdings.reduce((sum: number, holding: any) => 
        sum + Number(holding.totalAmountInvested), 0);
      const totalCurrent = basket.holdings.reduce((sum: number, holding: any) => 
        sum + Number(holding.currentValue), 0);
      
      if (totalInvested > 0) {
        const returnPercentage = ((totalCurrent - totalInvested) / totalInvested) * 100;
        performance = {
          percentage: Number(returnPercentage.toFixed(2)),
          period: '1D',
          isPositive: returnPercentage >= 0,
        };
      }
      
      totalValue = totalCurrent;
    }
    
    // Count assets from the assets JSON
    if (Array.isArray(basket.assets)) {
      assetCount = basket.assets.length;
    }
    
    // Remove holdings from response as we've processed them
    const { holdings, ...basketData } = basket;
    
    res.json({
      id: basketData.id,
      name: basketData.name,
      description: basketData.description,
      iconUrl: basketData.iconUrl,
      riskLevel: basketData.riskLevel,
      category,
      performance,
      totalValue,
      assetCount,
      assets: basketData.assets, // Include full asset details
    });
    
  } catch (error) {
    console.error('Error fetching basket:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch basket',
    });
  }
});

export { router as basketsRouter };
