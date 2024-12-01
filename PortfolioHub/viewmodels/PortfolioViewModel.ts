import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { Stock } from '@/models/Stock';
import { Alert, Dimensions } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';

const API_KEY = '663038ae8502426f91fbfdc16026e648';
const screenWidth = Dimensions.get('window').width;

export default function usePortfolioViewModel() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showChart, setShowChart] = useState(false);  
  const [stockSymbol, setStockSymbol] = useState(''); 
  const [stockQuantity, setStockQuantity] = useState('');
  const [averagePrice, setAveragePrice] = useState(''); 
  const [isAddingStock, setIsAddingStock] = useState(false); 
  const fetchStockFromAPI = async (symbol: string): Promise<Stock | null> => {
  try {
    const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.code || !data.symbol || !data.name) {
      Alert.alert('Error', 'Invalid stock symbol or API error. Please try again.');
      return null;
    }

    return { 
      symbol: data.symbol,
      name: data.name,
      quantity: parseInt(stockQuantity), 
      averagePrice: parseFloat(averagePrice || '0'), 
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

    try {
      const q = query(collection(firestore, `users/${user?.uid}/stocks`));
      const querySnapshot = await getDocs(q);
      const stocksList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const stockData = doc.data() as Stock;
          const latestPrice = await fetchLatestPrice(stockData.symbol);
          if (latestPrice !== null) {
            await updateDoc(doc.ref, { currentPrice: latestPrice });
          }
          return {  
            ...stockData,
            currentPrice: latestPrice,
          };
        })
      );
      setStocks(stocksList);
    } catch (error) {
      console.error('Error fetching stocks from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch stocks from Firestore.');
    }
  };

  const calculateTotalReturn = () => {
    return stocks.reduce((total, stock) => total + (stock.averagePrice * stock.quantity), 0);
  };

  const calculateCurrentValue = () => {
    return stocks.reduce((total, stock) => total + ((stock.currentPrice || stock.averagePrice) * stock.quantity), 0);
  };

  const calculatePercentageGain = () => {
    if (calculateTotalReturn() === 0) return 0;
    return ((calculateCurrentValue() - calculateTotalReturn()) / calculateTotalReturn() * 100);
  }

  const calculateStockPercentageGain = (stock: Stock) => {
    if (stock.currentPrice - stock.averagePrice === 0) return 0;
    return ((stock.currentPrice - stock.averagePrice) / stock.averagePrice * 100);
  }

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

  const addStock = async () => {
    if (!stockSymbol || !stockQuantity || !averagePrice) {
      Alert.alert('Error', 'Please enter a stock symbol, a quantity and average price paid.');
      return;
    }
    const stock = await fetchStockFromAPI(stockSymbol);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
    if (!stock) {
      Alert.alert('Error', 'Failed to fetch stock data.');
      return;
    }
    try {
      const docRef = await addDoc(collection(firestore, `users/${user?.uid}/stocks`), {
        ...stock,
        date: new Date().toISOString().split('T')[0], //Gets the purchase date in YYYY-MM-DD format. 
      });
      setStocks([...stocks, { ...stock}]);
      Alert.alert('Success', `${stock.symbol} (${stock.name}) added successfully!`);
    } catch (error) {
      console.error('Error adding stock:', error);
      Alert.alert('Error', 'Failed to save the stock to Firestore.');
    }
    setStockSymbol('');
    setStockQuantity('');
    setIsAddingStock(false); 
  };

  const removeStock = async (symbol: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
    try {
      const q = query(collection(firestore, `users/${user?.uid}/stocks`), where('symbol', '==', symbol));
      const querySnapshot = await getDocs(q);
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
  };
}