import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { reelReward } from '../../wallet/utils/rewards';

/**
 * Read-only "this tape is for your trip" card, shown only when posting from
 * a booked trip (My Trips / invoice). The agency comes from the booking and
 * can't be changed — the tape will appear on that agency's profile.
 */
export default function TaggedTripCard({ booking }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const agency = booking.agency?.name || 'the agency';
  const reward = reelReward(booking);

  return (
    <View style={styles.card}>
      <BadgeCheck size={20} color={colors.success} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {booking.trip?.title || 'Your trip'}
        </Text>
        <Text style={styles.sub}>
          Tagged with {agency} · shows on their profile
          {reward ? ` · earns ₹${reward.toLocaleString('en-IN')}` : ''}
        </Text>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      backgroundColor: colors.successBg,
      marginBottom: SPACING.md,
    },
    title: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    sub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  });
}
