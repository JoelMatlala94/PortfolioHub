import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import useHomeViewModel from '@/viewmodels/HomeViewModel';
import HomePortfolioView from '@/components/HomePortfolioView';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const HomePage = () => {
  const {
    stocks,
    error,
    fetchStocksFromFirebase,
    totalStockQuantity,
    totalStockValue,
  } = useHomeViewModel();

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  useFocusEffect(
    React.useCallback(() => {
      fetchStocksFromFirebase();
    }, [])
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const chartData = stocks.map((item, index) => ({
    name: item.symbol,
    quantity: item.quantity,
    color: colors[index % colors.length],
    legendFontColor: '#FFFFFF',
    legendFontSize: 15,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Portfolio Overview</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth * 0.85}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          accessor="quantity"
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
      <HomePortfolioView
        totalStockQuantity={totalStockQuantity}
        totalStockValue={totalStockValue}
      />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
});

export default HomePage;