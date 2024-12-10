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
    calculateRecentDivChanges,
  } = useHomeViewModel();
  const {calculatePercentageGain, calculateReturns} = usePortfolioViewModel();

  const { currentThemeAttributes } = useTheme();
  const headerHeight = getHeaderHeight();
  const [annualIncome, setAnnualIncome] = useState<number | null>(null); // Allow null and number
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null); // Allow null and number
  const [dailyIncome, setDailyIncome] = useState<number | null>(null); // Allow null and number
  const [divYield, setYield] = useState<number | null>(null); // Allow null and number
  const [divYieldonCost, setYieldonCost] = useState<number | null>(null); // Allow null and number
  const [recentDivChanges, setRecentDivChanges] = useState<DividendChange[] | null | string>(null);
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

  useEffect(() => {
    let isMounted = true; // Track component mount status to avoid state updates on unmounted components
    const fetchRecentDivChanges = async () => {
      try {
        setLoading(true); // Set loading state to true while fetching data
        const changes = await calculateRecentDivChanges();
        if (isMounted) {
          setRecentDivChanges(changes);
        }
      } catch (error) {
        console.error("Error fetching recent dividend changes:", error);
        if (isMounted) {
          setRecentDivChanges("Error loading data");
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Ensure loading state is reset
        }
      }
    };
    fetchRecentDivChanges();
    return () => {
      isMounted = false; // Clean up to prevent state updates on unmounted components
    };
  }, [calculateRecentDivChanges]);

  //Colors for Pie Chart used for Portfolio Composition
  const colors = [ currentThemeAttributes.green, currentThemeAttributes.tintColor, currentThemeAttributes.red, '#FF5733', '#FFD700', '#8A2BE2', '#00FFFF', '#FF4500', '#32CD32', '#1E90FF'];

  const chartData = stocks
    .map((item) => ({
      name: item.symbol,
      quantity: item.quantity * item.averagePrice, // Calculates total value of shares.
    }))
    .sort((a, b) => b.quantity - a.quantity) // Sort by total value in descending order.
    .map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      legendFontColor: currentThemeAttributes.textColor, // Use theme text color
      legendFontSize: 15,
  }));

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
        {/*Income Section */}
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
        </View>
        {/* Estimated Income Section */}
        <View style={[styles.sectionContainer, { borderColor: currentThemeAttributes.textShadowColor}]}>
          <Text style={[styles.title, { color: currentThemeAttributes.textColor }]}>
            Estimated Income
          </Text>
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
              {loading ? "...%" : divYield?.toFixed(2) + '%'}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { textAlign: 'left', color: currentThemeAttributes.textColor }]}>
              Yield on Cost:
            </Text>
            <Text style={[styles.summaryText, { textAlign: 'right', color: currentThemeAttributes.textColor }]}>
              {loading ? "...%" : divYieldonCost?.toFixed(2) + '%'}
            </Text>
          </View>
        </View>

        {/* Portfolio Composition Section */}
        <View style={ styles.container }>
        <View style={[styles.chartContainer, {borderColor: currentThemeAttributes.textShadowColor}]}>
          <Text
            style={[
              styles.title,
              { color: currentThemeAttributes.textColor, 
                borderColor: currentThemeAttributes.textShadowColor,
                shadowColor: currentThemeAttributes.textColor,
                paddingTop: 10,
              },
            ]}
          >
            Portfolio Composition
          </Text>
          
            <PieChart
              data={chartData}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: currentThemeAttributes.backgroundColor,
                backgroundGradientFrom: currentThemeAttributes.backgroundColor,
                backgroundGradientTo: currentThemeAttributes.backgroundColor,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: () => currentThemeAttributes.textColor,
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
        </View> 
        {/* Recent Dividend Changes Section */}
        <View style={[styles.sectionContainer, { borderColor: currentThemeAttributes.textShadowColor }]}>
          <Text style={[styles.sectionTitle, { color: currentThemeAttributes.textColor }]}>
            Recent Dividend Changes
          </Text>
          {loading ? (
            <Text style={[styles.divChangeText, { color: currentThemeAttributes.textShadowColor }]}>
              ...
            </Text>
          ) : recentDivChanges === null || recentDivChanges === "No Recent Dividend Changes" ? (
            <Text style={[styles.noDivChangesText, { color: currentThemeAttributes.textShadowColor }]}>
              No Recent Dividend Changes
            </Text>
          ) : (
            (recentDivChanges as DividendChange[]).map((change: DividendChange, index: number) => (
              <View key={index} style={styles.divChangeItem}>
                <Text style={[styles.symbolText, { color: currentThemeAttributes.textColor }]}>
                  {change.symbol}
                </Text>
                <Text style={[styles.divChangeText, { color: currentThemeAttributes.textColor }]}>
                  {`${change.oldDividend.toFixed(3)} `}
                  <FontAwesome name={"arrow-right"} size={14} color={(change.newDividend - change.oldDividend) < 0? currentThemeAttributes.green : currentThemeAttributes.red}/>
                  {` ${change.newDividend.toFixed(3)}`}
                </Text>
                <Text style={[styles.exDivDateText, { color: currentThemeAttributes.textShadowColor }]}>
                  {`Ex-Div Date: ${change.exDivDate}`}
                </Text>
              </View>
            ))
          )}
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
  sectionContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    shadowOpacity: 0.8,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  noDivChangesText: {
    fontSize: 14,
    padding: 10,
  },
  gainsText: {
    fontSize: 18,
    padding: 2,
    fontWeight: '900',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartContainer: {
    borderRadius: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    borderTopWidth: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    //borderLeftWidth: 1,
    //borderRightWidth: 1,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start', // Aligns to the left
  },
  divChangeText: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  exDivDateText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  divChangeItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default HomeView;