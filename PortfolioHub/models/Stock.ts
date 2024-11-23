export interface Stock {
    id: string;
    symbol: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    currentPrice?: number;
}  