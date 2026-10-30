import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TripDetailScreen from '../screens/TripDetailScreen';
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
import WalletScreen from '../features/wallet/screens/WalletScreen';
import AccountTypeModal from '../features/auth/components/AccountTypeModal';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

/**
 * The app opens straight into the tabs — there is no sign-in gate. Without
 * a session the user is a guest (`user.isGuest`, see AuthContext), and
 * actions that need an account (booking, posting a reel) open the "Auth"
 * sign-in sheet instead (see useRequireAuth). Signing in or out keeps the
 * same screen set, so the user stays where they were.
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
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
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
            <Stack.Screen name="Wallet" component={WalletScreen} />
            {/* Sign-in sheet for guests (see useRequireAuth). */}
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
      {user?.needsAccountType && <AccountTypeModal />}
    </>
  );
}
