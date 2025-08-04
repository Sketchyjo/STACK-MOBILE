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

// GET /baskets/:id - Get specific basket details with chart data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe = '1M' } = req.query;
    
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
    
    // Generate mock chart data based on timeframe
    const chartData = generateMockChartData(timeframe as string, performance.percentage);
    
    // Enhanced asset details with mock data
    const enhancedAssets = Array.isArray(basket.assets) ? basket.assets.map((asset: any) => ({
      symbol: asset.symbol,
      name: asset.name || getAssetName(asset.symbol),
      weight: asset.weight || 0,
      type: asset.type || 'stock',
      price: generateMockPrice(asset.symbol),
      change: generateMockChange(),
      changePercent: generateMockChangePercent(),
      logoUrl: asset.logoUrl || generateLogoUrl(asset.symbol),
      allocation: asset.weight || 0,
    })) : [];
    
    // Remove holdings from response as we've processed them
    const { holdings, ...basketData } = basket;
    
    res.json({
      id: basketData.id,
      name: basketData.name,
      description: basketData.description,
      iconUrl: basketData.iconUrl,
      riskLevel: basketData.riskLevel,
      category,
      performance: {
        ...performance,
        oneDay: generateMockPerformance(),
        oneWeek: generateMockPerformance(),
        oneMonth: generateMockPerformance(),
        threeMonth: generateMockPerformance(),
        sixMonth: generateMockPerformance(),
        oneYear: generateMockPerformance(),
        ytd: generateMockPerformance(),
      },
      totalValue,
      assetCount,
      assets: enhancedAssets,
      chartData,
      timeframe,
      createdAt: basketData.createdAt,
      updatedAt: basketData.updatedAt,
    });
    
  } catch (error) {
    console.error('Error fetching basket:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch basket',
    });
  }
});

// Helper functions for mock data generation
function generateMockChartData(timeframe: string, basePerformance: number) {
  const dataPoints = [];
  let points = 30; // Default for 1M
  
  switch (timeframe) {
    case '1W':
      points = 7;
      break;
    case '1M':
      points = 30;
      break;
    case '3M':
      points = 90;
      break;
    case '6M':
      points = 180;
      break;
    case '1Y':
      points = 365;
      break;
    default:
      points = 30;
  }
  
  const baseValue = 1000;
  let currentValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    
    // Generate realistic price movement
    const randomChange = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
    currentValue *= (1 + randomChange);
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2)),
      timestamp: date.getTime(),
    });
  }
  
  // Adjust final value to match performance
  const finalAdjustment = 1 + (basePerformance / 100);
  const lastPoint = dataPoints[dataPoints.length - 1];
  lastPoint.value = Number((baseValue * finalAdjustment).toFixed(2));
  
  return dataPoints;
}

function getAssetName(symbol: string): string {
  const assetNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SPY': 'SPDR S&P 500 ETF',
  };
  
  return assetNames[symbol] || symbol;
}

function generateMockPrice(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'AAPL': 175.50,
    'MSFT': 378.25,
    'GOOGL': 138.75,
    'AMZN': 145.30,
    'META': 325.80,
    'TSLA': 248.50,
    'NVDA': 875.25,
  };
  
  const basePrice = basePrices[symbol] || 100;
  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  return Number((basePrice * (1 + variation)).toFixed(2));
}

function generateMockChange(): number {
  return Number(((Math.random() - 0.5) * 10).toFixed(2)); // ±$5 change
}

function generateMockChangePercent(): number {
  return Number(((Math.random() - 0.5) * 6).toFixed(2)); // ±3% change
}

function generateMockPerformance(): number {
  return Number(((Math.random() - 0.3) * 20).toFixed(2)); // Slightly positive bias
}

function generateLogoUrl(symbol: string): string {
  return `https://logo.clearbit.com/${symbol.toLowerCase()}.com`;
}

export { router as basketsRouter };
