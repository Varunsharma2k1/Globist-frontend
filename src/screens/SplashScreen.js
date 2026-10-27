import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe } from 'lucide-react-native';
import { SPACING, FONTS } from '../theme';
import { useTheme } from '../hooks/useTheme';

/**
 * SplashScreen Component
 *
 * Shown only while AuthContext is resolving the stored session on launch.
 * Purely a loading state — where the user lands next (MainTabs vs Auth) is
 * decided by AppNavigator once that check resolves, not by anything here.
 */
export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: SPACING.xl + insets.top,
          paddingBottom: SPACING.xl + insets.bottom,
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.iconCircle, { backgroundColor: colors.pastel.peach.bg }]}>
          <Globe size={44} color={colors.pastel.peach.fg} strokeWidth={1.5} />
        </View>
        <Text style={[styles.wordmark, { color: colors.ink }]}>TRIPTAPE</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Curated Travel & Community Reels
        </Text>
        <ActivityIndicator color={colors.ink} style={{ marginTop: SPACING.xl }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  wordmark: {
    fontFamily: FONTS.heading,
    fontSize: 30,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
