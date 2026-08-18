import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOW } from '../theme';

export default function Card({ children, onPress, style }) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
});
