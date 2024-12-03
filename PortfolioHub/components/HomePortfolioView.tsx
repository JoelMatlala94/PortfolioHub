import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme,  } from '@react-navigation/native';
import { useTheme } from "@/contexts/ThemeContext";

const HomePortfolioView = ({ totalStockQuantity, totalStockValue }) => {
  const { currentThemeAttributes } = useTheme();

  return (
    <View style={styles.summary}>
      <Text style={[styles.valueText, { color: currentThemeAttributes.textColor }]}>
          {totalStockValue.toLocaleString("en-US", {style:"currency", currency:"USD"})}
      </Text>
      <View style={[styles.summaryContainer, { borderBottomColor: currentThemeAttributes.textShadowColor }]}>
        <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
          Total Shares:
        </Text>
        <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor}]}>
          {totalStockQuantity.toFixed(3)}
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
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomWidth: 3,
  },
  valueText: {
    fontSize: 45,
    fontWeight: '900',
    paddingBottom: 21,
  },
  summaryText: {
    fontSize: 21,
    fontWeight: '900',
    marginVertical: 5,
  },
});

export default HomePortfolioView;