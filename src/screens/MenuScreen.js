import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Film, Compass, Briefcase, Video, Phone, Lock, ChevronRight } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import { SPACING, FONTS, LAYOUT } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function MenuScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const menuItems = [
    { icon: Film, title: 'Explore Reels Feed', action: () => navigation.navigate('Reels') },
    { icon: Compass, title: 'Discover Destinations', action: () => navigation.navigate('Explore') },
    { icon: Briefcase, title: 'My Booked Trips', action: () => navigation.navigate('MyTrips') },
    { icon: Video, title: 'Post a Travel Reel', action: () => navigation.navigate('PostReel') },
    { icon: Phone, title: 'Customer Support & FAQ', action: () => {} },
    { icon: Lock, title: 'Privacy Policy & Terms', action: () => {} },
  ];

  return (
    <View style={styles.container}>
      <Header title="Settings & Menu" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}>
        <Text style={[typography.h3, { marginBottom: SPACING.md }]}>App Navigation</Text>

        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} style={styles.menuRow} onPress={item.action}>
              <View style={styles.menuLeft}>
                <Icon size={18} color={colors.ink} strokeWidth={1.75} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </Card>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.versionText}>Globist Mobile v1.0.0 (Production Ready)</Text>
          <Text style={styles.platformText}>iOS & Android Build • Powered by Expo & Node.js</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  itemTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: colors.ink,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: colors.textMuted,
  },
  platformText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  });
}
