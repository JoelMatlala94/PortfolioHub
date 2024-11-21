import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomePortfolioView = ({ totalStockQuantity, totalStockValue }) => {
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryText}>Total Stocks Quantity: {totalStockQuantity}</Text>
      <Text style={styles.summaryText}>Total Stocks Value: ${totalStockValue.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default HomePortfolioView;