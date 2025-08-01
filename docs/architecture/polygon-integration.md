# Polygon.io API Integration

## Overview

The STACK mobile app integrates with Polygon.io to provide real-time stock market data, historical prices, and financial metrics for investment baskets and individual assets. This integration enables users to see live performance data and make informed investment decisions.

## API Endpoints Used

### Stock Market Data
- **Real-time Stock Prices**: `/v2/aggs/ticker/{stocksTicker}/prev`
- **Historical Data**: `/v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}`
- **Market Status**: `/v1/marketstatus/now`
- **Stock Details**: `/v3/reference/tickers/{ticker}`

### Crypto Data (if applicable)
- **Crypto Prices**: `/v2/aggs/ticker/X:{from}{to}/prev`
- **Crypto Historical**: `/v2/aggs/ticker/X:{from}{to}/range/{multiplier}/{timespan}/{from}/{to}`

## Integration Architecture

### Backend Services
```
Mobile App → API Gateway (Vercel) → Portfolio Service (Lambda) → Polygon.io API
```

### Data Flow
1. **Basket Performance Calculation**:
   - Fetch individual asset prices from Polygon.io
   - Calculate weighted performance based on basket allocation
   - Cache results for performance optimization

2. **Real-time Updates**:
   - Periodic background sync for basket performance
   - WebSocket connections for live price updates (future enhancement)

## API Configuration

### Authentication
- API Key stored in environment variables
- Rate limiting: 5 calls per minute (free tier) / 1000+ calls per minute (paid tier)
- Error handling for rate limit exceeded scenarios
- Official Polygon.io JavaScript SDK handles authentication and rate limiting automatically

### Environment Variables
```
POLYGON_API_KEY=your_polygon_api_key
# Note: POLYGON_BASE_URL no longer needed with official SDK
```

## Data Models

### Asset Price Data
```typescript
interface PolygonStockPrice {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: [{
    c: number; // Close price
    h: number; // High price
    l: number; // Low price
    o: number; // Open price
    v: number; // Volume
    vw: number; // Volume weighted average price
    t: number; // Timestamp
  }];
}
```

### Historical Performance
```typescript
interface PolygonHistoricalData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: Array<{
    c: number; // Close
    h: number; // High
    l: number; // Low
    o: number; // Open
    v: number; // Volume
    vw: number; // Volume weighted average
    t: number; // Timestamp
  }>;
}
```

### SDK-Based Data Models
With the official Polygon.io JavaScript SDK, we use more structured interfaces:

```typescript
// Stock price response from SDK
interface StockPrice {
  ticker: string;
  price: number;
  timestamp: number;
}

// Historical data point from SDK
interface HistoricalDataPoint {
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  volumeWeighted: number;
  timestamp: number;
}

// Complete historical data response
interface HistoricalData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: HistoricalDataPoint[];
}

// Last trade information
interface LastTrade {
  conditions: number[];
  exchange: number;
  price: number;
  sip_timestamp: number;
  size: number;
  timeframe: string;
}

// Market snapshot ticker data
interface SnapshotTicker {
  ticker: string;
  todaysChangePerc: number;
  todaysChange: number;
  updated: number;
  day: {
    c: number; // Close
    h: number; // High
    l: number; // Low
    o: number; // Open
    v: number; // Volume
    vw: number; // Volume weighted
  };
  lastQuote: {
    P: number; // Bid price
    S: number; // Bid size
    p: number; // Ask price
    s: number; // Ask size
    t: number; // Timestamp
  };
  lastTrade: {
    c: number[]; // Conditions
    i: string;   // Trade ID
    p: number;   // Price
    s: number;   // Size
    t: number;   // Timestamp
    x: number;   // Exchange
  };
}
```

## Implementation Details

### Backend Service Integration

