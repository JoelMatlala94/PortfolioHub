import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Alert, FlatList, TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { firestore, auth } from '@/firebaseConfig'; 
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 

interface Stock {
  id: string;  
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
}

const API_KEY = '663038ae8502426f91fbfdc16026e648';
const screenWidth = Dimensions.get('window').width;

const PortfolioScreen: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showChart, setShowChart] = useState(false);  
  const [stockSymbol, setStockSymbol] = useState(''); 
  const [stockQuantity, setStockQuantity] = useState(''); 
  const [isAddingStock, setIsAddingStock] = useState(false); 

  const fetchStockFromAPI = async (symbol: string): Promise<Stock | null> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.code || !data.symbol || !data.name) {
        Alert.alert('Error', 'Invalid stock symbol or API error.');
        return null;
      }

      return {
        id: '', 
        symbol: data.symbol,
        name: data.name,
        quantity: parseInt(stockQuantity), 
        purchasePrice: parseFloat(data.close || '0'), 
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
      const q = query(collection(firestore, 'stocks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const stocksList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const stockData = doc.data() as Stock;
          const latestPrice = await fetchLatestPrice(stockData.symbol);
          if (latestPrice !== null) {
            await updateDoc(doc.ref, { currentPrice: latestPrice });
          }
          return { id: doc.id, ...stockData, currentPrice: latestPrice };
        })
      );
      setStocks(stocksList);
    } catch (error) {
      console.error('Error fetching stocks from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch stocks from Firestore.');
    }
  };

  const calculateTotalPurchaseValue = () => {
    return stocks.reduce((total, stock) => total + (stock.purchasePrice * stock.quantity), 0);
  };

  const calculateTotalCurrentValue = () => {
    return stocks.reduce((total, stock) => total + ((stock.currentPrice || stock.purchasePrice) * stock.quantity), 0);
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

  const handleAddStock = async () => {
    if (!stockSymbol || !stockQuantity) {
      Alert.alert('Error', 'Please enter both a stock symbol and a quantity.');
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
      const docRef = await addDoc(collection(firestore, 'stocks'), {
        ...stock,
        userId: user.uid,  
      });

      stock.id = docRef.id;  
      setStocks([...stocks, stock]);
      Alert.alert('Success', `${stock.symbol} (${stock.name}) added successfully!`);
    } catch (error) {
      console.error('Error adding stock:', error);
      Alert.alert('Error', 'Failed to save the stock to Firestore.');
    }

    setStockSymbol('');
    setStockQuantity('');
    setIsAddingStock(false); 
  };

  const handleRemoveStock = async (stockId: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'stocks', stockId));
      setStocks(stocks.filter(stock => stock.id !== stockId)); 
      Alert.alert('Success', 'Stock removed successfully!');
    } catch (error) {
      console.error('Error removing stock:', error);
      Alert.alert('Error', 'Failed to remove stock.');
    }
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <View style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.stockDetails}>Purchase Price: ${item.purchasePrice.toFixed(2)}</Text>
        <Text style={styles.stockDetails}>Current Price: ${item.currentPrice?.toFixed(2) || 'N/A'}</Text>
      </View>
      <Button title="Remove" onPress={() => handleRemoveStock(item.id)} color="red" />
    </View>
  );

  
  const chartData = {
    labels: ['Initial', 'Current'],
    datasets: [
      {
        data: [calculateTotalPurchaseValue(), calculateTotalCurrentValue()],
        color: () => `rgba(0, 255, 0, 0.7)`, 
        strokeWidth: 2,
      },
    ],
    legend: ['Total Portfolio Value'],
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Portfolio</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Cost: ${calculateTotalPurchaseValue().toFixed(2)}</Text>
        <Text style={styles.summaryText}>Estimated Gains: ${(calculateTotalCurrentValue() - calculateTotalPurchaseValue()).toFixed(2)}</Text>
      </View>

      {showChart ? (
        <ScrollView horizontal>
          <LineChart
            data={chartData}
            width={screenWidth * 0.8} 
            height={220}
            chartConfig={{
              backgroundColor: '#000',
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
              style: { borderRadius: 16 },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
          <Button title="Go Back" onPress={() => setShowChart(false)} />
        </ScrollView>
      ) : (
        <>
          <FlatList
            data={stocks}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.id}
          />
          <Button title="View Total Portfolio Performance Chart" onPress={() => setShowChart(true)} />
        </>
      )}

      {!isAddingStock ? (
        <Button title="Add Stock" onPress={() => setIsAddingStock(true)} />
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter stock symbol (e.g. AAPL)"
            value={stockSymbol}
            onChangeText={setStockSymbol}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="numeric"
          />
          <Button title="Submit Stock" onPress={handleAddStock} />
          <Button title="Cancel" onPress={() => setIsAddingStock(false)} color="red" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockName: {
    fontSize: 16,
    color: '#555',
  },
  stockDetails: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default PortfolioScreen;
