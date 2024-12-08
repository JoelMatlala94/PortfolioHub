import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from "@/contexts/ThemeContext";
import useHomeViewModel from '@/viewmodels/HomeViewModel';
import { getHeaderHeight } from '@/hooks/getHeaderHeight';
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const HomeView = () => {
  const {
    stocks,
    totalStockValue,
    calculateAnnualIncome,
    calculateMonthlyIncome,
    calculateDailyIncome,
    calculateYield,
    calculateYieldOnCost,
  } = useHomeViewModel();
  const {calculatePercentageGain, calculateReturns} = usePortfolioViewModel();

  const { currentThemeAttributes } = useTheme();
  const headerHeight = getHeaderHeight();

  const [annualIncome, setAnnualIncome] = useState<number | null>(null); // Allow null and number
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null); // Allow null and number
  const [dailyIncome, setDailyIncome] = useState<number | null>(null); // Allow null and number
  const [divYield, setYield] = useState<number | null>(null); // Allow null and number
  const [divYieldonCost, setYieldonCost] = useState<number | null>(null); // Allow null and number

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      try {
        const annual = await calculateAnnualIncome(); // Fetch annual income
        const monthly = await calculateMonthlyIncome(); // Fetch monthly income
        const daily = await calculateDailyIncome(); // Fetch daily income
        const divYield = await calculateYield(); //Fetch Yield percentage 
        const divYieldonCost = await calculateYieldOnCost(); //Fetch Yield percentage 
        setAnnualIncome(annual); // Set it in state
        setMonthlyIncome(monthly);
        setDailyIncome(daily);
        setYield(divYield);
        setYieldonCost(divYieldonCost);
      } catch (error) {
        console.error("Error fetching income:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchIncome();
  }, [calculateAnnualIncome, calculateMonthlyIncome, calculateDailyIncome, calculateYield, calculateYieldOnCost]); // Run effect when calculateAnnualIncome changes
  //Colors for Pie Chart used for Portfolio Composition
  const colors = [ currentThemeAttributes.green, currentThemeAttributes.tintColor, currentThemeAttributes.red, '#FF5733', '#FFD700', '#8A2BE2', '#00FFFF', '#FF4500', '#32CD32', '#1E90FF'];

  const chartData = stocks.map((item, index) => ({
    name: item.symbol,
    quantity: item.quantity * item.averagePrice, // Calculates total value of shares.
    color: colors[index % colors.length],
    legendFontColor: currentThemeAttributes.textColor, // Use theme text color
    legendFontSize: 15,
  })).sort((a, b) => b.quantity - a.quantity); // Sort by total value in descending order.

  const isPositive = calculatePercentageGain() >= 0; 
  const iconName = isPositive ? "caret-up" : 'caret-down'; 
  const iconColor = isPositive ? currentThemeAttributes.green : currentThemeAttributes.red;

  return (
    <View style={[styles.screen, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
        <Text
          style={[
            styles.title,
            { color: currentThemeAttributes.textColor, textShadowColor: currentThemeAttributes.textShadowColor },
          ]}
        >
          Home
        </Text>
        <View style={styles.summary}>
          <Text style={[styles.valueText, { color: currentThemeAttributes.textColor }]}>
            {totalStockValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </Text>
          <Text style={[styles.gainsText, { color: iconColor, textShadowColor: iconColor, paddingBottom: 0 }]}>
            <FontAwesome name={iconName} size={14} color={iconColor} />{' '}
            {calculateReturns().toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </Text>
          <Text style={[styles.gainsText, { color: iconColor, textShadowColor: iconColor }]}>
            {calculatePercentageGain().toFixed(2)+'%'}
          </Text>
          <View style={styles.summaryContainer }>
            <Text style={[styles.title, { color: currentThemeAttributes.textColor, textShadowColor: currentThemeAttributes.textShadowColor }]}>
              Estimated Income
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Annual:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "$..." : annualIncome?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Monthly:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "$..." : monthlyIncome?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Daily:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "$..." : dailyIncome?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Yield:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "...%" : divYield?.toFixed(2)+'%'}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Yield on Cost:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "...%" : divYieldonCost?.toFixed(2)+'%'}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.title,
            { color: currentThemeAttributes.textColor, textShadowColor: currentThemeAttributes.textShadowColor, paddingTop: 25 },
          ]}
        >
          Portfolio Composition
        </Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: currentThemeAttributes.backgroundColor,
              backgroundGradientFrom: currentThemeAttributes.backgroundColor,
              backgroundGradientTo: currentThemeAttributes.backgroundColor,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: () => currentThemeAttributes.textColor, // Theme text color for labels
              style: { borderRadius: 16 },
            }}
            accessor="quantity"
            backgroundColor={currentThemeAttributes.backgroundColor}
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
  summary: {
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 25,
    paddingBottom: 15,
  },
  valueText: {
    fontSize: 45,
    fontWeight: '900',
  },
  gainsText: {
    fontSize: 18,
    padding: 2,
    fontWeight: '900',
    paddingBottom: 21,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  summaryText: {
    fontSize: 21,
    fontWeight: '900',
  },
  incomeText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '900',
  },
  chartContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default HomeView;