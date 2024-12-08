import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import useRootViewModel from '@/hooks/RootLayoutViewModel';
import CustomHeader from '@/components/CustomHeader';

export default function RootLayout() {
  const { isLoading } = useRootViewModel();

  if (isLoading) {
    return (
      <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }}>
        <ActivityIndicator size="large" color={'#FFF'} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: 'transparent' },
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          options={{
            title: 'Reset Password',
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen name="(tabs)" options={ { headerShown: false} } />
        <Stack.Screen name="AddStockModal" options={{ title: 'Add Stock', presentation: 'modal', headerShown: false,}} />
      </Stack>
    </ThemeProvider>
  );
}