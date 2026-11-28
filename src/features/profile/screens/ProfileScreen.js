import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import {
  UserCircle2,
  Briefcase,
  Heart,
  Clapperboard,
  Wallet,
  UserPen,
  Settings as SettingsIcon,
  LifeBuoy,
  Info,
  LogOut,
} from 'lucide-react-native';
import Button from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { useBookedTripsCount } from '../hooks/useBookedTripsCount';
import { useMyReels } from '../hooks/useMyReels';
import { useAvatarPicker } from '../hooks/useAvatarPicker';
import { useMyFollowCounts } from '../hooks/useMyFollowCounts';
import { SPACING, LAYOUT, FONTS, RADIUS } from '../../../theme';
import { getMenuItems } from '../data/menuItems';
import ProfileHeaderBar from '../components/ProfileHeaderBar';
import ProfileCard from '../components/ProfileCard';
import ProfileStatsCard from '../components/ProfileStatsCard';
import ProfileMenuList from '../components/ProfileMenuList';
import ProfileHero from '../components/ProfileHero';
import { SectionTitle, QuickAccessGrid, RowGroup } from '../components/ProfileSections';

import { APP_VERSION } from '../../settings/data/settingsGroups';

/**
 * ProfileScreen — card layout:
 *   "Profile" title · green greeting card (avatar, Hi <name> 👋, bio, real
 *   Trips / Tapes counts) · Quick access (My trips, Saved, My tapes, Wallet)
 *   · Preferences (Edit profile, Settings) · Support (Help, About) · Log out.
 * Every number is real. Guests see a sign-in prompt; agency accounts keep
 * their management menu.
 */
export default function ProfileScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { user, logout } = useAuth();
  const { wallet } = useTripLedger();
  const tripsCount = useBookedTripsCount();
  const { reels } = useMyReels();
  const avatar = useAvatarPicker();
  const follow = useMyFollowCounts();

  if (user?.isGuest) {
    return (
      <View style={styles.container}>
        <ProfileHeaderBar />
        <View style={styles.guest}>
          <UserCircle2 size={56} color={colors.textMuted} strokeWidth={1.25} />
          <Text style={[typography.h3, { marginTop: SPACING.md }]}>
            You&apos;re browsing as a guest
          </Text>
          <Text style={[typography.body, styles.guestBody]}>
            Sign in to book trips, post reels and earn rewards in your wallet.
          </Text>
          <Button
            title="Sign in"
            onPress={() => navigation.navigate('Auth')}
            style={styles.guestBtn}
          />
        </View>
      </View>
    );
  }

  // Agency accounts keep their management menu (packages, payments, tagged tapes).
  if (user?.role === 'agency') {
    const ledgerCounts = { tripsCount, walletBalance: wallet.balance };
    const menuItems = getMenuItems(navigation, logout, user?.role, user?._id, ledgerCounts);
    return (
      <View style={styles.container}>
        <ProfileHeaderBar onOpenSettings={() => navigation.navigate('Settings')} />
        <ScrollView contentContainerStyle={styles.agencyContent}>
          <ProfileCard user={user} />
          <ProfileStatsCard
            stats={user?.stats}
            role={user?.role}
            userId={user?._id}
            {...ledgerCounts}
          />
          <ProfileMenuList items={menuItems} />
        </ScrollView>
      </View>
    );
  }

  const go = (name, params) => () => navigation.navigate(name, params);

  const confirmLogout = () =>
    Alert.alert('Log out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  const quickAccess = [
    {
      id: 'trips',
      Icon: Briefcase,
      title: 'My trips',
      sub: 'Bookings & invoices',
      badge: tripsCount,
      onPress: go('ProfileTrips', { kind: 'booked' }),
    },
    {
      id: 'saved',
      Icon: Heart,
      title: 'Saved trips',
      sub: 'Trips you ♡ for later',
      onPress: go('ProfileTrips', { kind: 'saved' }),
    },
    {
      id: 'tapes',
      Icon: Clapperboard,
      title: 'My tapes',
      sub: 'Everything you posted',
      badge: reels.length,
      onPress: go('MyReels'),
    },
    {
      id: 'wallet',
      Icon: Wallet,
      title: 'Wallet',
      sub: 'Rewards from your tapes',
      badge: `₹${(wallet.balance || 0).toLocaleString('en-IN')}`,
      onPress: go('Wallet'),
    },
  ];

  const preferences = [
    {
      id: 'edit',
      Icon: UserPen,
      title: 'Edit profile',
      sub: 'Name, bio and home city',
      onPress: go('EditProfile'),
    },
    {
      id: 'settings',
      Icon: SettingsIcon,
      title: 'Settings',
      sub: 'Theme, notifications, devices',
      onPress: go('Settings'),
    },
  ];

  const support = [
    {
      id: 'help',
      Icon: LifeBuoy,
      title: 'Help & support',
      sub: 'FAQs, contact us, report a problem',
      onPress: go('HelpCenter'),
    },
    {
      id: 'about',
      Icon: Info,
      title: 'About TripTape',
      sub: `Version ${APP_VERSION}`,
      onPress: go('About'),
    },
  ];

  return (
    <View style={styles.container}>
      <ProfileHeaderBar onOpenSettings={go('Settings')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHero
          user={user}
          trips={tripsCount}
          tapes={reels.length}
          onPressTrips={go('ProfileTrips', { kind: 'booked' })}
          onPressTapes={go('MyReels')}
          followers={follow.followers}
          following={follow.following}
          onPressFollowers={go('FollowList', { userId: user?._id, kind: 'followers' })}
          onPressFollowing={go('FollowList', { userId: user?._id, kind: 'following' })}
          onPressAvatar={avatar.open}
          avatarUploading={avatar.uploading}
        />

        <SectionTitle>Quick access</SectionTitle>
        <QuickAccessGrid items={quickAccess} />

        <SectionTitle>Preferences</SectionTitle>
        <RowGroup rows={preferences} />

        <SectionTitle>Support</SectionTitle>
        <RowGroup rows={support} />

        <Pressable onPress={confirmLogout} style={styles.logout} accessibilityRole="button">
          <LogOut size={18} color={colors.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.xxl,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    agencyContent: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.lg,
    },
    // Same card shape as the groups above; centred red label, as in iOS Settings.
    logout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.lg,
      minHeight: 56,
      borderRadius: RADIUS.lg,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: colors.mode === 'dark' ? 0 : 0.05,
      shadowRadius: 16,
      elevation: colors.mode === 'dark' ? 0 : 1,
    },
    logoutText: { fontFamily: FONTS.heading, fontSize: 14, color: colors.error },
    guest: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xl,
    },
    guestBody: { textAlign: 'center', marginTop: SPACING.xs, fontFamily: FONTS.body },
    guestBtn: { width: '100%', maxWidth: LAYOUT.contentMaxWidth, marginTop: SPACING.md },
  });
}