**Portfolio Service (AWS Lambda)**:
```typescript
// apps/backend/services/portfolio/src/polygon.ts
import { restClient } from '@polygon.io/client-js';

export class PolygonService {
  private client: any;

  constructor() {
    // Initialize the official Polygon.io REST client
    this.client = restClient(process.env.POLYGON_API_KEY!);
  }

  async getStockPrice(ticker: string): Promise<number> {
    try {
      // Get previous day's close price using the official SDK
      const response = await this.client.stocks.previousClose(ticker);
      return response.results[0].c; // Close price
    } catch (error) {
      console.error(`Error fetching stock price for ${ticker}:`, error);
      throw error;
    }
  }

  async getHistoricalData(
    ticker: string, 
    from: string, 
    to: string,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day'
  ): Promise<HistoricalData> {
    try {
      // Use the official SDK for historical aggregates
      const response = await this.client.stocks.aggregates(
        ticker,
        1, // multiplier
        timespan,
        from,
        to
      );
      
      return {
        ticker,
        queryCount: response.queryCount,
        resultsCount: response.resultsCount,
        adjusted: response.adjusted,
        results: response.results.map((result: any) => ({
          close: result.c,
          high: result.h,
          low: result.l,
          open: result.o,
          volume: result.v,
          volumeWeighted: result.vw,
          timestamp: result.t
        }))
      };
    } catch (error) {
      console.error(`Error fetching historical data for ${ticker}:`, error);
      throw error;
    }
  }

  async getLastTrade(ticker: string): Promise<any> {
    try {
      // Get the last trade for a stock using the SDK
      const response = await this.client.stocks.lastTrade(ticker);
      return response.results;
    } catch (error) {
      console.error(`Error fetching last trade for ${ticker}:`, error);
      throw error;
    }
  }

  async getMarketSnapshot(): Promise<any> {
    try {
      // Get market-wide snapshot of all tickers
      const response = await this.client.stocks.snapshotAllTickers();
      return response;
    } catch (error) {
      console.error('Error fetching market snapshot:', error);
      throw error;
    }
  }

  async getMultipleStockPrices(tickers: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    
    // Use Promise.allSettled to handle individual ticker failures gracefully
    const results = await Promise.allSettled(
      tickers.map(async (ticker) => {
        const price = await this.getStockPrice(ticker);
        return { ticker, price };
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        prices[result.value.ticker] = result.value.price;
      } else {
        console.warn(`Failed to fetch price for ticker:`, result.reason);
      }
    });

    return prices;
  }
}

// Advanced service with additional SDK features
export class AdvancedPolygonService extends PolygonService {
  private enablePagination: boolean;
  private enableDebug: boolean;

  constructor(options: { enablePagination?: boolean; enableDebug?: boolean } = {}) {
    super();
    this.enablePagination = options.enablePagination || false;
    this.enableDebug = options.enableDebug || false;
    
    if (this.enableDebug) {
      // Enable debug mode for API requests
      this.client = restClient(process.env.POLYGON_API_KEY!, undefined, undefined, {
        debug: true
      });
    }
  }

  async getHistoricalDataWithPagination(
    ticker: string,
    from: string,
    to: string,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day'
  ): Promise<HistoricalData> {
    if (!this.enablePagination) {
      return super.getHistoricalData(ticker, from, to, timespan);
    }

    try {
      // Use automatic pagination feature of the SDK
      const allResults: any[] = [];
      let cursor: string | undefined;

      do {
        const response = await this.client.stocks.aggregates(
          ticker,
          1,
          timespan,
          from,
          to,
          { cursor }
        );

        if (response.results) {
          allResults.push(...response.results);
        }
        
        cursor = response.next_url ? new URL(response.next_url).searchParams.get('cursor') : undefined;
      } while (cursor);

      return {
        ticker,
        queryCount: allResults.length,
        resultsCount: allResults.length,
        adjusted: true,
        results: allResults.map((result: any) => ({
          close: result.c,
          high: result.h,
          low: result.l,
          open: result.o,
          volume: result.v,
          volumeWeighted: result.vw,
          timestamp: result.t
        }))
      };
    } catch (error) {
      console.error(`Error fetching paginated historical data for ${ticker}:`, error);
      throw error;
    }
  }
}

// Data interfaces for the SDK responses
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
  volumeWeighted: number;
  timestamp: number;
}

export interface HistoricalData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: HistoricalDataPoint[];
}
```

