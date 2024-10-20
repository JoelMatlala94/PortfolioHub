import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TouchableOpacity, SafeAreaView, View, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Link, router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur'; 
import Colors from '@/constants/Colors';
import { app, auth } from '@/firebaseConfig';

import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track user state
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Monitor Firebase Auth state changes
  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set user state: true if logged in, false if not
      setIsLoading(false); // Stop loading when auth state is determined
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (isLoading || !loaded) {
    // Display a loading screen while fonts and auth state are loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <RootLayoutNav isAuthenticated={isAuthenticated} />;
}

function RootLayoutNav({ isAuthenticated }) {
  const colorScheme = useColorScheme();

  // Redirect based on auth state
  useEffect(() => {
    if (isAuthenticated === true) {
      router.push('/(tabs)/home'); // Navigate to home page if authenticated
    } else if (isAuthenticated === false) {
      router.push('/'); // Navigate to login if not authenticated
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            header: () => (
              <SafeAreaView style={styles.safeArea}>
                <BlurView intensity={1} style={styles.headerBlur}>
                  <TouchableOpacity onPress={router.back} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={34} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
                </BlurView>
              </SafeAreaView>
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: 'transparent' },
            header: () => (
              <SafeAreaView style={styles.safeArea}>
                <BlurView intensity={1} style={styles.headerBlur}>
                  <TouchableOpacity onPress={router.back} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={34} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
                </BlurView>
              </SafeAreaView>
            ),
          }}
        />
        <Stack.Screen 
          name="ResetPasswordScreen" 
          options={{
          title: 'Reset Password',
          headerShown: true,   
          header: () => (
            <SafeAreaView style={styles.safeArea}>
              <BlurView intensity={1} style={styles.headerBlur}>
                <TouchableOpacity onPress={router.back} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={34} color={Colors.light.tabIconDefault} />
                </TouchableOpacity>
              </BlurView>
            </SafeAreaView>
          ),
          }} 
        />
        <Stack.Screen name="help" options={{ title: 'Help', presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = {
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
};