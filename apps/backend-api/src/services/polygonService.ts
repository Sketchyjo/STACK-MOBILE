import {
  GetCryptoMACD200Response,
  GetCryptoMACD200ResponseResults,
  GetCryptoMACD200ResponseResultsValuesInner,
  GetMarketHolidays200ResponseInner,
  GetMarketStatus200Response,
  GetTicker200ResponseResults,
  ListNews200ResponseResultsInner,
  restClient,
} from '@polygon.io/client-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface StockDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  market_cap?: number;
  phone_number?: string;
  address?: {
    address1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  description?: string;
  homepage_url?: string;
  total_employees?: number;
  list_date?: string;
  branding?: {
    logo_url?: string;
    icon_url?: string;
  };
  share_class_shares_outstanding?: number;
  weighted_shares_outstanding?: number;
}

export interface StockPrice {
  ticker: string | number;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface CryptoDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  currency_symbol: string;
  currency_name: string;
  base_currency_symbol: string;
  base_currency_name: string;
  active: boolean;
}

export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: string;
  };
  currencies: {
    [key: string]: string;
  };
}

export interface NewsItem {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url?: string;
    favicon_url?: string;
  };
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  image_url?: string;
  description: string;
  keywords: string[];
}

// Initialize Polygon client
const apiKey =
  process.env.POLYGON_API_KEY || 'v9vk0zfN480ZTKfJB3c5pv0cPWyPFyxF';
if (!apiKey) {
  throw new Error('POLYGON_API_KEY environment variable is required');
}

console.log(
  '🔑 Initializing Polygon client with API key:',
  apiKey.substring(0, 8) + '...'
);

const rest = restClient(apiKey, 'https://api.polygon.io', {
  pagination: true,
});

export async function getStockDetails(
  ticker: string
): Promise<StockDetails | null> {
  try {
    const response = await rest.getTicker(ticker);

    if (!response?.results) {
      console.warn(`⚠️ No stock details found for ${ticker}`);
      return null;
    }

    const details = response.results;

    return {
      ticker: details.ticker || ticker,
      name: details.name || ticker,
      market: details.market || 'stocks',
      locale: details.locale || 'us',
      primary_exchange: details.primary_exchange || 'NASDAQ',
      type: details.type || 'CS',
      active: details.active ?? true,
      currency_name: details.currency_name || 'USD',
      cik: details.cik || '',
      composite_figi: details.composite_figi || '',
      share_class_figi: details.share_class_figi || '',
      market_cap: details.market_cap || 0,
      phone_number: details.phone_number || '',
      address: details.address || {},
      description: details.description || '',
      homepage_url: details.homepage_url || '',
      total_employees: details.total_employees || 0,
      list_date: details.list_date || '',
      branding: details.branding || {},
      share_class_shares_outstanding:
        details.share_class_shares_outstanding || 0,
      weighted_shares_outstanding: details.weighted_shares_outstanding || 0,
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${ticker}:`, error);
    return null;
  }
}

export async function getStockPrice(
  ticker: string
): Promise<StockPrice | null> {
  try {
    const response = await rest.getPreviousStocksAggregates(ticker);

    if (!response?.results?.[0]) {
      console.warn(`⚠️ No stock price found for ${ticker}`);
      return null;
    }

    const price = response.results[0];

    return {
      ticker: ticker,
      price: price.c || 0,
      change: price.c - price.o || 0,
      changePercent: ((price.c - price.o) / price.o) * 100 || 0,
      timestamp: price.t || Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error);
    return null;
  }
}

export async function getCryptoDetails(
  ticker: string
): Promise<GetTicker200ResponseResults | undefined | null> {
  try {
    const cryptoTicker = `X:${ticker}USD`;
    const response = await rest.getTicker(cryptoTicker);
    return response.results || null;
  } catch (error) {
    console.error(`Error fetching crypto details for ${ticker}:`, error);
    return null;
  }
}

export async function getCryptoPrice(
  ticker: string
): Promise<StockPrice | null> {
  try {
    const cryptoTicker = `X:${ticker}USD`;
    const response = await rest.getPreviousCryptoAggregates(cryptoTicker);
    if (!response.results || response.results.length === 0) {
      return null;
    }

    const result = response.results[0];
    const change = result.c - result.o;
    const changePercent = (change / result.o) * 100;

    return {
      ticker: ticker,
      price: result.c,
      change: change,
      changePercent: changePercent,
      timestamp: result.t,
    };
  } catch (error) {
    console.error(`Error fetching crypto price for ${ticker}:`, error);
    return null;
  }
}

export async function getHistoricalData(
  ticker: string,
  days: number = 30
): Promise<number[]> {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    const response = await rest.getStocksAggregates(
      ticker,
      1,
      'day',
      from.toISOString().split('T')[0],
      to.toISOString().split('T')[0],
      {
        adjusted: true,
        sort: 'asc',
        limit: 120,
      }
    );

    if (!response.results || response.results.length === 0) {
      return [];
    }

    return response.results.map((item: any) => item.c);
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    return [];
  }
}

export async function getMarketStatus(): Promise<GetMarketStatus200Response | null> {
  try {
    const response = await rest.getMarketStatus();
    return response || null;
  } catch (error) {
    console.error('Error fetching market status:', error);
    return null;
  }
}

export async function getMarketHolidays(): Promise<
  GetMarketHolidays200ResponseInner[]
> {
  try {
    const response = await rest.getMarketHolidays();
    return response || [];
  } catch (error) {
    console.error('Error fetching market holidays:', error);
    return [];
  }
}

export async function getNews(
  ticker?: string,
  limit: number = 10
): Promise<ListNews200ResponseResultsInner[] | undefined> {
  try {
    const params: any = { limit };
    if (ticker) {
      params.ticker = ticker;
    }

    const response = await rest.listNews(params);
    return response?.results || undefined;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getStockTrades(
  ticker: string,
  timestamp?: string
): Promise<any[]> {
  try {
    const params: any = { ticker };
    if (timestamp) {
      params.timestamp = timestamp;
    }

    const response = await rest.getStocksTrades(params);
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching stock trades for ${ticker}:`, error);
    return [];
  }
}

