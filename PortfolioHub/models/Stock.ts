export interface Stock {
    symbol: string;
    name: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: any;
    lastUpdate: string;
    date: string;
    lastNewsUpdate: string;
    exDividendDate: string;
    payDate: string;
    dividendAmount: string;
}  