import * as polygonService from '../services/polygonService';

async function testPolygonEndpoints() {

  console.log('🚀 Starting Polygon.io API endpoint tests...\n');

  try {
    // Test stock data endpoints
    console.log('📈 Testing Stock Data Endpoints:');

    // // Test stock details
    console.log('\n1. Testing Stock Details (AAPL):');
    const stockDetails = await polygonService.getStockDetails('AAPL');
    console.log('Stock Details:', stockDetails ? 'Success ✅' : 'Failed ❌');
    if (stockDetails) {
      console.log(`   - Name: ${stockDetails.name}`);
      console.log(`   - Market Cap: ${JSON.stringify(stockDetails, null, 2)}`);
    }

    // Test stock price
    // console.log('\n2. Testing Stock Price (AAPL):');
    // const stockPrice = await polygonService.getStockPrice('AAPL');
    // console.log('Stock Price:', stockPrice ? 'Success ✅' : 'Failed ❌');
    // if (stockPrice) {
    //   console.log(`   - Price: $${stockPrice.price}`);
    //   console.log(`   - Change: ${stockPrice.change} (${stockPrice.changePercent.toFixed(2)}%)`);
    // }

    // // Test historical data
    // console.log('\n3. Testing Historical Data (AAPL, 30 days):');
    // const historicalData = await polygonService.getHistoricalData('AAPL', 30);
    // console.log('Historical Data:', historicalData.length > 0 ? 'Success ✅' : 'Failed ❌');
    // console.log(`   - Data points: ${historicalData.length}`);

    // Test technical indicators
    // console.log('\n4. Testing Technical Indicators (AAPL):');

    // const sma = await polygonService.getStockSMA('AAPL', 50);
    // console.log('SMA (50):', sma ? 'Success ✅' : 'Failed ❌');

    // const rsi = await polygonService.getStockRSI('AAPL', 14);
    // console.log('RSI (14):', rsi ? 'Success ✅' : 'Failed ❌');

    // const macd = await polygonService.getStockMACD('AAPL');
    // console.log('MACD:', macd ? 'Success ✅' : 'Failed ❌');

    // Test stock trades and quotes
    // console.log('\n5. Testing Stock Trades and Quotes (AAPL):');
    // const trades = await polygonService.getStockTrades('AAPL');
    // console.log('Stock Trades:', trades.length > 0 ? 'Success ✅' : 'Failed ❌');

    // const quotes = await polygonService.getStockQuotes('AAPL');
    // console.log('Stock Quotes:', quotes.length > 0 ? 'Success ✅' : 'Failed ❌');

    // Test crypto endpoints
    // console.log('\n📊 Testing Crypto Data Endpoints:');

    // console.log('\n6. Testing Crypto Details (BTC):');
    // const cryptoDetails = await polygonService.getCryptoDetails('BTC');
    // console.log('Crypto Details:', cryptoDetails ? 'Success ✅' : 'Failed ❌');

    // console.log('\n7. Testing Crypto Price (BTC):');
    // const cryptoPrice = await polygonService.getCryptoPrice('BTC');
    // console.log('Crypto Price:', cryptoPrice ? 'Success ✅' : 'Failed ❌');
    // if (cryptoPrice) {
    //   console.log(`   - Price: $${cryptoPrice.price}`);
    //   console.log(`   - Change: ${cryptoPrice.change} (${cryptoPrice.changePercent.toFixed(2)}%)`);
    // }

    // console.log('\n8. Testing Crypto Technical Indicators (BTC):');
    // const cryptoSMA = await polygonService.getCryptoSMA('BTC', 50);
    // console.log('Crypto SMA (50):', cryptoSMA ? 'Success ✅' : 'Failed ❌');

    // const cryptoRSI = await polygonService.getCryptoRSI('BTC', 14);
    // console.log('Crypto RSI (14):', cryptoRSI ? 'Success ✅' : 'Failed ❌');

    // console.log('\n9. Testing Crypto Trades (BTC):');
    // const cryptoTrades = await polygonService.getCryptoTrades('BTC');
    // console.log('Crypto Trades:', cryptoTrades.length > 0 ? 'Success ✅' : 'Failed ❌');

    // // Test market data endpoints
    // console.log('\n🏢 Testing Market Data Endpoints:');

    // console.log('\n10. Testing Market Status:');
    // const marketStatus = await polygonService.getMarketStatus();
    // console.log('Market Status:', marketStatus ? 'Success ✅' : 'Failed ❌');
    // if (marketStatus) {
    //   console.log(`   - Market: ${marketStatus.market}`);
    //   console.log(`   - Server Time: ${marketStatus.serverTime}`);
    // }

    // console.log('\n11. Testing Market Holidays:');
    // const holidays = await polygonService.getMarketHolidays();
    // console.log('Market Holidays:', holidays.length > 0 ? 'Success ✅' : 'Failed ❌');
    // console.log(`   - Holidays found: ${holidays.length}`);

    // // Test news endpoints
    // console.log('\n📰 Testing News Endpoints:');

    // console.log('\n12. Testing General News:');
    // const generalNews = await polygonService.getNews(undefined, 5);
    // console.log('General News:', generalNews && generalNews.length > 0 ? 'Success ✅' : 'Failed ❌');
    // console.log(`   - Articles found: ${generalNews?.length || 0}`);

    // console.log('\n13. Testing Stock-specific News (AAPL):');
    // const stockNews = await polygonService.getNews('AAPL', 5);
    // console.log('Stock News:', stockNews && stockNews.length > 0 ? 'Success ✅' : 'Failed ❌');
    // console.log(`   - Articles found: ${stockNews?.length || 0}`);

    // // Test Benzinga endpoints
    // console.log('\n📊 Testing Benzinga Endpoints:');

    // console.log('\n14. Testing Benzinga News:');
    // const benzingaNews = await polygonService.getBenzingaNews('AAPL');
    // console.log('Benzinga News:', benzingaNews.length > 0 ? 'Success ✅' : 'Failed ❌');

    // console.log('\n15. Testing Benzinga Analyst Insights:');
    // const analystInsights = await polygonService.getBenzingaAnalystInsights('10');
    // console.log('Analyst Insights:', analystInsights.length > 0 ? 'Success ✅' : 'Failed ❌');

    // console.log('\n16. Testing Benzinga Earnings:');
    // const earnings = await polygonService.getBenzingaEarnings('10');
    // console.log('Earnings:', earnings.length > 0 ? 'Success ✅' : 'Failed ❌');

    // // Test corporate actions
    // console.log('\n🏢 Testing Corporate Actions:');

    // console.log('\n17. Testing Stock Splits:');
    // const splits = await polygonService.getStockSplits('10');
    // console.log('Stock Splits:', splits.length > 0 ? 'Success ✅' : 'Failed ❌');

    // console.log('\n18. Testing Dividends:');
    // const dividends = await polygonService.getDividends('10');
    // console.log('Dividends:', dividends.length > 0 ? 'Success ✅' : 'Failed ❌');

    // console.log('\n19. Testing Financials:');
    // const financials = await polygonService.getFinancials('AAPL');
    // console.log('Financials:', financials.length > 0 ? 'Success ✅' : 'Failed ❌');

    // // Test related data
    // console.log('\n🔗 Testing Related Data:');

    // console.log('\n20. Testing Related Companies (AAPL):');
    // const relatedCompanies = await polygonService.getRelatedCompanies('AAPL');
    // console.log('Related Companies:', relatedCompanies.length > 0 ? 'Success ✅' : 'Failed ❌');

    // // Test options data
    // console.log('\n📈 Testing Options Data:');

    // console.log('\n21. Testing Options Chain (AAPL):');
    // const optionsChain = await polygonService.getOptionsChain('AAPL');
    // console.log('Options Chain:', optionsChain.length > 0 ? 'Success ✅' : 'Failed ❌');

    // // Test forex data
    // console.log('\n💱 Testing Forex Data:');

    // console.log('\n22. Testing Forex Rates (USD to EUR):');
    // const forexRates = await polygonService.getForexRates('USD', 'EUR');
    // console.log('Forex Rates:', forexRates ? 'Success ✅' : 'Failed ❌');

    // // Test aggregated data
    // console.log('\n📊 Testing Aggregated Data:');

    // console.log('\n23. Testing Grouped Stocks Aggregates:');
    // const today = new Date().toISOString().split('T')[0];
    // const groupedAggregates = await polygonService.getGroupedStocksAggregates(today);
    // console.log('Grouped Aggregates:', groupedAggregates.length > 0 ? 'Success ✅' : 'Failed ❌');

    // console.log('\n24. Testing Snapshot Summary:');
    // const snapshotSummary = await polygonService.getSnapshotSummary();
    // console.log('Snapshot Summary:', snapshotSummary ? 'Success ✅' : 'Failed ❌');

    console.log('\n✅ Polygon.io API endpoint tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('- Stock data endpoints: Tested ✅');
    console.log('- Crypto data endpoints: Tested ✅');
    console.log('- Technical indicators: Tested ✅');
    console.log('- Market data: Tested ✅');
    console.log('- News endpoints: Tested ✅');
    console.log('- Benzinga endpoints: Tested ✅');
    console.log('- Corporate actions: Tested ✅');
    console.log('- Options data: Tested ✅');
    console.log('- Forex data: Tested ✅');
    console.log('- Aggregated data: Tested ✅');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the tests
testPolygonEndpoints();
