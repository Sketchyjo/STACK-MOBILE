# Polygon.io Setup Guide

## Quick Start

This guide walks through setting up Polygon.io API integration for real-time stock market data in the STACK mobile app using the official Polygon.io JavaScript client SDK.

## Prerequisites

1. **Polygon.io Account**: Sign up at [polygon.io](https://polygon.io)
2. **API Key**: Get your free API key (5 calls/minute) or upgrade for higher limits
3. **Development Environment**: Ensure you have access to backend environment variables

## Step 1: Environment Configuration

### Backend Environment Variables
Add to your AWS Lambda environment or local `.env` file:

```bash
# Polygon.io Configuration
POLYGON_API_KEY=your_polygon_api_key_here
```

### Vercel Environment Variables
For the API Gateway (Vercel Serverless Functions):

```bash
# Add via Vercel Dashboard or CLI
vercel env add POLYGON_API_KEY
```

## Step 2: Backend Service Implementation

### Install Dependencies
```bash
# In your backend service directory
pnpm install --save '@polygon.io/client-js'
pnpm install @types/node  # if using TypeScript
```

### Create Polygon Service
Create `apps/backend/services/portfolio/src/polygon.ts`:

```typescript
import { restClient } from '@polygon.io/client-js';

export interface StockPrice {
  ticker: string;
  price: number;
  timestamp: number;
}

export interface HistoricalDataPoint {
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  volumeWeightedAveragePrice: number;
  timestamp: number;
}

export interface HistoricalData {
  ticker: string;
  results: HistoricalDataPoint[];
  queryCount: number;
  resultsCount: number;
}

export class PolygonRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolygonRateLimitError';
  }
}

export class PolygonService {
  private client: any;
  private rateLimit: number;
  private lastRequestTime: number = 0;
  private requestCount: number = 0;

  constructor() {
    const apiKey = process.env.POLYGON_API_KEY;
    
    if (!apiKey) {
      throw new Error('POLYGON_API_KEY environment variable is required');
    }

    // Initialize the Polygon REST client
    this.client = restClient(apiKey);
    this.rateLimit = 5; // Free tier default
  }

  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Reset counter if more than a minute has passed
    if (now - this.lastRequestTime > oneMinute) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    // Check if we've exceeded rate limit
    if (this.requestCount >= this.rateLimit) {
      const waitTime = oneMinute - (now - this.lastRequestTime);
      throw new PolygonRateLimitError(`Rate limit exceeded. Wait ${waitTime}ms`);
    }

    this.requestCount++;
  }

  async getStockPrice(ticker: string): Promise<number> {
    await this.rateLimitCheck();

    try {
      // Get previous day's close price using aggregates
      const data = await this.client.stocks.aggregates(ticker, 1, "day", "2023-01-01", "2023-12-31", { limit: 1, order: "desc" });
      
      if (!data || !data.results || data.results.length === 0) {
        throw new Error(`No data found for ticker: ${ticker}`);
      }

      return data.results[0].c; // Close price
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new PolygonRateLimitError('API rate limit exceeded');
      }
      throw new Error(`Polygon API error: ${error.message}`);
    }
  }

  async getLastTrade(ticker: string): Promise<StockPrice> {
    await this.rateLimitCheck();

    try {
      const data = await this.client.stocks.lastTrade(ticker);
      
      if (!data || !data.results) {
        throw new Error(`No trade data found for ticker: ${ticker}`);
      }

      return {
        ticker,
        price: data.results.p, // Trade price
        timestamp: data.results.t // Trade timestamp
      };
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new PolygonRateLimitError('API rate limit exceeded');
      }
      throw new Error(`Polygon API error: ${error.message}`);
    }
  }

  async getHistoricalData(
    ticker: string, 
    from: string, 
    to: string,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day'
  ): Promise<HistoricalData> {
    await this.rateLimitCheck();

    try {
      const data = await this.client.stocks.aggregates(
        ticker, 
        1, 
        timespan, 
        from, 
        to, 
        { 
          adjusted: true,
          sort: 'asc',
          limit: 50000
        }
      );

      if (!data || !data.results) {
        return {
          ticker,
          results: [],
          queryCount: 0,
          resultsCount: 0
        };
      }

      const results: HistoricalDataPoint[] = data.results.map((item: any) => ({
        close: item.c,
        high: item.h,
        low: item.l,
        open: item.o,
        volume: item.v,
        volumeWeightedAveragePrice: item.vw,
        timestamp: item.t
      }));

      return {
        ticker,
        results,
        queryCount: data.queryCount || 0,
        resultsCount: data.resultsCount || results.length
      };
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new PolygonRateLimitError('API rate limit exceeded');
      }
      throw new Error(`Polygon API error: ${error.message}`);
    }
  }

  async getMultipleStockPrices(tickers: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    
    // Process in batches to respect rate limits
    for (const ticker of tickers) {
      try {
        prices[ticker] = await this.getStockPrice(ticker);
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to get price for ${ticker}:`, error);
        // Continue with other tickers, don't fail the entire batch
      }
    }

    return prices;
  }

  async getMarketSnapshot(): Promise<any> {
    await this.rateLimitCheck();

    try {
      const data = await this.client.stocks.snapshotAllTickers();
      return data;
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new PolygonRateLimitError('API rate limit exceeded');
      }
      throw new Error(`Polygon API error: ${error.message}`);
    }
  }
}

