import { prisma } from '@stack/shared-types';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface BasketSeedData {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  riskLevel: RiskLevel;
  assets: Array<{
    symbol: string;
    name: string;
    weight: number;
    type: string;
  }>;
  isCommunity: boolean;
}

const sampleBaskets: BasketSeedData[] = [
  {
    id: 'tech-giants-basket',
    name: 'Tech Giants',
    description: 'The biggest names in technology driving innovation forward',
    iconUrl: 'https://example.com/icons/tech.svg',
    riskLevel: 'MEDIUM',
    assets: [
      { symbol: 'AAPL', name: 'Apple Inc.', weight: 25, type: 'stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 25, type: 'stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 20, type: 'stock' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 15, type: 'stock' },
      { symbol: 'META', name: 'Meta Platforms Inc.', weight: 15, type: 'stock' }
    ],
    isCommunity: false,
  },
  {
    id: 'crypto-leaders-basket',
    name: 'Crypto Leaders',
    description: 'Top cryptocurrency and blockchain companies',
    iconUrl: 'https://example.com/icons/crypto.svg',
    riskLevel: 'HIGH',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', weight: 40, type: 'crypto' },
      { symbol: 'ETH', name: 'Ethereum', weight: 30, type: 'crypto' },
      { symbol: 'BNB', name: 'Binance Coin', weight: 15, type: 'crypto' },
      { symbol: 'ADA', name: 'Cardano', weight: 10, type: 'crypto' },
      { symbol: 'SOL', name: 'Solana', weight: 5, type: 'crypto' }
    ],
    isCommunity: true,
  },
  {
    id: 'dividend-kings-basket',
    name: 'Dividend Kings',
    description: 'Reliable companies with consistent dividend payments',
    iconUrl: 'https://example.com/icons/dividend.svg',
    riskLevel: 'LOW',
    assets: [
      { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 20, type: 'stock' },
      { symbol: 'PG', name: 'Procter & Gamble', weight: 18, type: 'stock' },
      { symbol: 'KO', name: 'The Coca-Cola Company', weight: 15, type: 'stock' },
      { symbol: 'PEP', name: 'PepsiCo Inc.', weight: 15, type: 'stock' },
      { symbol: 'WMT', name: 'Walmart Inc.', weight: 12, type: 'stock' },
      { symbol: 'MCD', name: 'McDonald\'s Corporation', weight: 10, type: 'stock' },
      { symbol: 'VZ', name: 'Verizon Communications', weight: 10, type: 'stock' }
    ],
    isCommunity: false,
  },
  {
    id: 'green-energy-basket',
    name: 'Green Energy',
    description: 'Sustainable energy companies building the future',
    iconUrl: 'https://example.com/icons/green.svg',
    riskLevel: 'HIGH',
    assets: [
      { symbol: 'TSLA', name: 'Tesla Inc.', weight: 25, type: 'stock' },
      { symbol: 'ENPH', name: 'Enphase Energy', weight: 15, type: 'stock' },
      { symbol: 'SEDG', name: 'SolarEdge Technologies', weight: 15, type: 'stock' },
      { symbol: 'NEE', name: 'NextEra Energy', weight: 12, type: 'stock' },
      { symbol: 'FSLR', name: 'First Solar', weight: 10, type: 'stock' },
      { symbol: 'PLUG', name: 'Plug Power', weight: 8, type: 'stock' },
      { symbol: 'SPWR', name: 'SunPower Corporation', weight: 8, type: 'stock' },
      { symbol: 'RUN', name: 'Sunrun Inc.', weight: 7, type: 'stock' }
    ],
    isCommunity: true,
  },
  {
    id: 'healthcare-heroes-basket',
    name: 'Healthcare Heroes',
    description: 'Medical and pharmaceutical companies improving lives',
    iconUrl: 'https://example.com/icons/healthcare.svg',
    riskLevel: 'MEDIUM',
    assets: [
      { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 18, type: 'stock' },
      { symbol: 'PFE', name: 'Pfizer Inc.', weight: 16, type: 'stock' },
      { symbol: 'UNH', name: 'UnitedHealth Group', weight: 15, type: 'stock' },
      { symbol: 'ABBV', name: 'AbbVie Inc.', weight: 12, type: 'stock' },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific', weight: 10, type: 'stock' },
      { symbol: 'ABT', name: 'Abbott Laboratories', weight: 9, type: 'stock' },
      { symbol: 'LLY', name: 'Eli Lilly and Company', weight: 8, type: 'stock' },
      { symbol: 'BMY', name: 'Bristol-Myers Squibb', weight: 7, type: 'stock' },
      { symbol: 'AMGN', name: 'Amgen Inc.', weight: 5, type: 'stock' }
    ],
    isCommunity: false,
  },
  {
    id: 'real-estate-basket',
    name: 'Real Estate Leaders',
    description: 'Real Estate Investment Trusts and property companies',
    iconUrl: 'https://example.com/icons/realestate.svg',
    riskLevel: 'MEDIUM',
    assets: [
      { symbol: 'AMT', name: 'American Tower Corporation', weight: 20, type: 'reit' },
      { symbol: 'PLD', name: 'Prologis Inc.', weight: 18, type: 'reit' },
      { symbol: 'CCI', name: 'Crown Castle International', weight: 15, type: 'reit' },
      { symbol: 'EQIX', name: 'Equinix Inc.', weight: 12, type: 'reit' },
      { symbol: 'SPG', name: 'Simon Property Group', weight: 10, type: 'reit' },
      { symbol: 'O', name: 'Realty Income Corporation', weight: 10, type: 'reit' },
      { symbol: 'WELL', name: 'Welltower Inc.', weight: 8, type: 'reit' },
      { symbol: 'AVB', name: 'AvalonBay Communities', weight: 7, type: 'reit' }
    ],
    isCommunity: true,
  }
];

async function seedBaskets() {
  try {
    console.log('🌱 Starting basket seeding...');
    
    // Check if baskets already exist
    const existingBaskets = await prisma.basket.count();
    if (existingBaskets > 0) {
      console.log('📦 Baskets already exist, skipping seed');
      return;
    }

    // Create baskets
    for (const basket of sampleBaskets) {
      await prisma.basket.create({
        data: basket
      });
      console.log(`✅ Created basket: ${basket.name}`);
    }

    console.log('🎉 Basket seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding baskets:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBaskets();
}

export { seedBaskets };
