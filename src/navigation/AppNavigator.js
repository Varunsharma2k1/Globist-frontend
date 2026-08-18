import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TripDetailScreen from '../screens/TripDetailScreen';
import RegionDetailScreen from '../screens/RegionDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import PostReelScreen from '../screens/PostReelScreen';
import MenuScreen from '../screens/MenuScreen';
import CreatorProfileScreen from '../screens/CreatorProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="RegionDetail" component={RegionDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="PostReel" component={PostReelScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
    </Stack.Navigator>
  );
}
