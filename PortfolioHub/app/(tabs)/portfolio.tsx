import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, FlatList, View, Text, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Stock } from '@/models/Stock';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { useTheme } from "@/contexts/ThemeContext";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const screenWidth = Dimensions.get('window').width;

const PortfolioScreen = () => {
  const {
    stocks,
    showChart,
    stockSymbol,
    stockQuantity,
    averagePrice,
    isAddingStock,
    setShowChart,
    addStock,
    removeStock,
    setStockSymbol,
    setStockQuantity,
    setAveragePrice,
    calculateTotalReturn,
    calculateCurrentValue,
    setIsAddingStock,
    calculatePercentageGain,
    calculateStockPercentageGain,
  } = usePortfolioViewModel();
  const { currentThemeAttributes } = useTheme();

  const renderStockItem = ({ item }: { item: Stock }) => (
    <View style={[styles.stockItem, { borderBottomColor: currentThemeAttributes.textShadowColor }]}>
      <View style={[styles.stockInfo, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
        <Text style={[styles.stockSymbol, { color: currentThemeAttributes.textColor }]}>{item.symbol}</Text>
        <Text style={[styles.stockName, { color: currentThemeAttributes.textColor }]}>
          {item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name}
        </Text>
        <Text style={[styles.stockDetails, { color: currentThemeAttributes.textColor }]}>
          Quantity: <Text style={styles.bold}>{item.quantity}</Text>
        </Text>
        <Text style={[styles.stockDetails, { color: currentThemeAttributes.textColor }]}>
          Total Percent Change: <Text style={styles.bold}>{calculateStockPercentageGain(item) !== 0 ? calculateStockPercentageGain(item).toFixed(2) : 'N/A'}%</Text>
        </Text>
        <Text style={[styles.stockDetails, { color: currentThemeAttributes.textShadowColor }]}>
          Average Price: <Text style={styles.bold}>${item.averagePrice.toFixed(2)}</Text>
        </Text>
        <Text style={[styles.stockDetails, { color: currentThemeAttributes.textShadowColor }]}>
          Current Price: <Text style={styles.bold}>${item.currentPrice?.toFixed(2) || 'N/A'}</Text>
        </Text>
      </View>
      <Button title="Remove" onPress={() => removeStock(item.symbol)} color="red" />
    </View>
  );

  const chartData = {
    labels: ['Initial', 'Current'],
    datasets: [
      {
        data: [calculateTotalReturn(), calculateCurrentValue()],
        color: () => `rgba(0, 255, 0, 0.7)`,
        strokeWidth: 2,
      },
    ],
    legend: ['Total Portfolio Value'],
  };

  return (
    <View style={{ backgroundColor: currentThemeAttributes.backgroundColor, flex: 1 }}>
      <KeyboardAwareFlatList
        style={{ backgroundColor: currentThemeAttributes.backgroundColor }}
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol.toString()}
        ListHeaderComponent={
          <View style={[styles.container, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
            <Text style={[styles.title, { color: currentThemeAttributes.textColor }]}>Portfolio</Text>

            <View style={[styles.summary, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
              <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                Total Value: <Text style={styles.bold}>{calculateCurrentValue().toLocaleString("en-US", {style:"currency", currency:"USD"})}</Text>
              </Text>
              <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                Estimated Gains: <Text style={styles.bold}>{(calculateCurrentValue() - calculateTotalReturn()).toLocaleString("en-US", {style:"currency", currency:"USD"})}</Text>
              </Text>
              <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                Total Percent Change: <Text style={styles.bold}>{calculatePercentageGain().toFixed(2)}%</Text>
              </Text>
            </View>

            {showChart && (
              <View style={{ backgroundColor: currentThemeAttributes.backgroundColor }}>
                <LineChart
                  data={chartData}
                  width={screenWidth * 0.9}
                  height={257}
                  chartConfig={{
                    backgroundColor: '#000',
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    strokeWidth: 2,
                    style: { borderRadius: 16 },
                  }}
                  style={{ marginVertical: 8, borderRadius: 16, alignContent: "center" }}
                />
                <Button title="Go Back" color='red' onPress={() => setShowChart(false)} />
              </View>
            )}
            {!showChart && (
              <Button title="View Total Portfolio Performance Chart" onPress={() => setShowChart(true)} />
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 18,
  },
  bold: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PortfolioScreen;