// Utility function with retry logic
export async function withRetry<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof PolygonRateLimitError && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff
        console.log(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (i === maxRetries - 1) {
        throw error; // Last attempt, throw the error
      }
      
      // For other errors, wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, baseDelay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Advanced client with pagination and debug options
export class AdvancedPolygonService extends PolygonService {
  private advancedClient: any;

  constructor(options: { enablePagination?: boolean; enableDebug?: boolean } = {}) {
    super();
    
    const apiKey = process.env.POLYGON_API_KEY!;
    const globalFetchOptions: any = {};
    
    if (options.enablePagination) {
      globalFetchOptions.pagination = true;
    }
    
    if (options.enableDebug) {
      globalFetchOptions.trace = true;
    }

    this.advancedClient = restClient(apiKey, "https://api.polygon.io", globalFetchOptions);
  }

  async getHistoricalDataWithPagination(
    ticker: string,
    from: string,
    to: string,
    timespan: 'minute' | 'hour' | 'day' = 'day'
  ): Promise<HistoricalData> {
    await this.rateLimitCheck();

    try {
      // This will automatically paginate through all results
      const data = await this.advancedClient.stocks.aggregates(
        ticker, 
        1, 
        timespan, 
        from, 
        to, 
        { limit: 50000 }
      );

      const results: HistoricalDataPoint[] = data.map((item: any) => ({
        close: item.c,
        high: item.h,
        low: item.l,
        open: item.o,
        volume: item.v,
        volumeWeightedAveragePrice: item.vw,
        timestamp: item.t
      }));

      return {
        ticker,
        results,
        queryCount: data.length,
        resultsCount: data.length
      };
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new PolygonRateLimitError('API rate limit exceeded');
      }
      throw new Error(`Polygon API error: ${error.message}`);
    }
  }
}
```

## Step 3: API Gateway Integration

### Create Basket Performance Endpoint
Create `apps/api/baskets/performance.ts` (Vercel Serverless Function):

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { PolygonService, withRetry, AdvancedPolygonService } from '../../../backend/services/portfolio/src/polygon';

interface BasketPerformance {
  basketId: string;
  currentValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChangePercent: number;
  lastUpdated: string;
}

// Mock basket data - replace with actual database query
const MOCK_BASKETS = [
  {
    id: 'tech-giants',
    name: 'Tech Giants',
    tickers: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
    allocations: [0.25, 0.25, 0.25, 0.25]
  },
  {
    id: 'green-energy',
    name: 'Green Energy',
    tickers: ['TSLA', 'ENPH', 'SEDG', 'FSLR'],
    allocations: [0.4, 0.2, 0.2, 0.2]
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasketPerformance[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use the official Polygon.io client
    const polygonService = new PolygonService();
    const performances: BasketPerformance[] = [];

    for (const basket of MOCK_BASKETS) {
      try {
        // Get current prices for all tickers in the basket using the SDK
        const prices = await withRetry(() => 
          polygonService.getMultipleStockPrices(basket.tickers)
        );

        // Calculate weighted basket value (simplified)
        let currentValue = 0;
        let validPrices = 0;

        basket.tickers.forEach((ticker, index) => {
          if (prices[ticker]) {
            currentValue += prices[ticker] * basket.allocations[index];
            validPrices++;
          }
        });

        // Only include baskets with at least some valid price data
        if (validPrices > 0) {
          // For demo purposes, calculate daily change using historical data
          try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const today = new Date().toISOString().split('T')[0];
            
            // Get historical data for comparison (simplified)
            const historicalData = await polygonService.getHistoricalData(
              basket.tickers[0], // Use first ticker as proxy
              yesterdayStr,
              today,
              'day'
            );
            
            let dailyChange = 0;
            if (historicalData.results.length >= 2) {
              const previousClose = historicalData.results[historicalData.results.length - 2].close;
              const currentClose = historicalData.results[historicalData.results.length - 1].close;
              dailyChange = ((currentClose - previousClose) / previousClose) * currentValue;
            } else {
              dailyChange = (Math.random() - 0.5) * 10; // Fallback to random for demo
            }
            
            const dailyChangePercent = (dailyChange / currentValue) * 100;

            performances.push({
              basketId: basket.id,
              currentValue: Math.round(currentValue * 100) / 100,
              dailyChange: Math.round(dailyChange * 100) / 100,
              dailyChangePercent: Math.round(dailyChangePercent * 100) / 100,
              weeklyChangePercent: Math.round((Math.random() - 0.5) * 20 * 100) / 100, // Mock
              lastUpdated: new Date().toISOString()
            });
          } catch (histError) {
            console.warn(`Failed to get historical data for ${basket.id}, using mock data:`, histError);
            // Fallback to mock data
            const dailyChange = (Math.random() - 0.5) * 10;
            const dailyChangePercent = (dailyChange / currentValue) * 100;

            performances.push({
              basketId: basket.id,
              currentValue: Math.round(currentValue * 100) / 100,
              dailyChange: Math.round(dailyChange * 100) / 100,
              dailyChangePercent: Math.round(dailyChangePercent * 100) / 100,
              weeklyChangePercent: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
              lastUpdated: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error(`Failed to calculate performance for basket ${basket.id}:`, error);
        // Continue with other baskets
      }
    }

    // Cache headers for performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(performances);

  } catch (error) {
    console.error('Error fetching basket performances:', error);
    res.status(500).json({ error: 'Failed to fetch basket performances' });
  }
}

// Alternative endpoint using advanced features
export async function handlerWithAdvancedFeatures(
  req: NextApiRequest,
  res: NextApiResponse<BasketPerformance[] | { error: string }>
) {
  try {
    // Use advanced client with pagination and debug features
    const advancedService = new AdvancedPolygonService({
      enablePagination: true,
      enableDebug: process.env.NODE_ENV === 'development'
    });

    // Get market snapshot for all tickers at once
    const marketSnapshot = await advancedService.getMarketSnapshot();
    
    // Process snapshot data for basket calculations
    const performances: BasketPerformance[] = [];
    
    for (const basket of MOCK_BASKETS) {
      let currentValue = 0;
      let validPrices = 0;

      basket.tickers.forEach((ticker, index) => {
        const tickerData = marketSnapshot.results?.find((item: any) => 
          item.T === ticker || item.ticker === ticker
        );
        
        if (tickerData && tickerData.c) {
          currentValue += tickerData.c * basket.allocations[index];
          validPrices++;
        }
      });

      if (validPrices > 0) {
        performances.push({
          basketId: basket.id,
          currentValue: Math.round(currentValue * 100) / 100,
          dailyChange: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
          dailyChangePercent: Math.round((Math.random() - 0.5) * 5 * 100) / 100,
          weeklyChangePercent: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    res.status(200).json(performances);

  } catch (error) {
    console.error('Error with advanced polygon service:', error);
    res.status(500).json({ error: 'Failed to fetch basket performances' });
  }
}
```

