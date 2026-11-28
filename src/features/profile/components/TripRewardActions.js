import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Film, Clock } from 'lucide-react-native';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { reelReward } from '../../wallet/utils/rewards';
import { formatDay } from '../../booking/utils/departures';

/**
 * Bottom of a booked trip's card in My Trips — where the trip stands in the
 * reel-reward flow:
 * - upcoming: a tagged tape (and its reward) unlocks the day after the trip
 *   ends, once it can no longer be cancelled;
 * - completed, no reel yet: post a reel tagging the agency to earn;
 * - completed with a reel: the reward was credited.
 */
export default function TripRewardActions({ booking, onPostReel, onDemoComplete }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const reward = `₹${reelReward(booking).toLocaleString('en-IN')}`;

  if (booking.status === 'confirmed') {
    return (
      <View style={styles.wrap}>
        <View style={styles.row}>
          <Clock size={14} color={colors.textMuted} />
          <Text style={styles.note}>
            Returns {formatDay(booking.endDate, { weekday: false })}. The day after, you can post a
            tape from this trip and earn {reward}.
          </Text>
        </View>
        {onDemoComplete ? (
          <TouchableOpacity onPress={onDemoComplete} style={styles.demoLink}>
            <Text style={styles.demoText}>Mark trip as completed (demo)</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  if (booking.reelId) {
    return (
      <View style={[styles.wrap, styles.row]}>
        <CheckCircle2 size={14} color={colors.success} />
        <Text style={[styles.note, { color: colors.success }]}>
          Reel posted · {reward} added to your wallet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Film size={14} color={colors.pastel.peach.fg} />
        <Text style={styles.note}>
          Trip completed! Tag {booking.agency?.name || 'the agency'} in a tape to earn {reward}.
        </Text>
      </View>
      <Button title={`Post tape & earn ${reward}`} onPress={onPostReel} style={styles.btn} />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    wrap: {
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    note: { flex: 1, fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    demoLink: { marginTop: SPACING.xs, alignSelf: 'flex-start', paddingVertical: 4 },
    demoText: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      textDecorationLine: 'underline',
    },
    btn: { marginTop: SPACING.sm, paddingVertical: SPACING.sm + 2 },
  });
}
