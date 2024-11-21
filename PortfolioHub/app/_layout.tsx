import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import useAuth from '@/hooks/useAuth';
import { useColorScheme } from '@/components/useColorScheme';
import * as SplashScreen from 'expo-splash-screen';
import CustomHeader from '@/components/CustomHeader';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  console.log("Theme is:", colorScheme);

  React.useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  React.useEffect(() => {
    if (isAuthenticated === true) {
      router.push('/(tabs)/home');
    } else if (isAuthenticated === false) {
      router.push('/');
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <ThemeProvider value={theme}>
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </NavigationContainer>
  );
}