export async function getStockQuotes(
  ticker: string,
  timestamp?: string
): Promise<any[]> {
  try {
    const params: any = { ticker };
    if (timestamp) {
      params.timestamp = timestamp;
    }

    const response = await rest.getStocksQuotes(params);
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching stock quotes for ${ticker}:`, error);
    return [];
  }
}

export async function getStockSMA(
  ticker: string,
  window: number = 50
): Promise<any> {
  try {
    const response = await rest.getStocksSMA({
      ticker: ticker,
      timespan: 'day',
      adjusted: 'true',
      window: window.toString(),
      order: 'desc',
      limit: '10',
    });
    return response?.results || null;
  } catch (error) {
    console.error(`Error fetching SMA for ${ticker}:`, error);
    return null;
  }
}

export async function getStockRSI(
  ticker: string,
  window: number = 14
): Promise<any> {
  try {
    const response = await rest.getStocksRSI({
      ticker: ticker,
      timespan: 'day',
      adjusted: 'true',
      window: window.toString(),
      order: 'desc',
      limit: '10',
    });
    return response?.results || null;
  } catch (error) {
    console.error(`Error fetching RSI for ${ticker}:`, error);
    return null;
  }
}

export async function getStockMACD(
  ticker: string
): Promise<GetCryptoMACD200ResponseResults | undefined> {
  try {
    const response: GetCryptoMACD200Response = await rest.getStocksMACD({
      ticker: ticker,
      timespan: 'day',
      adjusted: 'true',
      order: 'desc',
      limit: '10',
    });
    return response?.results || undefined;
  } catch (error) {
    console.error(`Error fetching MACD for ${ticker}:`, error);
    return undefined;
  }
}

export async function getCryptoTrades(
  ticker: string,
  timestamp?: string
): Promise<any[]> {
  try {
    const cryptoTicker = `X:${ticker}USD`;
    const params: any = { ticker: cryptoTicker };
    if (timestamp) {
      params.timestamp = timestamp;
    }

    const response = await rest.getCryptoTrades(params);
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching crypto trades for ${ticker}:`, error);
    return [];
  }
}

export async function getCryptoSMA(
  ticker: string,
  window: number = 50
): Promise<any> {
  try {
    const cryptoTicker = `X:${ticker}USD`;
    const response = await rest.getCryptoSMA({
      ticker: cryptoTicker,
      timespan: 'day',
      window: window.toString(),
      order: 'desc',
      limit: '10',
    });
    return response?.results || null;
  } catch (error) {
    console.error(`Error fetching crypto SMA for ${ticker}:`, error);
    return null;
  }
}

export async function getCryptoRSI(
  ticker: string,
  window: number = 14
): Promise<any> {
  try {
    const cryptoTicker = `X:${ticker}USD`;
    const response = await rest.getCryptoRSI({
      cryptoTicker: cryptoTicker,
      timespan: 'day',
      window: window.toString(),
      order: 'desc',
      limit: '10',
    });
    return response?.results || null;
  } catch (error) {
    console.error(`Error fetching crypto RSI for ${ticker}:`, error);
    return null;
  }
}

