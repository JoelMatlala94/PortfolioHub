import React from 'react';
import { StyleSheet, TextInput, Button, View, Text, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from "@/contexts/ThemeContext";
import usePortfolioViewModel from '@/viewmodels/PortfolioViewModel';
import { useRouter } from 'expo-router';

export default function AddStockModal() {
  const { currentThemeAttributes } = useTheme();
  const {
    addStock,
    stockSymbol, 
    setStockSymbol,
    stockQuantity, 
    setStockQuantity,
    averagePrice, 
    setAveragePrice
  } = usePortfolioViewModel();
  const router = useRouter();

  const handleSubmit = () => {
    addStock();
    router.replace('/(tabs)/portfolio');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: currentThemeAttributes.backgroundColor }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
          <Text style={[styles.title, { color: currentThemeAttributes.textColor }]}>Add Stock</Text>
          <View style={[styles.separator, { backgroundColor: currentThemeAttributes.textShadowColor }]} />
          <TextInput
            style={[styles.input, { color: currentThemeAttributes.textColor }]}
            placeholder="Enter stock symbol (e.g. AAPL)"
            placeholderTextColor={currentThemeAttributes.textShadowColor}
            value={stockSymbol}
            onChangeText={setStockSymbol}
          />
          <TextInput
            style={[styles.input, { color: currentThemeAttributes.textColor }]}
            placeholder="Enter quantity"
            placeholderTextColor={currentThemeAttributes.textShadowColor}
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { color: currentThemeAttributes.textColor }]}
            placeholder="Enter Average Price"
            placeholderTextColor={currentThemeAttributes.textShadowColor}
            value={averagePrice}
            onChangeText={setAveragePrice}
            keyboardType="numeric"
          />
          <Button title="Submit Stock" onPress={handleSubmit} />
          <Button title="Cancel" onPress={() => router.replace('/(tabs)/portfolio')} color="red" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    width: '80%',
  },
});