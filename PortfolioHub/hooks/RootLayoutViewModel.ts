import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useAuth from '@/hooks/useAuth';
import { router } from 'expo-router';

export default function useRootLayoutViewModel() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (!isLoading) {
        await SplashScreen.hideAsync();
      }
    };
    SplashScreen.preventAutoHideAsync();
    hideSplashScreen();
  }, [isLoading]);

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace('/(tabs)/home');
    } else if (isAuthenticated === false) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return {
    isLoading,
  };
}