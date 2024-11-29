import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useAuth from '@/hooks/useAuth';
import { router } from 'expo-router';

export default function useRootLayoutViewModel() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    if (!isLoading) {
      SplashScreen.hideAsync();
    }
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