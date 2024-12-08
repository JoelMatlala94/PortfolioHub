export interface Stock {
    symbol: string;
    name: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: any;
    annualIncome?: number; 
    annualYield?: number; 
    lastUpdate: string;
    date: string;
    lastNewsUpdate: string;
  }
  