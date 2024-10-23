import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { firestore, auth } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';  

const HomePage = () => {
  const [stocks, setStocks] = useState([]);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const fetchStocksFromFirebase = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      const q = query(collection(firestore, 'stocks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedStocks = querySnapshot.docs.map(doc => doc.data());
      setStocks(fetchedStocks);
    } catch (error) {
      console.error('Error fetching stocks from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch stocks from Firestore.');
    }
  };

  
  useFocusEffect(
    React.useCallback(() => {
      fetchStocksFromFirebase();
    }, [])
  );

  const chartData = stocks.map((item, index) => ({
    name: item.symbol,
    quantity: item.quantity,
    color: colors[index % colors.length],
    legendFontColor: '#FFFFFF',
    legendFontSize: 15,
  }));

  const totalStockQuantity = stocks.reduce((total, stock) => total + stock.quantity, 0);
  const totalStockValue = stocks.reduce((total, stock) => total + (stock.quantity * stock.purchasePrice), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Portfolio Overview</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="quantity"
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Stocks Quantity: {totalStockQuantity}
        </Text>
        <Text style={styles.summaryText}>
          Total Stocks Value: ${totalStockValue.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  summary: {
    marginTop: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    color: '#495057',
    marginVertical: 5,
  },
});

export default HomePage;
