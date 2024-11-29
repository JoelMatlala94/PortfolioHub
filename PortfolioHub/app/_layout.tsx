import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import useRootViewModel from '@/hooks/RootLayoutViewModel';
import CustomHeader from '@/components/CustomHeader';

export default function RootLayout() {
  const { isLoading } = useRootViewModel();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
          name="ResetPasswordScreen"
          options={{
            title: 'Reset Password',
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen name="help" options={{ title: 'Help', presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" options={ { headerShown: false} } />
      </Stack>
    </ThemeProvider>
  );
}