### Frontend Integration

**API Service (Mobile App)**:
```typescript
// apps/mobile-app/lib/api/market-data.ts
export interface BasketPerformance {
  basketId: string;
  currentValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChangePercent: number;
  lastUpdated: string;
}

export const marketDataApi = {
  async getBasketPerformance(basketId: string): Promise<BasketPerformance> {
    const response = await fetch(`/api/v1/baskets/${basketId}/performance`);
    return response.json();
  },

  async getAllBasketsPerformance(): Promise<BasketPerformance[]> {
    const response = await fetch('/api/v1/baskets/performance');
    return response.json();
  }
};
```

## Caching Strategy

### Redis Cache (Future Enhancement)
- Cache stock prices for 1 minute during market hours
- Cache historical data for 1 hour
- Cache basket performance calculations for 5 minutes

### Local Storage Cache
- Store last known prices for offline scenarios
- Cache basket performance data for 30 seconds
- Implement cache invalidation on app resume

## Error Handling

### Rate Limiting
```typescript
export class PolygonRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolygonRateLimitError';
  }
}

// Retry logic with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof PolygonRateLimitError && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Fallback Strategies
1. **Stale Data**: Return cached data if API is unavailable
2. **Mock Data**: Use mock performance data in development
3. **Graceful Degradation**: Hide performance indicators if data unavailable

## Security Considerations

### API Key Protection
- Store API keys in secure environment variables
- Never expose API keys in frontend code
- Use server-side proxy for all Polygon.io requests

### Data Validation
- Validate all incoming data from Polygon.io
- Sanitize ticker symbols to prevent injection attacks
- Implement request signing for sensitive operations

## Performance Optimization

### Batch Requests
- Group multiple ticker requests into single API calls where possible
- Use Polygon.io's grouped daily bars endpoint for multiple tickers

### Background Sync
- Implement background job for periodic data updates
- Use AWS EventBridge for scheduled data refresh
- Queue system for handling high-volume requests

## Monitoring & Analytics

### API Usage Tracking
- Monitor API call volume and rate limits
- Track response times and error rates
- Alert on API quota approaching limits

### Performance Metrics
- Track basket performance calculation accuracy
- Monitor cache hit rates
- Measure user engagement with real-time data

## Future Enhancements

### Real-time WebSocket Integration
- Implement WebSocket connections for live price feeds using the official SDK
- Real-time basket performance updates
- Push notifications for significant price movements

```typescript
// WebSocket integration with official SDK
import { websocketClient } from '@polygon.io/client-js';

export class PolygonWebSocketService {
  private wsClient: any;

  constructor() {
    this.wsClient = websocketClient(process.env.POLYGON_API_KEY!);
  }

  async subscribeToStockUpdates(tickers: string[]) {
    // Subscribe to real-time stock updates
    this.wsClient.stocks.onStockAgg((data: any) => {
      console.log('Stock aggregate update:', data);
      // Handle real-time price updates
    });

    // Subscribe to specific tickers
    tickers.forEach(ticker => {
      this.wsClient.stocks.subscribeToStockAggs(ticker);
    });
  }

  async subscribeToTrades(tickers: string[]) {
    // Subscribe to real-time trade updates
    this.wsClient.stocks.onStockTrade((data: any) => {
      console.log('Trade update:', data);
      // Handle real-time trade data
    });

    tickers.forEach(ticker => {
      this.wsClient.stocks.subscribeToStockTrades(ticker);
    });
  }
}
```

### Advanced Analytics
- Technical indicators (RSI, MACD, Moving Averages) using SDK data
- Market sentiment analysis
- Correlation analysis between baskets

### International Markets
- Extend to international stock exchanges
- Multi-currency support
- Forex data integration using Polygon.io's forex endpoints

## Testing Strategy

### Unit Tests
- Mock Polygon.io API responses
- Test error handling scenarios
- Validate data transformation logic

### Integration Tests
- Test actual API connectivity (with test API key)
- Validate end-to-end data flow
- Performance testing under load

### Monitoring Tests
- API availability checks
- Response time monitoring
- Data accuracy validation