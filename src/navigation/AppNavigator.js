import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import EditProfileScreen from '../features/profile/screens/EditProfileScreen';
import FollowListScreen from '../features/profile/screens/FollowListScreen';
import ChangePasswordScreen from '../features/settings/screens/ChangePasswordScreen';
import HelpCenterScreen from '../features/support/screens/HelpCenterScreen';
import ReportProblemScreen from '../features/support/screens/ReportProblemScreen';
import LegalScreen from '../features/support/screens/LegalScreen';
import AboutScreen from '../features/support/screens/AboutScreen';
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
import ChatThreadScreen from '../features/chat/screens/ChatThreadScreen';
import IndiaMapScreen from '../features/indiaMap/screens/IndiaMapScreen';
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
            <Stack.Screen name="IndiaMap" component={IndiaMapScreen} />
            <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="FollowList" component={FollowListScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
            <Stack.Screen name="Legal" component={LegalScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            {/* Sign-in sheet for guests (see useRequireAuth). */}
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
      {user?.needsAccountType && <AccountTypeModal />}
    </>
  );
}
