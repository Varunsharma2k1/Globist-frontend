import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Circle, CheckCircle2, Lock } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { reelReward } from '../../wallet/utils/rewards';

/**
 * "Tag an agency" for a reel. Tagging links the reel to one of the
 * traveller's completed trips with that agency and earns a wallet reward —
 * one tagged reel per trip. "No tag" posts freely (unlimited, no reward).
 * Trips that are upcoming or already have a reel are listed but locked, so
 * the rule is visible.
 */
export default function LinkedTripPicker({ bookings, value, onChange }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const option = ({ key, title, subtitle, highlight, selected, locked, lockReason, onPress }) => (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      disabled={locked}
      style={[styles.option, selected && styles.optionSelected, locked && styles.optionLocked]}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: locked }}
    >
      {locked ? (
        <Lock size={18} color={colors.textMuted} />
      ) : selected ? (
        <CheckCircle2 size={18} color={colors.ink} />
      ) : (
        <Circle size={18} color={colors.textMuted} />
      )}
      <View style={styles.optionText}>
        <Text style={styles.optionTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.optionSub, highlight && !locked && styles.earn]}>
          {locked ? lockReason : subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Tag an agency</Text>
      <Text style={styles.help}>
        Link a trip you completed to tag its agency and earn 2% of that booking (up to ₹500). One
        tagged reel per trip.
      </Text>

      {option({
        key: 'none',
        title: 'No agency tag',
        subtitle: 'Post as many untagged reels as you like',
        selected: !value,
        onPress: () => onChange(null),
      })}

      {bookings.map((b) =>
        option({
          key: b._id,
          title: `${b.agency?.name || 'Agency'} · ${b.trip?.title || 'Trip'}`,
          subtitle: `Earn ₹${reelReward(b).toLocaleString('en-IN')}`,
          highlight: true,
          selected: value === b._id,
          locked: b.status !== 'completed' || Boolean(b.reelId),
          lockReason: b.reelId
            ? 'Reel already posted for this trip'
            : 'Unlocks after the trip is completed',
          onPress: () => onChange(b._id),
        })
      )}

      {!bookings.length ? (
        <Text style={styles.help}>Book a trip and complete it to tag its agency here.</Text>
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.md },
    label: { fontFamily: FONTS.semibold, fontSize: 13, color: colors.text },
    help: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
      marginBottom: SPACING.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      padding: SPACING.sm + 4,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.divider,
      marginBottom: SPACING.sm,
    },
    optionSelected: { borderColor: colors.ink, backgroundColor: colors.surfaceMuted },
    optionLocked: { opacity: 0.55 },
    optionText: { flex: 1 },
    optionTitle: { fontFamily: FONTS.semibold, fontSize: 14, color: colors.ink },
    optionSub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    earn: { fontFamily: FONTS.bold, color: colors.success },
  });
}
