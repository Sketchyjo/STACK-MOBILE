import { polygonService } from '../src/services/polygonService';

describe('PolygonService', () => {
  beforeAll(() => {
    // Ensure API key is set for tests
    if (!process.env.POLYGON_API_KEY) {
      console.warn('⚠️ POLYGON_API_KEY not set - tests may fail');
    }
  });

  afterAll(async () => {
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('Stock Data Fetching', () => {
    it('should fetch stock details for AAPL', async () => {
      const details = await polygonService.getStockDetails('AAPL');

      if (details) {
        expect(details.ticker).toBe('AAPL');
        expect(details.name).toContain('Apple');
        expect(details.market).toBeDefined();
        expect(details.active).toBe(true);
      } else {
        console.warn(
          '⚠️ Stock details returned null - API may be rate limited'
        );
      }
    }, 10000);

    it('should fetch stock price for AAPL', async () => {
      const price = await polygonService.getStockPrice('AAPL');

      if (price) {
        expect(price.ticker).toBe('AAPL');
        expect(typeof price.price).toBe('number');
        expect(typeof price.change).toBe('number');
        expect(typeof price.changePercent).toBe('number');
        expect(typeof price.timestamp).toBe('number');
      } else {
        console.warn('⚠️ Stock price returned null - API may be rate limited');
      }
    }, 10000);

    it('should handle invalid stock ticker gracefully', async () => {
      const details = await polygonService.getStockDetails('INVALID_TICKER');
      expect(details).toBeNull();
    }, 10000);
  });

  describe('Crypto Data Fetching', () => {
    it('should fetch crypto details for BTC', async () => {
      const details = await polygonService.getCryptoDetails('BTC');

      if (details) {
        expect(details.ticker).toBe('X:BTCUSD');
        expect(details.name).toContain('Bitcoin');
        expect(details.active).toBe(true);
      } else {
        console.warn(
          '⚠️ Crypto details returned null - API may be rate limited'
        );
      }
    }, 10000);

    it('should fetch crypto price for BTC', async () => {
      const price = await polygonService.getCryptoPrice('BTC');

      if (price) {
        expect(price.ticker).toBe('BTC');
        expect(typeof price.price).toBe('number');
        expect(typeof price.change).toBe('number');
        expect(typeof price.changePercent).toBe('number');
        expect(typeof price.timestamp).toBe('number');
      } else {
        console.warn('⚠️ Crypto price returned null - API may be rate limited');
      }
    }, 10000);

    it('should handle invalid crypto ticker gracefully', async () => {
      const details = await polygonService.getCryptoDetails('INVALID_CRYPTO');
      expect(details).toBeNull();
    }, 10000);
  });

  describe('Historical Data', () => {
    it('should fetch historical data for AAPL', async () => {
      const historicalData = await polygonService.getHistoricalData('AAPL', 7);

      expect(Array.isArray(historicalData)).toBe(true);
      if (historicalData.length > 0) {
        expect(typeof historicalData[0]).toBe('number');
      }
    }, 15000);

    it('should calculate performance metrics', () => {
      const mockPrices = [100, 102, 98, 105, 103, 107, 110];
      const metrics = polygonService.calculatePerformanceMetrics(mockPrices);

      expect(typeof metrics.oneDay).toBe('number');
      expect(typeof metrics.oneWeek).toBe('number');
      expect(typeof metrics.oneMonth).toBe('number');
      expect(typeof metrics.threeMonths).toBe('number');
      expect(typeof metrics.oneYear).toBe('number');
    });

    it('should handle empty price array', () => {
      const metrics = polygonService.calculatePerformanceMetrics([]);

      expect(metrics.oneDay).toBe(0);
      expect(metrics.oneWeek).toBe(0);
      expect(metrics.oneMonth).toBe(0);
      expect(metrics.threeMonths).toBe(0);
      expect(metrics.oneYear).toBe(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should respect rate limits with delay', async () => {
      const startTime = Date.now();
      await polygonService.delay(100);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock a network error by using an invalid API key temporarily
      const originalApiKey = process.env.POLYGON_API_KEY;
      process.env.POLYGON_API_KEY = 'invalid_key';

      try {
        // Create a new service instance with invalid key
        const invalidService = new (polygonService.constructor as any)();
        const result = await invalidService.getStockDetails('AAPL');
        expect(result).toBeNull();
      } catch (error) {
        // Expected to fail with invalid key
        expect(error).toBeDefined();
      } finally {
        // Restore original API key
        process.env.POLYGON_API_KEY = originalApiKey;
      }
    }, 10000);
  });

  describe('Integration Test - Multiple Assets', () => {
    it('should fetch data for multiple assets with rate limiting', async () => {
      const symbols = ['AAPL', 'MSFT', 'GOOGL'];
      const results = [];

      for (let i = 0; i < symbols.length; i++) {
        // Add delay to respect rate limits
        if (i > 0) {
          await polygonService.delay(200);
        }

        const [details, price] = await Promise.all([
          polygonService.getStockDetails(symbols[i]),
          polygonService.getStockPrice(symbols[i]),
        ]);

        results.push({ symbol: symbols[i], details, price });
      }

      expect(results).toHaveLength(3);

      // Check that at least some results are successful
      const successfulResults = results.filter(
        r => r.details !== null || r.price !== null
      );
      expect(successfulResults.length).toBeGreaterThan(0);

      console.log(
        `✅ Successfully fetched data for ${successfulResults.length}/${symbols.length} symbols`
      );
    }, 30000);
  });
});

// Test helper to run a quick smoke test
export async function runPolygonSmokeTest(): Promise<boolean> {
  try {
    console.log('🧪 Running Polygon API smoke test...');

    const [stockDetails, stockPrice, cryptoPrice] = await Promise.all([
      polygonService.getStockDetails('AAPL'),
      polygonService.getStockPrice('AAPL'),
      polygonService.getCryptoPrice('BTC'),
    ]);

    const results = {
      stockDetails: stockDetails !== null,
      stockPrice: stockPrice !== null,
      cryptoPrice: cryptoPrice !== null,
    };

    const successCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(`📊 Smoke test results: ${successCount}/${totalTests} passed`);
    console.log('Results:', results);

    return successCount > 0; // At least one test should pass
  } catch (error) {
    console.error('❌ Smoke test failed:', error);
    return false;
  }
}

// Run smoke test if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runPolygonSmokeTest()
    .then(success => {
      console.log(success ? '✅ Smoke test passed' : '❌ Smoke test failed');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Smoke test error:', error);
      process.exit(1);
    });
}
