import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
// Same number as the My Trips row, so the two always agree.
import { demoCounts } from '../utils/demoCounts';

// Placeholder audience numbers until followers are real: derived from the
// user's id so they look random but stay the same across renders/launches.
function demoAudience(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  h = Math.abs(h);
  return { followers: 1200 + (h % 8300), following: 60 + (Math.floor(h / 7) % 340) };
}

/**
 * `tripsCount` is the number of trips My Trips lists (useBookedTripsCount);
 * `walletBalance` is the trip ledger's reel + referral rewards.
 */
export default function ProfileStatsCard({ stats, role, userId, tripsCount, walletBalance = 0 }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Agencies show only their audience, not reels / trips / referral earnings.
  if (role === 'agency') {
    const audience = demoAudience(userId);
    const followers = stats?.followers || audience.followers;
    const following = stats?.following || audience.following;
    return (
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{followers.toLocaleString('en-IN')}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{following.toLocaleString('en-IN')}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.statsCard}>
      <View style={styles.statCol}>
        <Text style={styles.statVal}>{stats?.reelsPosted ?? 3}</Text>
        <Text style={styles.statLabel}>Reels Posted</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statVal}>{tripsCount || demoCounts(userId).trips}</Text>
        <Text style={styles.statLabel}>Trips Booked</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statVal}>₹{walletBalance.toLocaleString('en-IN')}</Text>
        <Text style={styles.statLabel}>Wallet</Text>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    statsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.md,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },
    statVal: {
      fontFamily: FONTS.heading,
      fontSize: 20,
      color: colors.ink,
    },
    statLabel: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 4,
    },
  });
}
