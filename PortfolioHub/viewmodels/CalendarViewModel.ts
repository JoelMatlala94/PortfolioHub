import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { FMP_API_KEY } from 'react-native-dotenv';
import { format, addMonths } from 'date-fns';

export default function useCalendarViewModel() {
  const { stocks } = usePortfolioViewModel(); // Get stocks from PortfolioViewModel
  const [events, setEvents] = useState({});
  const [calendarKey, setCalendarKey] = useState(0); // Unique key for forcing re-render

  const fetchDividendDates = useCallback(async () => {
    const newEvents: { [key: string]: { name: string }[] } = {};
    const today = format(new Date(), 'yyyy-MM-dd');
    const threeMonthsLater = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

    try {
      for (const stock of stocks) {
        // Add stock-added event
        if (!newEvents[stock.date]) {
          newEvents[stock.date] = [{ name: `Stock Added: ${stock.symbol}` }];
        }

        // Fetch dividend data
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/stock_dividend_calendar?symbol=${stock.symbol}&from=${today}&to=${threeMonthsLater}&apikey=${FMP_API_KEY}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          data.forEach((dividend: any) => {
            const dividendDate = dividend.date; // Keep date as string
            if (!newEvents[dividendDate]) {
              newEvents[dividendDate] = [];
            }

            // Add dividend event
            newEvents[dividendDate].push({
              name: `${stock.symbol} Dividend: $${dividend.dividend}`,
            });
          });
        }
      }

      setEvents(newEvents); // Update state with fetched events
    } catch (error) {
      console.error('Error fetching dividend dates:', error);
      Alert.alert('Error', 'Failed to fetch dividend dates.');
    }
  }, [stocks]);

  return {
    events,
    fetchDividendDates,
    calendarKey,
  };
}
