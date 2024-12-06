import usePortfolioViewModel from './PortfolioViewModel';

const useHomeViewModel = () => {
  const {stocks} = usePortfolioViewModel();

  const calculateTotalQuantity = () => 
    stocks.reduce((total, stock) => total + stock.quantity, 0);

  const calculateCurrentValue = () => {
    return stocks.reduce((total, stock) => total + ((stock.currentPrice || stock.averagePrice) * stock.quantity), 0);
  };

  return {
    stocks,
    totalStockQuantity: calculateTotalQuantity(),
    totalStockValue: calculateCurrentValue(),
  };
};

export default useHomeViewModel;