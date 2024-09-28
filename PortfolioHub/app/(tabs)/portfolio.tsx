import { StyleSheet, Button, Modal, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Text, View } from '@/components/Themed';

export default function PortfolioScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleAddStock = async () => {
    if (!stockSymbol || !quantity) {
      Alert.alert('Error', 'Please enter both stock symbol and quantity.');
      return;
    }

    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=YOUR_API_KEY`);
      const data = await response.json();
      const bestMatch = data.bestMatches[0];

      if (!bestMatch) {
        Alert.alert('Error', 'Stock symbol not found.');
        return;
      }

      const stockName = bestMatch['2. name'];
      const purchasePrice = 100;

      setStocks([...stocks, { symbol: stockSymbol.toUpperCase(), name: stockName, quantity, purchasePrice }]);

      setStockSymbol('');
      setQuantity('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch stock details.');
    }
  };

  const renderStockItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.stockItem} 
      onPress={() => {
        setSelectedStock(item);
        setDetailModalVisible(true);
      }}
    >
      <Text style={styles.stockText}>{item.symbol} - {item.name} - Quantity: {item.quantity}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Button title="Add Stock" onPress={() => setModalVisible(true)} color="#007BFF" />
      
      <FlatList
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.stockList}
      />

      {/* Add Stock Modal */}
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

      {/* Stock Details Modal */}
      {selectedStock && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={detailModalVisible}
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedStock.name}</Text>
            <Text style={styles.modalText}>Symbol: {selectedStock.symbol}</Text>
            <Text style={styles.modalText}>Quantity: {selectedStock.quantity}</Text>
            <Text style={styles.modalText}>Purchase Price: ${selectedStock.purchasePrice}</Text>
            <Text style={styles.modalText}>Current Value: ${(selectedStock.purchasePrice * selectedStock.quantity).toFixed(2)}</Text>
            <Button title="Close" onPress={() => setDetailModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
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
  modalText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
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
  stockList: {
    width: '100%',
    marginTop: 20,
  },
  stockItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  stockText: {
    fontSize: 16,
  },
});
