import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADIUS, SPACING, FONTS } from '../theme';
import { useTheme } from '../hooks/useTheme';

// variant accepts a preset key below, or a pastel category key
// (mountain / beach / desert / luxury) from colors.pastel.
export default function Tag({ label, variant = 'default' }) {
  const { colors } = useTheme();
  const presets = {
    default: { bg: colors.surfaceMuted, fg: colors.text },
    primary: { bg: colors.pastel.peach.bg, fg: colors.pastel.peach.fg },
    success: { bg: colors.successBg, fg: colors.success },
  };
  const tone = presets[variant] || colors.pastel[variant] || presets.default;

  return (
    <View style={[styles.tag, { backgroundColor: tone.bg }]}>
      <Text style={[styles.text, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
});
