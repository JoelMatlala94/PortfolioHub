import { useState, useEffect, useCallback } from 'react';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { auth, firestore } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function useCalendarViewModel() {
  const [events, setEvents] = useState<Record<string, { name: string }[]>>({});
  const { stocks, fetchDividendData } = usePortfolioViewModel();

  // Stable fetchCalendarEvents using useCallback
  const fetchCalendarEvents = useCallback(async () => {
    const allEvents: Record<string, { name: string }[]> = {};  
    // Fetch and merge dividend data for each stock
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const { symbol } = stock;
        // Fetch dividend data from Firestore
        const dividendsCollectionRef = collection(
          firestore,
          `users/${auth.currentUser?.uid}/stocks/${symbol}/Dividends`
        );
        const dividendDocs = await getDocs(dividendsCollectionRef);
        // Convert Firestore documents to an array of dividend data
        const dividendData: DividendData[] = dividendDocs.docs.map((doc) => ({
          date: doc.id, // Use the document ID as the ex-dividend date
          ...(doc.data() as Omit<DividendData, 'date'>), // Spread other fields from the document
        }));
        return {
          ...stock, // Retain existing stock attributes
          dividends: dividendData, // Add array of dividend data
        };
      })
    );
  
    // Generate events from updated stocks
    updatedStocks.forEach((stock) => {
      const { symbol, quantity, dividends } = stock;
      dividends.forEach((dividend) => {
        const { date: exDividendDate, payDate, dividendAmount } = dividend;
        // Add Ex-Dividend Date event
        if (exDividendDate) {
          if (!allEvents[exDividendDate]) {
            allEvents[exDividendDate] = [];
          }
          allEvents[exDividendDate].push({
            name: `${symbol} Ex-Dividend Date`,
          });
        }
        // Add Pay Date event
        if (payDate) {
          if (!allEvents[payDate]) {
            allEvents[payDate] = [];
          }
          allEvents[payDate].push({
            name: `${symbol} Pay Date: $${dividendAmount || "N/A"} per share!\n\nTotal Payment: $${(
              dividendAmount * quantity
            ).toFixed(2)}`,
          });
        }
      });
    });    
  
    setEvents(allEvents);
  }, [stocks]); // Depends only on the stocks array

  // Effect to trigger fetchCalendarEvents only when stocks change
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      fetchCalendarEvents();
    }
  }, [stocks, fetchCalendarEvents]); // Ensure effect only re-triggers when stocks change

  return { events, fetchCalendarEvents };
}