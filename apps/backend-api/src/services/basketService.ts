import { prisma, RiskLevel } from '@stack/shared-types';

export interface BasketResponse {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  riskLevel: RiskLevel;
  category: string;
  performance: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonths: number;
    oneYear: number;
  };
  totalValue: number;
  assetCount: number;
}

export interface GetBasketsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  riskLevel?: RiskLevel;
}

export interface GetBasketsResponse {
  baskets: BasketResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class BasketService {
  static async getBaskets(params: GetBasketsParams = {}): Promise<GetBasketsResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      riskLevel
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    // Get total count for pagination
    const total = await prisma.basket.count({ where });

    // Get baskets with pagination
    const baskets = await prisma.basket.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { totalValue: 'desc' }, // Order by total value descending
        { name: 'asc' }
      ]
    });

    // Transform to response format
    const basketResponses: BasketResponse[] = baskets.map(basket => ({
      id: basket.id,
      name: basket.name,
      description: basket.description,
      iconUrl: basket.iconUrl,
      riskLevel: basket.riskLevel,
      category: basket.category,
      performance: {
        oneDay: basket.performanceOneDay?.toNumber() || 0,
        oneWeek: basket.performanceOneWeek?.toNumber() || 0,
        oneMonth: basket.performanceOneMonth?.toNumber() || 0,
        threeMonths: basket.performanceThreeMonths?.toNumber() || 0,
        oneYear: basket.performanceOneYear?.toNumber() || 0,
      },
      totalValue: basket.totalValue?.toNumber() || 0,
      assetCount: basket.assetCount
    }));

    return {
      baskets: basketResponses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getBasketById(id: string): Promise<BasketResponse | null> {
    const basket = await prisma.basket.findUnique({
      where: { id }
    });

    if (!basket) {
      return null;
    }

    return {
      id: basket.id,
      name: basket.name,
      description: basket.description,
      iconUrl: basket.iconUrl,
      riskLevel: basket.riskLevel,
      category: basket.category,
      performance: {
        oneDay: basket.performanceOneDay?.toNumber() || 0,
        oneWeek: basket.performanceOneWeek?.toNumber() || 0,
        oneMonth: basket.performanceOneMonth?.toNumber() || 0,
        threeMonths: basket.performanceThreeMonths?.toNumber() || 0,
        oneYear: basket.performanceOneYear?.toNumber() || 0,
      },
      totalValue: basket.totalValue?.toNumber() || 0,
      assetCount: basket.assetCount
    };
  }

  static async seedInitialBaskets(): Promise<void> {
    // Check if baskets already exist
    const existingBaskets = await prisma.basket.count();
    if (existingBaskets > 0) {
      console.log('Baskets already seeded');
      return;
    }

    const initialBaskets = [
      {
        id: 'tech-giants',
        name: 'Tech Giants',
        description: 'The biggest names in technology driving innovation forward',
        iconUrl: 'https://example.com/icons/tech.svg',
        riskLevel: RiskLevel.MEDIUM,
        category: 'Technology',
        performanceOneDay: 1.2,
        performanceOneWeek: 3.5,
        performanceOneMonth: 8.7,
        performanceThreeMonths: 15.2,
        performanceOneYear: 24.8,
        totalValue: 1250000,
        assetCount: 5
      },
      {
        id: 'green-energy',
        name: 'Green Energy',
        description: 'Sustainable energy companies building the future',
        iconUrl: 'https://example.com/icons/green.svg',
        riskLevel: RiskLevel.HIGH,
        category: 'Energy',
        performanceOneDay: 2.1,
        performanceOneWeek: 5.8,
        performanceOneMonth: 12.3,
        performanceThreeMonths: 22.1,
        performanceOneYear: 35.6,
        totalValue: 850000,
        assetCount: 8
      },
      {
        id: 'dividend-kings',
        name: 'Dividend Kings',
        description: 'Reliable companies with consistent dividend payments',
        iconUrl: 'https://example.com/icons/dividend.svg',
        riskLevel: RiskLevel.LOW,
        category: 'Income',
        performanceOneDay: 0.3,
        performanceOneWeek: 1.2,
        performanceOneMonth: 3.8,
        performanceThreeMonths: 7.5,
        performanceOneYear: 12.4,
        totalValue: 2100000,
        assetCount: 12
      },
      {
        id: 'crypto-leaders',
        name: 'Crypto Leaders',
        description: 'Top cryptocurrency and blockchain companies',
        iconUrl: 'https://example.com/icons/crypto.svg',
        riskLevel: RiskLevel.HIGH,
        category: 'Cryptocurrency',
        performanceOneDay: -1.5,
        performanceOneWeek: 8.2,
        performanceOneMonth: 18.9,
        performanceThreeMonths: -5.3,
        performanceOneYear: 45.7,
        totalValue: 650000,
        assetCount: 6
      },
      {
        id: 'healthcare-heroes',
        name: 'Healthcare Heroes',
        description: 'Medical and pharmaceutical companies improving lives',
        iconUrl: 'https://example.com/icons/healthcare.svg',
        riskLevel: RiskLevel.MEDIUM,
        category: 'Healthcare',
        performanceOneDay: 0.8,
        performanceOneWeek: 2.1,
        performanceOneMonth: 6.4,
        performanceThreeMonths: 11.8,
        performanceOneYear: 18.3,
        totalValue: 1450000,
        assetCount: 10
      }
    ];

    await prisma.basket.createMany({
      data: initialBaskets
    });

    console.log('Initial baskets seeded successfully');
  }
}
