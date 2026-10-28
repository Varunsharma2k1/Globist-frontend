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
import AgencyProfileScreen from '../screens/AgencyProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileTripsScreen from '../features/profile/screens/ProfileTripsScreen';
import MyReelsScreen from '../features/profile/screens/MyReelsScreen';
import ReelViewerScreen from '../features/profile/screens/ReelViewerScreen';
import AgencyPackagesScreen from '../features/agency/screens/AgencyPackagesScreen';
import CommunitiesScreen from '../features/communities/screens/CommunitiesScreen';
import CommunityDetailScreen from '../features/communities/screens/CommunityDetailScreen';
import PostDetailScreen from '../features/communities/screens/PostDetailScreen';
import PaymentHistoryScreen from '../features/agency/screens/PaymentHistoryScreen';
import InvoiceScreen from '../features/agency/screens/InvoiceScreen';
import AccountTypeModal from '../features/auth/components/AccountTypeModal';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

/**
 * Which screens exist in the navigator is driven entirely by auth state, not
 * by manual navigation calls. React Navigation resets the stack whenever this
 * set of screens changes, so logging in/out swaps the whole reachable screen
 * graph — there is no route path from the auth gate into the app.
 */
export default function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : user ? (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
            <Stack.Screen name="RegionDetail" component={RegionDetailScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="PostReel" component={PostReelScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
            <Stack.Screen name="AgencyProfile" component={AgencyProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ProfileTrips" component={ProfileTripsScreen} />
            <Stack.Screen name="Communities" component={CommunitiesScreen} />
            <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="MyReels" component={MyReelsScreen} />
            <Stack.Screen name="ReelViewer" component={ReelViewerScreen} />
            <Stack.Screen name="AgencyPackages" component={AgencyPackagesScreen} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            <Stack.Screen name="Invoice" component={InvoiceScreen} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ gestureEnabled: false }} />
        )}
      </Stack.Navigator>
      {user?.needsAccountType && <AccountTypeModal />}
    </>
  );
}
