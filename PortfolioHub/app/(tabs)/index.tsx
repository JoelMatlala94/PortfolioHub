import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "../../firebaseConfig";
import LoginScreen from '@/components/LoginScreen';
import HomePortfolioView from '@/components/HomePortfolioView';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomePortfolioView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 0, // Add some padding to the top
  }
});