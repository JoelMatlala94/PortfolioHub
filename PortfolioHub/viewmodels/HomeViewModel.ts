import { getDocs, collection } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig'; // Adjust import as per your project structure
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { useCallback, useMemo } from 'react';

const useHomeViewModel = () => {
  const { stocks } = usePortfolioViewModel();
  const userID = auth.currentUser?.uid;

  const calculateCurrentValue = useCallback(() => {
    return stocks.reduce(
      (total, stock) => total + ((stock.currentPrice || stock.averagePrice) * stock.quantity),
      0
    );
  }, [stocks]);

  const calculateCostBasis = useCallback(() => {
    return stocks.reduce((total, stock) => total + (stock.averagePrice * stock.quantity), 0);
  }, [stocks]);

  const calculateAnnualIncome = useCallback(async () => {
    let totalAnnualIncome = 0;

    for (const stock of stocks) {
      const dividendsRef = collection(firestore, `users/${userID}/stocks/${stock.symbol}/Dividends`);
      const snapshot = await getDocs(dividendsRef);

      const annualDividend = snapshot.docs.reduce((sum, doc) => {
        const dividendData = doc.data();
        return sum + (dividendData.dividendAmount * dividendData.frequency * stock.quantity);
      }, 0);

      totalAnnualIncome += annualDividend;
    }

    return totalAnnualIncome;
  }, [stocks, userID]);

  const calculateMonthlyIncome = useCallback(async () => {
    const annualIncome = await calculateAnnualIncome();
    return annualIncome / 12;
  }, [calculateAnnualIncome]);

  const calculateDailyIncome = useCallback(async () => {
    const annualIncome = await calculateAnnualIncome();
    return annualIncome / 365;
  }, [calculateAnnualIncome]);

  const calculateYield = useCallback(async () => {
    const currentValue = calculateCurrentValue();
    if (currentValue === 0) return 0;

    const annualIncome = await calculateAnnualIncome();
    return (annualIncome / currentValue) * 100;
  }, [calculateAnnualIncome, calculateCurrentValue]);

  const calculateYieldOnCost = useCallback(async () => {
    const costBasis = calculateCostBasis();
    if (costBasis === 0) return 0;

    const annualIncome = await calculateAnnualIncome();
    return (annualIncome / costBasis) * 100;
  }, [calculateAnnualIncome, calculateCostBasis]);

  return {
    stocks,
    totalStockValue: useMemo(() => calculateCurrentValue(), [calculateCurrentValue]),
    calculateAnnualIncome,
    calculateMonthlyIncome,
    calculateDailyIncome,
    calculateYield,
    calculateYieldOnCost,
  };
};

export default useHomeViewModel;