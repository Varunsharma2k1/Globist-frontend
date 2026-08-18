import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe } from 'lucide-react-native';
import Button from '../components/Button';
import { COLORS, SPACING, FONTS, LAYOUT } from '../theme';

export default function SplashScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: SPACING.xl + insets.top, paddingBottom: SPACING.xl + insets.bottom },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Globe size={44} color={COLORS.pastel.peach.fg} strokeWidth={1.5} />
        </View>
        <Text style={styles.wordmark}>GLOBIST</Text>
        <Text style={styles.subtitle}>Curated Travel & Community Reels</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Explore Destinations"
          onPress={() => navigation.navigate('MainTabs')}
          style={{ marginBottom: SPACING.md }}
        />
        <Button
          title="Sign In / Register"
          variant="outline"
          onPress={() => navigation.navigate('Auth')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    padding: SPACING.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.pastel.peach.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  wordmark: {
    fontFamily: FONTS.heading,
    fontSize: 30,
    letterSpacing: 2,
    color: COLORS.ink,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
});
