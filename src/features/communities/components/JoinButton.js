import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/** Join / Joined pill. `compact` is the smaller version used on cards. */
export default function JoinButton({ joined, onPress, compact }) {
  const { colors } = useTheme();
  const Icon = joined ? Check : Plus;
  const fg = joined ? colors.ink : colors.inkContrast;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={joined ? 'Leave community' : 'Join community'}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        joined
          ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.ink }
          : { backgroundColor: colors.ink },
        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
      ]}
    >
      <Icon size={compact ? 13 : 15} color={fg} strokeWidth={2.4} />
      <Text style={[styles.text, compact && styles.textCompact, { color: fg }]}>
        {joined ? 'Joined' : 'Join'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
  },
  compact: { paddingHorizontal: SPACING.md, paddingVertical: 6 },
  text: { fontFamily: FONTS.heading, fontSize: 14 },
  textCompact: { fontSize: 12 },
});
