// mockMetalData.ts

export const mockMetalPrices = {
  base: 'INR',
  timestamp: Math.floor(Date.now() / 1000),
  rates: {
    XAU: 6000,
    XAG: 70,
    XPT: 2500,
    XPD: 3000,
  },
};

export const mockHistoricalData = {
  base: 'INR',
  start_date: '',
  end_date: '',
  rates: (() => {
    const today = new Date();
    const rates: Record<string, Record<string, number>> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      rates[dateStr] = {
        XAU: 6000 + Math.round(Math.random() * 100 - 50),
        XAG: 70 + Math.round(Math.random() * 5 - 2),
        XPT: 2500 + Math.round(Math.random() * 100 - 50),
        XPD: 3000 + Math.round(Math.random() * 100 - 50),
      };
    }
    return rates;
  })(),
};
