import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS } from '../../../theme';

// Placeholder with the same shape as ExploreTripCard, gently pulsing while
// the trip list loads.
export default function ExploreTripCardSkeleton() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.card, { opacity: pulse }]}>
      <View style={styles.band} />
      <View style={styles.body}>
        <View style={[styles.line, { width: '70%', height: 16 }]} />
        <View style={[styles.line, { width: '35%' }]} />
        <View style={[styles.line, { width: '90%', marginTop: SPACING.sm }]} />
        <View style={[styles.line, { width: '60%' }]} />
      </View>
    </Animated.View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.divider,
      overflow: 'hidden',
      marginBottom: SPACING.md,
    },
    band: {
      height: 190,
      backgroundColor: colors.surfaceMuted,
    },
    body: {
      padding: SPACING.md,
      gap: SPACING.sm,
    },
    line: {
      height: 11,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
  });
}
