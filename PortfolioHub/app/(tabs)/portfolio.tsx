import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Modal, TextInput, Alert, FlatList, TouchableOpacity, View, Text } from 'react-native';

const API_KEY = '2GSU1KK6959SOM26'; 

const PortfolioScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stocks, setStocks] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({});

  useEffect(() => {
    fetchCryptoPrices();
  }, [cryptos]);

  const handleAddStock = async () => {
    if (!stockSymbol || !quantity) {
      Alert.alert('Error', 'Please enter both stock symbol and quantity.');
      return;
    }

    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`);
      const data = await response.json();
      const stockData = data['Global Quote'];

      if (!stockData) {
        Alert.alert('Error', 'Stock symbol not found.');
        return;
      }

      const stockName = stockData['01. symbol'];
      const purchasePrice = parseFloat(stockData['05. price']);

      setStocks([...stocks, { symbol: stockName, name: stockName, quantity: Number(quantity), purchasePrice }]);
      setStockSymbol('');
      setQuantity('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch stock details.');
    }
  };

  const fetchCryptoPrices = async () => {
    const cryptoSymbols = ['BTC', 'ETH']; // Add more cryptocurrencies as needed
    const newCryptoPrices = {};

    for (const symbol of cryptoSymbols) {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${API_KEY}`);
        const data = await response.json();
        const cryptoData = data['Realtime Currency Exchange Rate'];

        if (cryptoData) {
          newCryptoPrices[symbol] = parseFloat(cryptoData['5. Exchange Rate']);
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
      }
    }

    setCryptoPrices(newCryptoPrices);
  };

  const handleAddCrypto = (symbol) => {
    const cryptoQuantity = 2; // Placeholder quantity
    const cryptoPurchasePrice = cryptoPrices[symbol] || 0; // Use fetched price

    if (cryptoPurchasePrice === 0) {
      Alert.alert('Error', 'Crypto price not available.');
      return;
    }

    setCryptos([...cryptos, { symbol, name: symbol, quantity: cryptoQuantity, purchasePrice: cryptoPurchasePrice }]);
    Alert.alert('Success', `${symbol} added successfully!`);
  };

  const renderStockItem = ({ item }) => (
    <TouchableOpacity style={styles.stockItem}>
      <Text style={styles.stockText}>
        {item.symbol} - {item.name} - Quantity: {item.quantity} - Price: ${item.purchasePrice.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  const renderCryptoItem = ({ item }) => (
    <TouchableOpacity style={styles.stockItem}>
      <Text style={styles.stockText}>
        {item.symbol} - {item.name} - Quantity: {item.quantity} - Price: ${item.purchasePrice.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>

      <View style={styles.horizontalContainer}>
        <View style={styles.listContainer}>
          <Text style={styles.tabTitle}>Stocks</Text>
          <FlatList
            data={stocks}
            renderItem={renderStockItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button title="Add Stock" onPress={() => setModalVisible(true)} />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.tabTitle}>Crypto</Text>
          <FlatList
            data={cryptos}
            renderItem={renderCryptoItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button title="Add Crypto (BTC)" onPress={() => handleAddCrypto('BTC')} />
          <Button title="Add Crypto (ETH)" onPress={() => handleAddCrypto('ETH')} />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Stock Symbol"
            value={stockSymbol}
            onChangeText={setStockSymbol}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <Button title="Submit" onPress={handleAddStock} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3D00" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stockItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stockText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default PortfolioScreen;
