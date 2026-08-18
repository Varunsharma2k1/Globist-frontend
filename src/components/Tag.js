import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../theme';

const PRESETS = {
  default: { bg: COLORS.surfaceMuted, fg: COLORS.text },
  primary: { bg: COLORS.pastel.peach.bg, fg: COLORS.pastel.peach.fg },
  success: { bg: COLORS.successBg, fg: COLORS.success },
};

// variant accepts a preset key above, or a pastel category key
// (mountain / beach / desert / luxury) from COLORS.pastel.
export default function Tag({ label, variant = 'default' }) {
  const tone = PRESETS[variant] || COLORS.pastel[variant] || PRESETS.default;

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
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: '700',
  },
});
