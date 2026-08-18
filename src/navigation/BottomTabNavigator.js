import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Home, Compass, Film, Inbox, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelsScreen from '../screens/ReelsScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  HomeTab: Home,
  ExploreTab: Compass,
  ReelsTab: Film,
  InboxTab: Inbox,
  ProfileTab: User,
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, resolvedScheme } = useTheme();
  const isDark = resolvedScheme === 'dark';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? 'rgba(28,26,24,0.94)' : 'rgba(255,255,255,0.94)',
            borderTopColor: colors.divider,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom + 6,
          },
        ],
        tabBarBackground: () => (
          <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
            <View
              style={[
                styles.tabBarTint,
                { backgroundColor: isDark ? 'rgba(28,26,24,0.85)' : 'rgba(255,255,255,0.85)' },
              ]}
            />
          </BlurView>
        ),
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color }) => {
          const Icon = TAB_ICONS[route.name] || Home;
          return <Icon size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.25 : 1.75} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen name="ReelsTab" component={ReelsScreen} options={{ tabBarLabel: 'Reels' }} />
      <Tab.Screen name="InboxTab" component={InboxScreen} options={{ tabBarLabel: 'Inbox' }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
