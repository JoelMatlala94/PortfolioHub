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
    getHeaderHeight,
  } = useHomeViewModel();

  const headerHeight = getHeaderHeight();

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#8A2BE2', '#00FFFF', '#FF4500', '#32CD32', '#1E90FF'];

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
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
      <Text style={styles.title}>My Portfolio</Text>
      <HomePortfolioView
        totalStockQuantity={totalStockQuantity}
        totalStockValue={totalStockValue}
      />
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#222',
            backgroundGradientFrom: '#222',
            backgroundGradientTo: '#222',
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          accessor="quantity"
          style={{ marginVertical: 8, borderRadius: 125, alignContent: "center" }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#222",
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  chartContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default HomePage;