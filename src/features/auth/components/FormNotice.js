import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Inline banner for form feedback. `notice` is { type: 'info' | 'error', text }
 * or null (renders nothing).
 */
export default function FormNotice({ notice }) {
  const { colors } = useTheme();
  if (!notice) return null;

  const isError = notice.type === 'error';
  const tone = isError ? colors.error : colors.ink;
  const Icon = isError ? AlertCircle : Info;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isError ? colors.errorBg : colors.surfaceMuted },
      ]}
    >
      <Icon size={18} color={tone} />
      <Text style={[styles.text, { color: isError ? colors.error : colors.text }]}>
        {notice.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  text: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
