import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function ProfileStatsCard({ stats }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.statsCard}>
      <View style={styles.statCol}>
        <Text style={styles.statVal}>{stats?.reelsPosted ?? 3}</Text>
        <Text style={styles.statLabel}>Reels Posted</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statVal}>{stats?.tripsBooked ?? 2}</Text>
        <Text style={styles.statLabel}>Trips Booked</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statVal}>₹{(stats?.earnings ?? 1450).toLocaleString()}</Text>
        <Text style={styles.statLabel}>Referral Bonus</Text>
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
