import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { UserCircle2 } from 'lucide-react-native';
import Button from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { useBookedTripsCount } from '../hooks/useBookedTripsCount';
import { SPACING, LAYOUT, FONTS } from '../../../theme';
import { getMenuItems } from '../data/menuItems';
import ProfileHeaderBar from '../components/ProfileHeaderBar';
import ProfileCard from '../components/ProfileCard';
import ProfileStatsCard from '../components/ProfileStatsCard';
import ProfileMenuList from '../components/ProfileMenuList';

/**
 * ProfileScreen Component
 *
 * Recreated from the "Triptape Profile & Settings" design handoff: large
 * left-aligned "Profile" title with a gear icon (→ Settings) top-right, an
 * avatar + name + role-pill card, stats, and a grouped menu list. Each
 * section is its own component (see ../components) — this file is just the
 * layout. Guests see a sign-in prompt instead.
 */
export default function ProfileScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { user, logout } = useAuth();
  const { wallet } = useTripLedger();
  const tripsCount = useBookedTripsCount();

  if (user?.isGuest) {
    return (
      <View style={styles.container}>
        <ProfileHeaderBar onOpenSettings={() => navigation.navigate('Settings')} />
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

  const ledgerCounts = { tripsCount, walletBalance: wallet.balance };
  const menuItems = getMenuItems(navigation, logout, user?.role, user?._id, ledgerCounts);

  return (
    <View style={styles.container}>
      <ProfileHeaderBar onOpenSettings={() => navigation.navigate('Settings')} />

      <ScrollView contentContainerStyle={styles.content}>
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

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.lg,
    },
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
