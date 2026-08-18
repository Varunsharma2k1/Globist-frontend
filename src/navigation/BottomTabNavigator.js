import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Home, Compass, Film, Briefcase, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelsScreen from '../screens/ReelsScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  HomeTab: Home,
  ExploreTab: Compass,
  ReelsTab: Film,
  MyTripsTab: Briefcase,
  ProfileTab: User,
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { height: 56 + insets.bottom, paddingBottom: insets.bottom + 6 },
        ],
        tabBarBackground: () => (
          <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill}>
            <View style={styles.tabBarTint} />
          </BlurView>
        ),
        tabBarActiveTintColor: COLORS.ink,
        tabBarInactiveTintColor: COLORS.textMuted,
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
      <Tab.Screen
        name="MyTripsTab"
        component={MyTripsScreen}
        options={{ tabBarLabel: 'My Trips' }}
      />
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
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
