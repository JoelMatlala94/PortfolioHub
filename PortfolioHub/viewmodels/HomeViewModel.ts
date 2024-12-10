import { getDocs, collection } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig'; 
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

  const calculateRecentDivChanges = useCallback(async () => {
    const recentDivChanges = [];
    const today = new Date();
  
    for (const stock of stocks) {
      try {
        // Reference to the Dividends subcollection for the stock
        const divChangesRef = collection(firestore, `users/${userID}/stocks/${stock.symbol}/Dividends`);
        const snapshot = await getDocs(divChangesRef);
        if (!snapshot.empty) {
          // Extract and sort dividend data by exDivDate (document ID as Date), descending
          const dividends = snapshot.docs
            .map(doc => {
              const data = doc.data() as DividendData;
              const exDivDate = new Date(doc.id); // Document ID is the ex-dividend date
              return {
                symbol: stock.symbol,
                dividendAmount: data.dividendAmount || 0,
                exDivDate,
                payDate: data.payDate || "Unknown Pay Date",
              };
            })
            .sort((a, b) => b.exDivDate.getTime() - a.exDivDate.getTime());
          // Compare the two most recent dividends
          if (dividends.length >= 2) {
            const latest = dividends[0];
            const previous = dividends[1];
  
            if (latest.dividendAmount !== previous.dividendAmount) {
              recentDivChanges.push({
                symbol: stock.symbol,
                oldDividend: previous.dividendAmount,
                newDividend: latest.dividendAmount,
                exDivDate: latest.exDivDate,
                payDate: latest.payDate,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching recent dividend changes for ${stock.symbol}:`, error);
      }
    }
    // Sort changes by ex-dividend date, descending (most recent first)
    const sortedChanges = recentDivChanges.sort((a, b) => b.exDivDate.getTime() - a.exDivDate.getTime());
    // Return structured output for UI
    if (sortedChanges.length === 0) {
      return "No Recent Dividend Changes";
    }
    return sortedChanges.map(change => {
      const { symbol, oldDividend, newDividend, exDivDate, payDate } = change;
      const formattedDate = exDivDate.toLocaleDateString("en-US");
      return {
        symbol,
        oldDividend: oldDividend,
        newDividend: newDividend,
        exDivDate: formattedDate,
        payDate,
      };
    });
  }, [stocks, userID]);  
  
  return {
    stocks,
    totalStockValue: useMemo(() => calculateCurrentValue(), [calculateCurrentValue]),
    calculateAnnualIncome,
    calculateMonthlyIncome,
    calculateDailyIncome,
    calculateYield,
    calculateYieldOnCost,
    calculateRecentDivChanges,
  };
};

export default useHomeViewModel;