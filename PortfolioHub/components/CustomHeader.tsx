import React from 'react';
import { TouchableOpacity, SafeAreaView, Platform, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const CustomHeader = () => (
  <SafeAreaView style={styles.safeArea}>
    <BlurView intensity={1} style={styles.headerBlur}>
      <TouchableOpacity onPress={router.back} style={styles.backButton}>
        <Ionicons name="arrow-back" size={34} color={Colors.light.tabIconDefault} />
      </TouchableOpacity>
    </BlurView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    zIndex: 1, 
  },
  backButton: {
    padding: 10,
  },
});

export default CustomHeader;