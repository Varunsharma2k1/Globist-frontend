import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function Card({ children, onPress, style }) {
  const { colors, shadow } = useTheme();
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      style={[styles.card, { backgroundColor: colors.surface, ...shadow }, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
});
