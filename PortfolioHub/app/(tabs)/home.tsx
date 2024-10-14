import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const HomePage = () => {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', quantity: 5, price: 150 },
    { symbol: 'GOOGL', quantity: 2, price: 2800 },
  ]);

  const [cryptos, setCryptos] = useState([
    { symbol: 'BTC', quantity: 0.5, price: 60000 },
    { symbol: 'ETH', quantity: 3, price: 4000 },
  ]);

  const chartData = [...stocks, ...cryptos].map(item => ({
    name: item.symbol,
    quantity: item.quantity * item.price, 
    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16), 
    legendFontColor: '#fff',
    legendFontSize: 15,
  }));

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
        <Text style={styles.summaryText}>Total Stocks: ${stocks.reduce((total, stock) => total + (stock.quantity * stock.price), 0).toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Crypto: ${cryptos.reduce((total, crypto) => total + (crypto.quantity * crypto.price), 0).toFixed(2)}</Text>
        <Text style={styles.summaryText}>Grand Total: ${(stocks.reduce((total, stock) => total + (stock.quantity * stock.price), 0) + 
          cryptos.reduce((total, crypto) => total + (crypto.quantity * crypto.price), 0)).toFixed(2)}</Text>
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
