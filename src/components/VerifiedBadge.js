import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { FONTS } from '../theme';

/**
 * Blue "verified" tick shown next to a verified agency's name, wherever it
 * appears (Explore cards, trip detail, search, filters). `label` adds the
 * word "Verified" beside the tick for places with room to explain it.
 */
export default function VerifiedBadge({ size = 14, label = false }) {
  const { colors } = useTheme();
  const tick = (
    <BadgeCheck
      size={size}
      color={colors.white}
      fill={colors.verified}
      strokeWidth={2.25}
      accessibilityLabel="Verified agency"
    />
  );
  if (!label) return tick;

  return (
    <View style={styles.row}>
      {tick}
      <Text style={[styles.label, { color: colors.verified }]}>Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
  },
});
