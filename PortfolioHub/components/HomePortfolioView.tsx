import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme,  } from '@react-navigation/native';

const HomePortfolioView = ({ totalStockQuantity, totalStockValue }) => {
  const theme = useColorScheme();
  const currentStyles = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <View style={styles.summary}>
      <Text style={[styles.valueText, { textAlign: 'right' }]}>
          {totalStockValue.toLocaleString("en-US", {style:"currency", currency:"USD"})}
      </Text>
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryText, { textAlign: 'left' }]}>
          Total Shares:
        </Text>
        <Text style={[styles.summaryText, { textAlign: 'right' }]}>
          {totalStockQuantity}
        </Text>
      </View>
      <Divider bold />
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  valueText: {
    fontSize: 45,
    fontWeight: '900',
    color: '#FFFFFF',
    paddingBottom: 21,
  },
  summaryText: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 5,
  },
});

export default HomePortfolioView;