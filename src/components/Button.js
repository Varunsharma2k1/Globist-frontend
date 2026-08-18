import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RADIUS, SPACING, FONTS } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
}) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && { backgroundColor: colors.ink },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.ink },
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.inkContrast : colors.ink} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && { color: colors.inkContrast },
            isOutline && { color: colors.ink },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONTS.heading,
    fontSize: 15,
  },
});
