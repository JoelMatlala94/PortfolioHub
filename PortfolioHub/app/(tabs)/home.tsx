import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import useHomeViewModel from '@/viewmodels/HomeViewModel';
import HomePortfolioView from '@/components/HomePortfolioView';
import { useTheme } from "@/contexts/ThemeContext";
import { getHeaderHeight } from '@/hooks/getHeaderHeight';

const screenWidth = Dimensions.get('window').width;

const HomePage = () => {
  const {
    stocks,
    error,
    totalStockQuantity,
    totalStockValue,
  } = useHomeViewModel();
  const { currentThemeAttributes } = useTheme();
  const headerHeight = getHeaderHeight();
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#8A2BE2', '#00FFFF', '#FF4500', '#32CD32', '#1E90FF'];

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const chartData = stocks.map((item, index) => ({
    name: item.symbol,
    quantity: item.quantity * item.averagePrice, // Calculates total value of shares.
    color: colors[index % colors.length],
    legendFontColor: currentThemeAttributes.textColor, // Use theme text color
    legendFontSize: 15,
  }))
  .sort((a, b) => b.quantity - a.quantity); //Sort by total value in decending order.

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: currentThemeAttributes.backgroundColor },
      ]}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
        <Text
          style={[
            styles.title,
            { color: currentThemeAttributes.textColor, textShadowColor: currentThemeAttributes.textShadowColor},
          ]}
        >
          Home
        </Text>
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
              backgroundColor: currentThemeAttributes.backgroundColor,
              backgroundGradientFrom: currentThemeAttributes.backgroundColor,
              backgroundGradientTo: currentThemeAttributes.backgroundColor,
              color: (opacity = 1) =>
                `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) =>
                currentThemeAttributes.textColor, // Theme text color for labels
              style: { borderRadius: 16 },
            }}
            accessor="quantity"
            backgroundColor={(currentThemeAttributes.backgroundColor)}
            paddingLeft="15"
            style={{
              marginVertical: 8,
              borderRadius: 125,
              alignContent: 'center',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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