import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { Stock } from '@/models/Stock';

//const API_KEY = '663038ae8502426f91fbfdc16026e648';

export default function usePortfolioViewModel() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const fetchStockFromAPI = async (symbol: string, quantity: number): Promise<Stock | null> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.code || !data.symbol || !data.name) return null;

      return {
        id: '',
        symbol: data.symbol,
        name: data.name,
        quantity,
        purchasePrice: parseFloat(data.close || '0'),
      };
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  };

  const fetchLatestPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      return data.close ? parseFloat(data.close) : null;
    } catch (error) {
      console.error('Error fetching latest price:', error);
      return null;
    }
  };

  const fetchStocks = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const q = query(collection(firestore, 'stocks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const stocksList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const stockData = doc.data() as Stock;
          const latestPrice = await fetchLatestPrice(stockData.symbol);
          if (latestPrice !== null) await updateDoc(doc.ref, { currentPrice: latestPrice });
          return { id: doc.id, ...stockData, currentPrice: latestPrice };
        })
      );
      setStocks(stocksList);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = async (symbol: string, quantity: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const stock = await fetchStockFromAPI(symbol, quantity);
    if (!stock) return;

    try {
      const docRef = await addDoc(collection(firestore, 'stocks'), { ...stock, userId: user.uid });
      stock.id = docRef.id;
      setStocks((prevStocks) => [...prevStocks, stock]);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const removeStock = async (stockId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(firestore, 'stocks', stockId));
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== stockId));
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const calculateTotalPurchaseValue = () => {
    return stocks.reduce((total, stock) => total + stock.purchasePrice * stock.quantity, 0);
  };

  const calculateTotalCurrentValue = () => {
    return stocks.reduce((total, stock) => total + ((stock.currentPrice || stock.purchasePrice) * stock.quantity), 0);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return {
    stocks,
    isLoading,
    showChart,
    setShowChart,
    addStock,
    removeStock,
    calculateTotalPurchaseValue,
    calculateTotalCurrentValue,
  };
}