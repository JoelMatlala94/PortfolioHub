import { useState, useEffect } from 'react';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';

export default function useCalendarViewModel() {
  const [events, setEvents] = useState<Record<string, { name: string }[]>>({});
  const { stocks } = usePortfolioViewModel();

  const fetchCalendarEvents = async () => {
    const allEvents: Record<string, { name: string }[]> = {};

    stocks.forEach((stock) => {
      const { symbol, exDividendDate, payDate, dividendAmount, quantity } = stock;

      if (exDividendDate) {
        if (!allEvents[exDividendDate]) {
          allEvents[exDividendDate] = [];
        }
        allEvents[exDividendDate].push({
          name: `${symbol} Ex-Dividend Date`,
        });
      }

      if (payDate) {
        if (!allEvents[payDate]) {
          allEvents[payDate] = [];
        }
        allEvents[payDate].push({
          name: `${symbol} Pay Date: $${dividendAmount || 'N/A'} per share!\n\nTotal Payment: $${(parseFloat(dividendAmount) * quantity).toFixed(2)}`,
        });
      }
    });

    setEvents(allEvents);
  };

  useEffect(() => {
    if (!stocks || stocks.length === 0) {
      return;
    }

    fetchCalendarEvents();
  }, [stocks]);

  return { events, fetchCalendarEvents };
}