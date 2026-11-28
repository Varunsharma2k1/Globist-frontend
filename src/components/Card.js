import React from 'react';
import { View, StyleSheet } from 'react-native';
import PressableScale from './PressableScale';
import { RADIUS, SPACING } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function Card({ children, onPress, style }) {
  const { colors, shadow } = useTheme();
  const Component = onPress ? PressableScale : View;
  return (
    <Component
      style={[styles.card, { backgroundColor: colors.surface, ...shadow }, style]}
      onPress={onPress}
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
