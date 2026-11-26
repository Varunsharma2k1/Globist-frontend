import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RADIUS, SPACING, FONTS } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  loadingTitle,
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
        <View style={styles.loadingRow}>
          <ActivityIndicator color={isPrimary ? colors.inkContrast : colors.ink} />
          {loadingTitle ? (
            <Text style={[styles.text, isPrimary && { color: colors.inkContrast }, isOutline && { color: colors.ink }, textStyle]}>
              {loadingTitle}
            </Text>
          ) : null}
        </View>
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
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  text: {
    fontFamily: FONTS.heading,
    fontSize: 15,
  },
});
