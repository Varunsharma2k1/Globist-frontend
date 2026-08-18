import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function HomeHeader() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
      <View style={styles.headerTextWrap}>
        <Text style={styles.appName}>GLOBIST</Text>
        <Text style={styles.subHeader}>Discover Authentic Travel</Text>
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
      paddingBottom: SPACING.md,
      backgroundColor: colors.background,
      borderBottomWidth: 2,
      borderBottomColor: colors.divider,
    },
    headerTextWrap: {
      alignItems: 'center',
    },
    appName: {
      fontFamily: FONTS.heading,
      fontSize: 22,
      color: colors.ink,
      letterSpacing: 1,
    },
    subHeader: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
