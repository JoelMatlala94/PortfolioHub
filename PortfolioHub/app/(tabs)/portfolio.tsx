import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Alert, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { firestore, auth } from '@/firebaseConfig'; 
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 

interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
}

const PortfolioScreen: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  // Function to generate a random stock
  const generateRandomStock = (): Stock => {
    const randomSymbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'NFLX'];
    const randomIndex = Math.floor(Math.random() * randomSymbols.length);
    const randomQuantity = Math.floor(Math.random() * 100) + 1;
    const randomPrice = (Math.random() * 1000).toFixed(2);

    return {
      symbol: randomSymbols[randomIndex],
      name: randomSymbols[randomIndex],
      quantity: randomQuantity,
      purchasePrice: parseFloat(randomPrice),
    };
  };

  const handleAddRandomStock = async () => {
    const randomStock = generateRandomStock();
    const user = auth.currentUser; 
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'stocks'), {
        ...randomStock,
        userId: user.uid,  
      });

      
      setStocks([...stocks, randomStock]);

      Alert.alert('Success', `${randomStock.symbol} added successfully!`);
    } catch (error) {
      console.error('Error adding random stock:', error);
      Alert.alert('Error', 'Failed to save the random stock to Firestore.');
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
      const stocksList = querySnapshot.docs.map((doc) => doc.data() as Stock);
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
      <FlatList
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Add Random Stock" onPress={handleAddRandomStock} />
    </View>
  );
};

// Styles
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
  },
  stockText: {
    fontSize: 16,
  },
});

export default PortfolioScreen;
