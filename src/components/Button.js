import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[styles.button, isPrimary && styles.primaryBtn, isOutline && styles.outlineBtn, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.ink} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.primaryText,
            isOutline && styles.outlineText,
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
  primaryBtn: {
    backgroundColor: COLORS.ink,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.ink,
  },
  text: {
    fontFamily: FONTS.heading,
    fontSize: 15,
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.ink,
  },
});
