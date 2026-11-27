import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { useTopInset } from '../../../hooks/useTopInset';

export default function HomeHeader() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const topInset = useTopInset();

  return (
    <View style={[styles.header, { paddingTop: topInset + SPACING.md }]}>
      <View style={styles.headerTextWrap}>
        {/* Large title: bold, tight, centred; quiet subtitle. */}
        <Text style={styles.appName} accessibilityRole="header">
          TripTape
        </Text>
        <Text style={styles.subHeader}>Discover travel</Text>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.sm,
      backgroundColor: colors.background,
    },
    headerTextWrap: {
      alignItems: 'center',
    },
    appName: {
      fontFamily: FONTS.heading,
      fontSize: 34,
      lineHeight: 40,
      letterSpacing: -0.8,
      color: colors.ink,
    },
    subHeader: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 18,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
