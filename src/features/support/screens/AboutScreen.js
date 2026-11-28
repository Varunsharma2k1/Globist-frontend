import React from 'react';
import { View, Text, Image, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import Header from '../../../components/Header';
import { useTheme } from '../../../hooks/useTheme';
import { CONFIG } from '../../../config';
import { APP_VERSION } from '../../settings/data/settingsGroups';
import { SPACING, LAYOUT, FONTS, RADIUS } from '../../../theme';

const ICON = require('../../../../assets/images/icon.png');

/** App icon, tagline, version details and links. */
export default function AboutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const build = Constants.nativeBuildVersion || Constants.expoConfig?.android?.versionCode || '—';
  const env = __DEV__ ? 'Development' : 'Production';

  const rows = [
    ['Version', APP_VERSION],
    ['Build', String(build)],
    ['Platform', `${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${Platform.Version}`],
    ['Environment', env],
    ...(__DEV__ ? [['Server', CONFIG.API_BASE_URL]] : []),
  ];

  return (
    <View style={styles.container}>
      <Header title="About" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xl + insets.bottom }]}
      >
        <View style={styles.hero}>
          <Image source={ICON} style={styles.icon} />
          <Text style={styles.name}>TripTape</Text>
          <Text style={styles.tagline}>Real travel tapes from real trips.</Text>
        </View>

        <View style={styles.card}>
          {rows.map(([k, v], i) => (
            <View key={k} style={[styles.row, i > 0 && styles.divider]}>
              <Text style={styles.k}>{k}</Text>
              <Text style={styles.v} numberOfLines={1}>
                {v}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { marginTop: SPACING.lg }]}>
          {[
            ['Terms of Service', () => navigation.navigate('Legal', { tab: 'terms' })],
            ['Privacy Policy', () => navigation.navigate('Legal', { tab: 'privacy' })],
            ['Help Center', () => navigation.navigate('HelpCenter')],
          ].map(([label, onPress], i) => (
            <Pressable key={label} onPress={onPress} style={[styles.row, i > 0 && styles.divider]}>
              <Text style={[styles.k, { color: colors.ink }]}>{label}</Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>
          Made in India for travellers everywhere.{'\n'}© 2026 TripTape
        </Text>
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    hero: { alignItems: 'center', paddingVertical: SPACING.lg },
    icon: { width: 96, height: 96, borderRadius: 22 },
    name: {
      fontFamily: FONTS.heading,
      fontSize: 28,
      letterSpacing: -0.5,
      color: colors.ink,
      marginTop: SPACING.md,
    },
    tagline: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    card: {
      borderRadius: RADIUS.lg,
      backgroundColor: colors.mode === 'dark' ? colors.surface : colors.surfaceMuted,
      paddingHorizontal: SPACING.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.md,
      minHeight: 48,
    },
    divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
    k: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted },
    v: { flexShrink: 1, fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    footer: {
      fontFamily: FONTS.body,
      fontSize: 12,
      lineHeight: 18,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: SPACING.xl,
    },
  });
}
