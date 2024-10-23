import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Alert, FlatList, TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { firestore, auth } from '@/firebaseConfig'; 
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 

interface Stock {
  id: string;  
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
}

const API_KEY = '663038ae8502426f91fbfdc16026e648';

const PortfolioScreen: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
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

  const fetchStocks = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      const q = query(collection(firestore, 'stocks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const stocksList = querySnapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data() as Stock
      }));
      setStocks(stocksList);  
    } catch (error) {
      console.error('Error fetching stocks from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch stocks from Firestore.');
    }
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

  const renderStockItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity style={styles.stockItem}>
      <Text style={styles.stockText}>
        {item.symbol} - {item.name} - Quantity: {item.quantity} - Price: ${item.purchasePrice.toFixed(2)}
      </Text>
      <Button title="Remove" onPress={() => handleRemoveStock(item.id)} color="red" />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Portfolio</Text>
      <FlatList
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.id}
      />

      
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
  stockItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 16,
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
