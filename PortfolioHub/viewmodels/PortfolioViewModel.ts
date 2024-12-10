import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '@/firebaseConfig';
import { Stock } from '@/models/Stock';
import { Alert, Dimensions } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { differenceInMinutes } from 'date-fns';
// @ts-ignore 
import { API_KEY, POLYGON_KEY } from 'react-native-dotenv'; 

const screenWidth = Dimensions.get('window').width;

export default function usePortfolioViewModel() {
  const user = auth.currentUser;
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
      const now = new Date();
      if (data.code || !data.symbol || !data.name) {
        Alert.alert('Error', 'Invalid stock symbol or API error. Please try again.');
        return null;
      }
      // Default values for quantity and averagePrice (use appropriate logic to set these)
      const quantity = parseInt(stockQuantity || '0'); 
      let averagePrice;
      averagePrice = parseFloat(averagePrice || '0');
      // Build the stock object
      const stock: Stock = {
        symbol: data.symbol,
        name: data.name,
        quantity,
        averagePrice,
        currentPrice: parseFloat(data.close || '0'),
        date: data.date,
        lastUpdate: now.toISOString(),
        lastNewsUpdate: "",
      };
      // Fetch dividend data and update the stock
      fetchDividendData(user?.uid || 'N/A', symbol);
      const [updatedStock] = await getAnnualDividend([stock]);
      return updatedStock;
    } catch (error) {
      console.error('Error fetching stock data from API:', error);
      Alert.alert('Error', 'Failed to fetch stock data.');
      return null;
    }
  };

  const fetchDividendData = async (userID: string, symbol: string) => {
    try {
      const response = await fetch(`https://api.polygon.io/v3/reference/dividends?ticker=${symbol}&apiKey=${POLYGON_KEY}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const dividend = data.results[0]; // Fetch the first result (most recent dividend)
        const exDividendDate = dividend.ex_dividend_date || "N/A";
        const payDate = dividend.pay_date || "N/A";
        const dividendAmount = dividend.cash_amount || "N/A";
        const frequency = dividend.frequency || "Unknown";
        const dividendData = {
          exDividendDate,
          payDate,
          dividendAmount,
          frequency,
        };
        const docRef = doc( // Save to Firestore
          firestore,
          `users/${userID}/stocks/${symbol}/Dividends/${exDividendDate}`
        );
        await setDoc(docRef, dividendData);
        console.log(`Dividend data saved for ${symbol} on ${exDividendDate}`);
        return dividendData;
      }
      // Handle case where no data is available
      const noDataResponse = {
        exDividendDate: "No data available",
        payDate: "No data available",
        dividendAmount: "No data available",
        frequency: "No data available",
      };
      console.warn(`No dividend data found for ${symbol}`);
      return noDataResponse;
    } catch (error) {
      console.error("Error fetching or saving dividend data:", error);
      return {
        exDividendDate: "Error",
        payDate: "Error",
        dividendAmount: "Error",
        frequency: "Error",
      };
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
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
    const isMarketOpen = () => {
      const now = new Date();
      const day = now.getDay(); // Sunday - Saturday : 0 - 6
      const hour = now.getHours(); // Market open hours: Weekdays 9:30 AM to 4:00 PM
      const isWeekday = day > 0 && day < 6; // Monday to Friday
      const isWithinMarketHours = hour >= 9 && (hour < 16 || (hour === 9 && now.getMinutes() >= 30));
      return isWeekday && isWithinMarketHours;
    };
    try {
      const q = query(collection(firestore, `users/${user?.uid}/stocks`));
      const querySnapshot = await getDocs(q);
      const stocksList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const stockData = doc.data() as Stock;
          // Check the last update time
          const lastUpdate = stockData.lastUpdate ? new Date(stockData.lastUpdate) : null;
          const now = new Date();
          const shouldUpdatePrice =
            !stockData.currentPrice || // Update if currentPrice is missing
            (isMarketOpen() && (!lastUpdate || differenceInMinutes(now, lastUpdate) >= 120));
          // Update the price only if the market is open
          if (shouldUpdatePrice) {
            const latestPrice = await fetchLatestPrice(stockData.symbol);
            if (latestPrice !== null) {
              await updateDoc(doc.ref, { 
                currentPrice: latestPrice,
                lastUpdate: now.toISOString(),  
              });
              return { ...stockData, currentPrice: latestPrice, lastUpdate: now.toISOString()};
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
    return stocks.reduce((total, stock) => total + (stock.averagePrice * stock.quantity), 0);
  };

  const calculateCurrentValue = () => {
    return stocks.reduce((total, stock) => total + ((stock.currentPrice || stock.averagePrice) * stock.quantity), 0);
  };

  const calculateReturns = () => {
    if (calculateTotalReturn() === 0) return 0;
    return (calculateCurrentValue() - calculateTotalReturn());
  }

  const calculatePercentageGain = () => {
    if (calculateTotalReturn() === 0) return 0;
    return ((calculateCurrentValue() - calculateTotalReturn()) / calculateTotalReturn() * 100);
  }

  const calculateStockPercentageGain = (stock: Stock) => {
    if (stock.currentPrice - stock.averagePrice === 0) return 0;
    return ((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100;
  }

  const calculateStockValue = (stock: Stock) => {
    if (stock.currentPrice - stock.averagePrice === 0) return 0;
    return ((stock.quantity*stock.currentPrice)-(stock.quantity*stock.averagePrice));
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

  useEffect(() => {
    const userID = auth.currentUser?.uid;
    // Real-time listener for stock updates
    const unsubscribe = onSnapshot(
      collection(firestore, `users/${userID}/stocks`),
      (snapshot) => {
        const updatedStocks = snapshot.docs.map((doc) => doc.data() as Stock);
        setStocks(updatedStocks); // Update state with the latest data
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
      Alert.alert('Missing Symbol, Quantity or Average/Price Paid', 'Please enter a stock symbol, a quantity, and (an average) price paid.');
      return;
    }
    const normalizedSymbol = stockSymbol.trim().toUpperCase(); // Normalize stock symbol
    const stock = await fetchStockFromAPI(normalizedSymbol);
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
      const stockRef = collection(firestore, `users/${user.uid}/stocks`);
      const stockDocRef = doc(stockRef, normalizedSymbol); // Use symbol as the document ID
      const stockDocSnap = await getDoc(stockDocRef);
      if (stockDocSnap.exists()) {
        // Stock already exists, update it
        const existingData = stockDocSnap.data();
        const existingQuantity = existingData.quantity || 0;
        const existingAveragePrice = existingData.averagePrice || 0;
        // Calculate new average price
        const totalExistingValue = existingQuantity * existingAveragePrice;
        const newQuantity = existingQuantity + parseFloat(stockQuantity);
        const newTotalValue = totalExistingValue + parseFloat(stockQuantity) * parseFloat(averagePrice);
        const newAveragePrice = newTotalValue / newQuantity;
        // Update stock document
        await updateDoc(stockDocRef, {
          quantity: newQuantity,
          averagePrice: newAveragePrice.toFixed(2),
        });
        // Update local state
        setStocks(
          stocks.map((s) =>
            s.symbol === normalizedSymbol
              ? { ...s, quantity: newQuantity, averagePrice: newAveragePrice }
              : s
          )
        );
        Alert.alert('Success', `Updated ${normalizedSymbol} (${stock.name}) successfully!`);
      } else {
        // Stock doesn't exist, add a new document
        await setDoc(stockDocRef, {
          ...stock,
          quantity: parseFloat(stockQuantity),
          averagePrice: parseFloat(averagePrice),
          purchasePrice: parseFloat(averagePrice),
          date: new Date().toISOString().split('T')[0], // Initialize purchase dates list
        });
        // Update local state
        setStocks([
          ...stocks,
          { ...stock, quantity: parseFloat(stockQuantity), averagePrice: parseFloat(averagePrice), date: new Date().toISOString().split('T')[0] },
        ]);
        Alert.alert('Success', `${normalizedSymbol} (${stock.name}) added successfully!`);
      }
    } catch (error) {
      console.error('Error adding/updating stock:', error);
      Alert.alert('Error', 'Failed to save the stock to Firestore.');
    }
    // Clear input fields and reset state
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

  const calculateTotalQuantity = () =>
    stocks.reduce((total, stock) => total + stock.quantity, 0);

  const getAnnualDividend = async (stocks: Stock[]): Promise<Stock[]> => {
    const userID = auth.currentUser?.uid;
    if (!userID) {
      throw new Error("User not authenticated");
    }
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const dividendsRef = collection(firestore, `users/${userID}/stocks/${stock.symbol}/Dividends`);
        const snapshot = await getDocs(dividendsRef);
  
        const annualDividend = snapshot.docs.reduce((sum, doc) => {
          const dividendData = doc.data();
          return sum + (dividendData.dividendAmount * dividendData.frequency);
        }, 0);
  
        const annualIncome = annualDividend * stock.quantity;
        const annualYield = (annualDividend / stock.currentPrice) * 100;
        return {
          ...stock,
          annualIncome,
          annualYield,
        };
      })
    );
    return updatedStocks;
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
    fetchDividendData,
    calculateReturns,
    totalStockQuantity: calculateTotalQuantity(),
  };
}