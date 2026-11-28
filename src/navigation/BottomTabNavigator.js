import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelsScreen from '../screens/ReelsScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GlassTabBar from './GlassTabBar';
import { withFocusFade } from './FocusFade';

// Created once (not per render) so screens keep their state.
const Home = withFocusFade(HomeScreen);
const Explore = withFocusFade(ExploreScreen);
const Inbox = withFocusFade(InboxScreen);
const Profile = withFocusFade(ProfileScreen);
// Tapes stays instant: video should appear immediately, full-bleed.

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name="ExploreTab"
        component={Explore}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen name="ReelsTab" component={ReelsScreen} options={{ tabBarLabel: 'Tapes' }} />
      <Tab.Screen name="InboxTab" component={Inbox} options={{ tabBarLabel: 'Inbox' }} />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
