import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { TABS } from '../data/inboxData';

export default function InboxHeader({ activeTab, onChangeTab, unreadCountFor }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
      <Text style={styles.headerTitle}>Inbox</Text>
      <View style={styles.tabRow}>
        {TABS.map((t) => {
          const active = activeTab === t.key;
          const unreadCount = unreadCountFor(t.key);
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => onChangeTab(t.key)}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{t.label}</Text>
              {unreadCount > 0 && (
                <View style={[styles.badge, active && styles.badgeActive]}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    header: {
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    headerTitle: {
      fontFamily: FONTS.heading,
      fontSize: 28,
      color: colors.ink,
      marginBottom: SPACING.md,
    },
    tabRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    tabBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs + 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
    tabBtnActive: {
      backgroundColor: colors.ink,
    },
    tabBtnText: {
      fontFamily: FONTS.bold,
      fontSize: 13,
      color: colors.text,
    },
    tabBtnTextActive: {
      color: colors.inkContrast,
    },
    badge: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeActive: {
      backgroundColor: 'rgba(255,255,255,0.25)',
    },
    badgeText: {
      fontFamily: FONTS.bold,
      fontSize: 10,
      color: colors.white,
    },
  });
}
