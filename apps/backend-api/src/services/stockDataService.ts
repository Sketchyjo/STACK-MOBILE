import axios from 'axios';

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  logoUrl?: string;
  description?: string;
  industry?: string;
  sector?: string;
}

interface HistoricalData {
  date: string;
  close: number;
}

interface CompanyProfile {
  symbol: string;
  name: string;
  description: string;
  industry: string;
  sector: string;
  logoUrl: string;
  website: string;
  marketCap: number;
}

class StockDataService {
  private readonly apiKey = '70127de3aemsh9598ff04adca14dp145073jsn0d9cfd0be94b';
  private readonly baseUrl = 'https://yahoo-finance15.p.rapidapi.com/api/v2';

  private readonly axiosInstance = axios.create({
    headers: {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
    }
  });

  async searchStocks(page: number = 1): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/markets/tickers`,
        {
          params: {
            page,
            type: 'STOCKS'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/quote/${symbol}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getHistoricalData(symbol: string, from: string, to: string): Promise<HistoricalData[]> {
    try {
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/historical/${symbol}`,
        {
          params: {
            from,
            to
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw error;
    }
  }
}

export default new StockDataService();