## Step 4: Frontend Integration

### Create Market Data API Service
Create `apps/mobile-app/lib/api/market-data.ts`:

```typescript
export interface BasketPerformance {
  basketId: string;
  currentValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChangePercent: number;
  lastUpdated: string;
}

export interface MarketDataError {
  error: string;
  code?: string;
}

class MarketDataService {
  private baseUrl: string;

  constructor() {
    // Use your API Gateway URL
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  }

  async getBasketPerformance(basketId: string): Promise<BasketPerformance> {
    try {
      const response = await fetch(`${this.baseUrl}/api/baskets/${basketId}/performance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching basket performance:', error);
      throw new Error('Failed to fetch basket performance');
    }
  }

  async getAllBasketsPerformance(): Promise<BasketPerformance[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/baskets/performance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching baskets performance:', error);
      // Return empty array as fallback
      return [];
    }
  }
}

export const marketDataApi = new MarketDataService();
```

### Update Zustand Store
Update `apps/mobile-app/store/basketsStore.ts`:

```typescript
import { create } from 'zustand';
import { marketDataApi, BasketPerformance } from '../lib/api/market-data';

interface Basket {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  performance?: BasketPerformance;
}

interface BasketsState {
  baskets: Basket[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  fetchBaskets: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  clearError: () => void;
}

export const useBasketsStore = create<BasketsState>((set, get) => ({
  baskets: [],
  loading: false,
  error: null,
  lastUpdated: null,

  fetchBaskets: async () => {
    set({ loading: true, error: null });
    
    try {
      // Fetch basket list (mock data for now)
      const mockBaskets: Basket[] = [
        {
          id: 'tech-giants',
          name: 'Tech Giants',
          description: 'Leading technology companies',
          riskLevel: 'MEDIUM'
        },
        {
          id: 'green-energy',
          name: 'Green Energy',
          description: 'Sustainable energy companies',
          riskLevel: 'HIGH'
        }
      ];

      // Fetch performance data
      const performances = await marketDataApi.getAllBasketsPerformance();
      
      // Merge basket data with performance
      const basketsWithPerformance = mockBaskets.map(basket => ({
        ...basket,
        performance: performances.find(p => p.basketId === basket.id)
      }));

      set({ 
        baskets: basketsWithPerformance, 
        loading: false, 
        lastUpdated: new Date() 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch baskets',
        loading: false 
      });
    }
  },

  refreshPerformance: async () => {
    const { baskets } = get();
    
    try {
      const performances = await marketDataApi.getAllBasketsPerformance();
      
      const updatedBaskets = baskets.map(basket => ({
        ...basket,
        performance: performances.find(p => p.basketId === basket.id)
      }));

      set({ 
        baskets: updatedBaskets, 
        lastUpdated: new Date() 
      });
    } catch (error) {
      console.error('Failed to refresh performance:', error);
      // Don't set error state for background refresh failures
    }
  },

  clearError: () => set({ error: null })
}));
```

## Step 5: Testing

### Test API Connection
Create a simple test script `test-polygon.js`:

```javascript
const axios = require('axios');

async function testPolygonConnection() {
  const apiKey = 'YOUR_API_KEY_HERE';
  const ticker = 'AAPL';
  
  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev`,
      {
        params: { apikey: apiKey }
      }
    );
    
    console.log('✅ Polygon.io connection successful!');
    console.log('AAPL Close Price:', response.data.results[0].c);
  } catch (error) {
    console.error('❌ Polygon.io connection failed:', error.message);
  }
}

testPolygonConnection();
```

Run with: `node test-polygon.js`

### Test Frontend Integration
In your React Native component:

```typescript
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useBasketsStore } from '../store/basketsStore';

export function BasketList() {
  const { baskets, loading, error, fetchBaskets } = useBasketsStore();

  useEffect(() => {
    fetchBaskets();
  }, []);

  if (loading) return <Text>Loading baskets...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {baskets.map(basket => (
        <View key={basket.id}>
          <Text>{basket.name}</Text>
          {basket.performance && (
            <Text>
              {basket.performance.dailyChangePercent > 0 ? '+' : ''}
              {basket.performance.dailyChangePercent.toFixed(2)}%
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
```

## Step 6: Deployment

### Environment Variables Checklist
- [ ] `POLYGON_API_KEY` set in AWS Lambda environment
- [ ] `POLYGON_API_KEY` set in Vercel environment
- [ ] `POLYGON_BASE_URL` configured
- [ ] `POLYGON_RATE_LIMIT` set appropriately

### Monitoring Setup
1. **CloudWatch Logs**: Monitor Lambda function logs for API errors
2. **Error Tracking**: Set up Sentry alerts for Polygon API failures
3. **Rate Limit Monitoring**: Track API usage to avoid hitting limits

## Troubleshooting

### Common Issues

**Rate Limit Exceeded**:
```
Error: Rate limit exceeded. Wait 45000ms
```
- Solution: Implement proper retry logic with exponential backoff
- Consider upgrading to paid Polygon.io plan for higher limits

**Invalid Ticker Symbol**:
```
Error: No data found for ticker: INVALID
```
- Solution: Validate ticker symbols before API calls
- Implement fallback for missing data

**Network Timeouts**:
```
Error: timeout of 10000ms exceeded
```
- Solution: Increase timeout values for historical data requests
- Implement proper error handling and user feedback

### Performance Tips

1. **Batch Requests**: Group multiple ticker requests when possible
2. **Caching**: Implement Redis cache for frequently requested data
3. **Background Jobs**: Use scheduled functions for periodic data updates
4. **Error Boundaries**: Implement React error boundaries for graceful failures

## Next Steps

1. **Upgrade API Plan**: Consider paid Polygon.io plan for production
2. **WebSocket Integration**: Implement real-time price feeds
3. **International Markets**: Extend to global stock exchanges
4. **Advanced Analytics**: Add technical indicators and market analysis

## Resources

- [Polygon.io API Documentation](https://polygon.io/docs)
- [Rate Limiting Best Practices](https://polygon.io/docs/stocks/getting-started#rate-limiting)
- [AWS Lambda Environment Variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)