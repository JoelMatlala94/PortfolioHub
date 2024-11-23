import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import * as SplashScreen from 'expo-splash-screen';
import useAuth from '@/hooks/useAuth';
import { router } from 'expo-router';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export default function useRootLayoutViewModel() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(DefaultTheme);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
  }, [colorScheme]);

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace('/(tabs)/home');
    } else if (isAuthenticated === false) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return {
    isLoading,
    theme,
  };
}