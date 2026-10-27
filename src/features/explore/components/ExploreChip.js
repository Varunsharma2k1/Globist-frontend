import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Outlined pill used across Explore's chip rows and filter sheet. `icon`
 * and `trailingIcon` are lucide components, tinted to match the state;
 * `trailing` is any element (e.g. a VerifiedBadge) rendered as-is.
 */
export default function ExploreChip({
  label,
  icon: Icon,
  trailingIcon: Trailing,
  trailing,
  active,
  onPress,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const tint = active ? colors.inkContrast : colors.textMuted;

  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(active) }}
    >
      {Icon ? <Icon size={14} strokeWidth={1.75} color={tint} /> : null}
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
      {Trailing ? <Trailing size={13} strokeWidth={2} color={tint} /> : null}
      {trailing || null}
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: SPACING.md - 2,
      paddingVertical: SPACING.xs + 4,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    chipActive: {
      backgroundColor: colors.ink,
      borderColor: colors.ink,
    },
    text: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
    },
    textActive: {
      color: colors.inkContrast,
    },
  });
}
