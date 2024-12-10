import React from 'react';
import { StyleSheet, Button, View, Text, Dimensions, FlatList, } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from "@/contexts/ThemeContext";
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { Stock } from '@/models/Stock';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const PortfolioView = () => {
  const {
    stocks,
    showChart,
    setShowChart,
    removeStock,
    calculateTotalReturn,
    calculateCurrentValue,
    calculatePercentageGain,
    calculateStockPercentageGain,
    calculateStockValue,
    totalStockQuantity,
  } = usePortfolioViewModel();
  const { currentThemeAttributes } = useTheme();
  const sortedStocks = stocks.sort((a, b) => (b.currentPrice * b.quantity) - (a.currentPrice * a.quantity));
  //Used to calculate color for gains and percentage also returned on home page.
  const totalGains = calculateCurrentValue() - calculateTotalReturn();
  const iconName = totalGains >= 0 ? "caret-up" : 'caret-down'; 
  const totalGainsColor = totalGains >= 0 ? currentThemeAttributes.green : currentThemeAttributes.red;
  const totalPercentageGainColor = calculatePercentageGain() >= 0 ? currentThemeAttributes.green : currentThemeAttributes.red;
  
  const renderStockItem = ({ item }: { item: Stock }) => {
    const isGain = calculateStockPercentageGain(item) >= 0;
    const iconName = isGain ? "caret-up" : 'caret-down'; 
    const gainsColor = isGain ? currentThemeAttributes.green : currentThemeAttributes.red
    
    return (
        <View style={[styles.stockItem, { borderBottomColor: currentThemeAttributes.textShadowColor }]}>
        <View style={[styles.stockInfo, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
            <Text style={[styles.stockSymbol, { color: currentThemeAttributes.textColor }]}>{item.symbol}</Text>
            <Text style={[styles.stockName, { color: currentThemeAttributes.textColor }]}>
            {item.name.length > 65 ? item.name.substring(0, 65) + "..." : item.name}
            </Text>
            <Text style={[styles.stockDetails, { color: currentThemeAttributes.textColor }]}>
            Value: 
            <Text style={[styles.bold, { color: gainsColor }]}>
                {` ${(item.quantity*item.currentPrice).toLocaleString("en-US", { style: "currency", currency: "USD" })}`}
            </Text>
            </Text>
            <Text style={[styles.stockDetails, { color: currentThemeAttributes.textColor }]}>
            Quantity: 
            <Text style={styles.bold}>
                {` ${item.quantity} @ ${item.averagePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}`}
            </Text>
            </Text>
            <Text style={[styles.stockDetails, { color: currentThemeAttributes.textColor }]}>
            Total Return:  
            <Text style={[styles.bold, { color: gainsColor }]}>
                {' '}<FontAwesome name={iconName} size={14} color={gainsColor} /> 
                {` ${calculateStockValue(item).toLocaleString("en-US", { style: "currency", currency: "USD" })}`}
                {` @ ${calculateStockPercentageGain(item) !== 0 ? calculateStockPercentageGain(item).toFixed(2) : 'N/A'}%`}
            </Text>
            </Text>
            <Text style={[styles.stockDetails, { color: currentThemeAttributes.textShadowColor }]}>
            Current Price: 
            <Text style={styles.bold}>
                {` ${item.currentPrice?.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 'N/A'}`}
            </Text>
            </Text>
            <Text style={[styles.stockDetails, { color: currentThemeAttributes.textShadowColor }]}>
            Current Annual Yield ≈ 
            <Text style={styles.bold}>
                {` ${item.annualIncome?.toLocaleString("en-US", { style: "currency", currency: "USD" }) || 'N/A'} @ ${item.annualYield?.toFixed(2) || 'N/A'}%`}
            </Text>
            </Text>
        </View>
        <Button title="Remove" onPress={() => {removeStock(item.symbol)}} color="red" />
        </View>
    );
  };

  const chartData = {
    labels: ['Initial', 'Current'],
    datasets: [
      {
        data: [calculateTotalReturn()/1000, calculateCurrentValue()/1000],
        color: () => `rgba(0, 255, 0, 0.7)`,
        strokeWidth: 1.5,
      },
    ],
    legend: ['Total Portfolio Value'],
  };

  return (
    <View style={{ backgroundColor: currentThemeAttributes.backgroundColor, flex: 1 }}>
      <FlatList
        style={{ backgroundColor: currentThemeAttributes.backgroundColor }}
        data={sortedStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol.toString()}
        ListHeaderComponent={
          <View style={[styles.container, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
            <Text style={[styles.title, { color: currentThemeAttributes.textColor }]}>Overall Performance</Text>

            <View style={[styles.summary, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
              <View style={styles.row}>
                <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                  Total Value: 
                </Text>
                <Text style={[styles.summaryText, styles.bold, { color: currentThemeAttributes.textColor }]}>
                  {calculateCurrentValue().toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                  Total Shares: 
                </Text>
                <Text style={[styles.summaryText, styles.bold, { color: currentThemeAttributes.textColor }]}>
                  {totalStockQuantity.toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                  Estimated Gains: 
                </Text>
                <Text style={[styles.summaryText, styles.bold, { color: totalGainsColor }]}>
                  <FontAwesome name={iconName} size={14} color={totalGainsColor} />{' '}
                  {totalGains.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.summaryText, { color: currentThemeAttributes.textColor }]}>
                  Total Percent Change: 
                </Text>
                <Text style={[styles.summaryText, styles.bold, { color: totalPercentageGainColor }]}>
                  {calculatePercentageGain().toFixed(2)}%
                </Text>
              </View>
            </View>

            {showChart && (
              <View style={{ backgroundColor: currentThemeAttributes.backgroundColor, justifyContent: 'center' }}>
                <LineChart
                  data={chartData}
                  width={screenWidth}
                  height={220}
                  yAxisLabel="$"
                  yAxisSuffix="k"
                  chartConfig={{
                    backgroundColor: '#000',
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => currentThemeAttributes.green,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    strokeWidth: 1,
                    style: { borderRadius: 16 },
                    decimalPlaces: 2,
                    
                  }}
                  bezier
                  style={{ marginVertical: 8, borderRadius: 16, justifyContent: "center", alignContent: "center" }}
                />
                <Button title="Go Back" color='red' onPress={() => setShowChart(false)} />
              </View>
            )}
            {!showChart && (
              <Button title="View Total Portfolio Performance Chart" color={currentThemeAttributes.tintColor} onPress={() => setShowChart(true) } />
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
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  summary: {
    padding: 10,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 18,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
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

export default PortfolioView;