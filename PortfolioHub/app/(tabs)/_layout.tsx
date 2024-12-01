import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { HapticTab } from '@/components/HapticTab';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { currentThemeAttributes } = useTheme();

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: currentThemeAttributes.tintColor,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: currentThemeAttributes.backgroundColor, //Match theme
            borderTopColor: 'transparent', // Remove tab bar border
            elevation: 0, // Remove shadow on Android
          },
          tabBarIconStyle: { justifyContent: 'center', alignItems: 'center' },
          tabBarButton: HapticTab,
          headerStyle: { 
            backgroundColor: currentThemeAttributes.backgroundColor,
          }, 
          headerTintColor: currentThemeAttributes.textColor, 
          headerTitleStyle: { 
            color: currentThemeAttributes.textColor,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: 'Portfolio',
            tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
            headerRight: () => (
              <Link href="/AddStockModal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name='plus-circle'
                      size={25}
                      color={currentThemeAttributes.textShadowColor}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          }}
        />
      </Tabs>
  );
}