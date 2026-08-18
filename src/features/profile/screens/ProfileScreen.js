import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { getMenuItems } from '../data/menuItems';
import ProfileHeaderBar from '../components/ProfileHeaderBar';
import ProfileCard from '../components/ProfileCard';
import ProfileStatsCard from '../components/ProfileStatsCard';
import ProfileMenuList from '../components/ProfileMenuList';

/**
 * ProfileScreen Component
 *
 * Recreated from the "Globist Profile & Settings" design handoff: large
 * left-aligned "Profile" title with a gear icon (→ Settings) top-right, an
 * avatar + name + role-pill card, stats, and a grouped menu list. Each
 * section is its own component (see ../components) — this file is just the
 * layout.
 */
export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user, logout } = useAuth();
  const menuItems = getMenuItems(navigation, logout);

  return (
    <View style={styles.container}>
      <ProfileHeaderBar onOpenSettings={() => navigation.navigate('Settings')} />

      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard user={user} />
        <ProfileStatsCard stats={user?.stats} />
        <ProfileMenuList items={menuItems} />
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
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.lg,
    },
  });
}