export async function getOptionsChain(
  ticker: string,
  expiration_date?: string
): Promise<any[]> {
  try {
    const params: any = { underlying_ticker: ticker };
    if (expiration_date) {
      params.expiration_date = expiration_date;
    }

    const response = await rest.getOptionsChain(params);
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching options chain for ${ticker}:`, error);
    return [];
  }
}

export async function getForexRates(from: string, to: string): Promise<any> {
  try {
    const response = await rest.getCurrencyConversion(from, to);
    return response || null;
  } catch (error) {
    console.error(`Error fetching forex rates for ${from}/${to}:`, error);
    return null;
  }
}

export async function getBenzingaNews(ticker?: string): Promise<any[]> {
  try {
    const params: any = {};
    if (ticker) {
      params.ticker = ticker;
    }

    const response = await rest.getBenzingaV1News(params);
    return response?.results || [];
  } catch (error) {
    console.error('Error fetching Benzinga news:', error);
    return [];
  }
}

export async function getBenzingaAnalystInsights(
  limit: string
): Promise<any[]> {
  try {
    const response = await rest.getBenzingaV1AnalystInsights({
      limit: limit,
      sort: 'date.desc',
    });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching analyst insights:`, error);
    return [];
  }
}

export async function getBenzingaEarnings(limit: string): Promise<any[]> {
  try {
    const response = await rest.getBenzingaV1Earnings({ limit });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching earnings:`, error);
    return [];
  }
}

export async function getStockSplits(limit: string): Promise<any[]> {
  try {
    const response = await rest.listStockSplits({
      order: 'asc',
      limit: limit,
      sort: 'execution_date',
    });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching stock splits:`, error);
    return [];
  }
}

export async function getDividends(limit: string): Promise<any[]> {
  try {
    const response = await rest.listDividends({
      order: 'asc',
      limit: limit,
      sort: 'ex_dividend_date',
    });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching dividends:`, error);
    return [];
  }
}

export async function getFinancials(ticker: string): Promise<any[]> {
  try {
    const response = await rest.listFinancials({
      order: 'asc',
      limit: limit,
      sort: 'report_date',
    });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching financials for ${ticker}:`, error);
    return [];
  }
}

export async function getRelatedCompanies(ticker: string): Promise<any[]> {
  try {
    const response = await rest.getRelatedCompanies({ ticker });
    return response?.results || [];
  } catch (error) {
    console.error(`Error fetching related companies for ${ticker}:`, error);
    return [];
  }
}

export async function getGroupedStocksAggregates(date: string): Promise<any[]> {
  try {
    const response = await rest.getGroupedStocksAggregates({ date });
    return response?.results || [];
  } catch (error) {
    console.error(
      `Error fetching grouped stocks aggregates for ${date}:`,
      error
    );
    return [];
  }
}

export async function getSnapshotSummary(): Promise<any> {
  try {
    const response = await rest.getSnapshotSummary();
    return response || null;
  } catch (error) {
    console.error('Error fetching snapshot summary:', error);
    return null;
  }
}

// Helper function to calculate performance metrics
export function calculatePerformanceMetrics(historicalPrices: number[]): {
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  threeMonths: number;
  oneYear: number;
} {
  if (historicalPrices.length < 2) {
    return { oneDay: 0, oneWeek: 0, oneMonth: 0, threeMonths: 0, oneYear: 0 };
  }

  const current = historicalPrices[historicalPrices.length - 1];
  const oneDayAgo = historicalPrices[Math.max(0, historicalPrices.length - 2)];
  const oneWeekAgo = historicalPrices[Math.max(0, historicalPrices.length - 7)];
  const oneMonthAgo =
    historicalPrices[Math.max(0, historicalPrices.length - 30)];
  const threeMonthsAgo =
    historicalPrices[Math.max(0, historicalPrices.length - 90)];
  const oneYearAgo = historicalPrices[0];

  return {
    oneDay: ((current - oneDayAgo) / oneDayAgo) * 100,
    oneWeek: ((current - oneWeekAgo) / oneWeekAgo) * 100,
    oneMonth: ((current - oneMonthAgo) / oneMonthAgo) * 100,
    threeMonths: ((current - threeMonthsAgo) / threeMonthsAgo) * 100,
    oneYear: ((current - oneYearAgo) / oneYearAgo) * 100,
  };
}

// Rate limiting helper
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
