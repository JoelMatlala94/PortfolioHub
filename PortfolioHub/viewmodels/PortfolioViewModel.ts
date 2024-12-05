import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { Stock } from '@/models/Stock';
import { Alert, Dimensions } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { differenceInMinutes } from 'date-fns';
import { API_KEY, POLYGON_API_KEY } from 'react-native-dotenv';

const screenWidth = Dimensions.get('window').width;

export default function usePortfolioViewModel() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [isAddingStock, setIsAddingStock] = useState(false);

  const fetchDividendData = async (symbol: string) => {
    try {
      const response = await fetch(`https://api.polygon.io/v3/reference/dividends?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const dividend = data.results[0]; // Fetch the first result (most recent dividend)
        return {
          exDividendDate: dividend.ex_dividend_date || 'N/A',
          payDate: dividend.pay_date || 'N/A',
          dividendAmount: dividend.cash_amount || 'N/A',
        };
      }
      return {
        exDividendDate: 'No data available',
        payDate: 'No data available',
        dividendAmount: 'No data available',
      };
    } catch (error) {
      console.error('Error fetching dividend data:', error);
      return {
        exDividendDate: 'Error',
        payDate: 'Error',
        dividendAmount: 'Error',
      };
    }
  };

  const fetchStockFromAPI = async (symbol: string): Promise<Stock | null> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      const now = new Date();
  
      if (data.code || !data.symbol || !data.name) {
        Alert.alert('Error', 'Invalid stock symbol or API error. Please try again.');
        return null;
      }
  
      const dividendData = await fetchDividendData(symbol);
  
      console.log(`Stock: ${symbol}`);
      console.log(`Ex-Dividend Date: ${dividendData.exDividendDate}`);
      console.log(`Pay Date: ${dividendData.payDate}`);
      console.log(`Dividend Amount: ${dividendData.dividendAmount}`);
  
      return {
        symbol: data.symbol,
        name: data.name,
        quantity: parseInt(stockQuantity) || 0, // Ensure quantity is a number
        averagePrice: parseFloat(averagePrice || '0'), // Ensure average price is valid
        date: data.date || now.toISOString().split('T')[0], // Use current date as fallback
        lastUpdate: now.toISOString(),
        exDividendDate: dividendData.exDividendDate,
        payDate: dividendData.payDate,
        dividendAmount: dividendData.dividendAmount,
      };
    } catch (error) {
      console.error('Error fetching stock data from API:', error);
      Alert.alert('Error', 'Failed to fetch stock data.');
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
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const isMarketOpen = () => {
      const now = new Date();
      const day = now.getDay(); // Sunday - Saturday: 0 - 6
      const hour = now.getHours();
      const isWeekday = day > 0 && day < 6; // Monday to Friday
      const isWithinMarketHours = hour >= 9 && (hour < 16 || (hour === 9 && now.getMinutes() >= 30));
      return isWeekday && isWithinMarketHours;
    };

    try {
      const q = query(collection(firestore, `users/${user.uid}/stocks`));
      const querySnapshot = await getDocs(q);
      const stocksList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const stockData = doc.data() as Stock;
          const lastUpdate = stockData.lastUpdate ? new Date(stockData.lastUpdate) : null;
          const now = new Date();
          const shouldUpdatePrice =
            !stockData.currentPrice ||
            (isMarketOpen() && (!lastUpdate || differenceInMinutes(now, lastUpdate) >= 120));

          if (shouldUpdatePrice) {
            const latestPrice = await fetchLatestPrice(stockData.symbol);
            if (latestPrice !== null) {
              await updateDoc(doc.ref, { currentPrice: latestPrice, lastUpdate: now.toISOString() });
              return { ...stockData, currentPrice: latestPrice, lastUpdate: now.toISOString() };
            }
          }
          return stockData;
        })
      );
      setStocks(stocksList);
    } catch (error) {
      console.error('Error fetching stocks from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch stocks from Firestore.');
    }
  };

  const calculateTotalReturn = () => {
    return stocks.reduce((total, stock) => total + stock.averagePrice * stock.quantity, 0);
  };

  const calculateCurrentValue = () => {
    return stocks.reduce((total, stock) => total + (stock.currentPrice || stock.averagePrice) * stock.quantity, 0);
  };

  const calculatePercentageGain = () => {
    if (calculateTotalReturn() === 0) return 0;
    return ((calculateCurrentValue() - calculateTotalReturn()) / calculateTotalReturn()) * 100;
  };

  const calculateStockPercentageGain = (stock: Stock) => {
    if (stock.currentPrice - stock.averagePrice === 0) return 0;
    return ((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100;
  };

  const calculateStockValue = (stock: Stock) => {
    return stock.quantity * (stock.currentPrice || stock.averagePrice) - stock.quantity * stock.averagePrice;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchStocks();
      } else {
        setStocks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userID = auth.currentUser?.uid;
    const unsubscribe = onSnapshot(
      collection(firestore, `users/${userID}/stocks`),
      (snapshot) => {
        const updatedStocks = snapshot.docs.map((doc) => doc.data() as Stock);
        setStocks(updatedStocks);
        fetchStocks();
      },
      (error) => {
        console.error('Error listening to stock updates:', error);
        Alert.alert('Error', 'Failed to listen to stock updates.');
      }
    );
    return () => unsubscribe();
  }, []);

  const addStock = async () => {
    if (!stockSymbol || !stockQuantity || !averagePrice) {
      Alert.alert('Error', 'Please enter a stock symbol, a quantity, and an average price paid.');
      return;
    }
  
    const normalizedSymbol = stockSymbol.trim().toUpperCase();
    const stock = await fetchStockFromAPI(normalizedSymbol);
    if (!stock) return;
  
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
  
    try {
      const stockRef = collection(firestore, `users/${user.uid}/stocks`);
      const stockDocRef = doc(stockRef, normalizedSymbol);
  
      // Include dividend data when adding stock
      const stockData = {
        ...stock,
        exDividendDate: stock.exDividendDate || 'N/A',
        payDate: stock.payDate || 'N/A',
        dividendAmount: stock.dividendAmount || 0,
      };
  
      await setDoc(stockDocRef, stockData);
  
      setStocks([...stocks, stockData]);
      Alert.alert('Success', `${normalizedSymbol} (${stock.name}) added successfully!`);
    } catch (error) {
      console.error('Error adding stock:', error);
      Alert.alert('Error', 'Failed to add stock to Firestore.');
    }
  
    setStockSymbol('');
    setStockQuantity('');
    setAveragePrice('');
    setIsAddingStock(false);
  };
  

  const removeStock = async (symbol: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      const stockRef = collection(firestore, `users/${user.uid}/stocks`);
      const stockDocRef = query(stockRef, where('symbol', '==', symbol));
      const querySnapshot = await getDocs(stockDocRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setStocks(stocks.filter((stock) => stock.symbol !== symbol));
      Alert.alert('Success', 'Stock removed successfully!');
    } catch (error) {
      console.error('Error removing stock:', error);
      Alert.alert('Error', 'Failed to remove stock.');
    }
  };

  return {
    stocks,
    showChart,
    setShowChart,
    isAddingStock,
    setIsAddingStock,
    stockSymbol,
    stockQuantity,
    setStockSymbol,
    setStockQuantity,
    averagePrice,
    setAveragePrice,
    addStock,
    removeStock,
    calculateTotalReturn,
    calculateCurrentValue,
    calculatePercentageGain,
    calculateStockPercentageGain,
    calculateStockValue,
  };
}
