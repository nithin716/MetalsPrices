
import { mockMetalPrices, mockHistoricalData } from './mockMetalData';


export interface MetalPrices {
  base: string;
  timestamp: number;
  rates: {
    XAU: number;
    XAG: number;
    XPT: number;
    XPD: number;
  };
}

export interface HistoricalData {
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [metal: string]: number;
    };
  };
}

  export type Currency = 'INR' | 'USD';
  export type Metal = 'XAU' | 'XAG' | 'XPT' | 'XPD';

  export const METAL_NAMES = {
    XAU: 'Gold',
    XAG: 'Silver', 
    XPT: 'Platinum',
    XPD: 'Palladium'
  } as const;

class MetalPriceAPI {
  async getLivePrices(currency: Currency = 'INR'): Promise<MetalPrices> {
    // Ignore currency for mock
    return mockMetalPrices;
  }

  async getHistoricalData(
    metal: Metal,
    currency: Currency = 'INR',
    days: number = 7
  ): Promise<HistoricalData> {
    // Ignore currency and days for mock
    return mockHistoricalData;
  }

  async getMetalDetails(metal: Metal, currency: Currency = 'INR') {
    const [livePrices, historicalData] = await Promise.all([
      this.getLivePrices(currency),
      this.getHistoricalData(metal, currency, 7)
    ]);

    const currentPrice = livePrices.rates[metal];
    const dates = Object.keys(historicalData.rates).sort();
    const prices = dates.map(date => historicalData.rates[date][metal]).filter(Boolean);

    // Calculate previous close and open
    const previousClose = prices.length > 1 ? prices[prices.length - 2] : currentPrice;
    const previousOpen = prices.length > 0 ? prices[0] : currentPrice;

    return {
      name: METAL_NAMES[metal],
      symbol: metal,
      currentPrice,
      previousClose,
      previousOpen,
      lastUpdated: new Date(livePrices.timestamp * 1000),
      currency,
      historicalPrices: dates.map((date, index) => ({
        date,
        price: prices[index]
      })).filter(item => item.price)
    };
  }
}

export const metalApi = new MetalPriceAPI();