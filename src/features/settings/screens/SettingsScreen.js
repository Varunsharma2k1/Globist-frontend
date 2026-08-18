import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useSettings } from '../../../hooks/useSettings';
import { SPACING, LAYOUT } from '../../../theme';
import { SETTINGS_GROUPS, THEME_MODE_LABEL } from '../data/settingsGroups';
import SettingsHeader from '../components/SettingsHeader';
import SettingsSectionLabel from '../components/SettingsSectionLabel';
import SettingsRow from '../components/SettingsRow';
import FeedPreferencesCard from '../components/FeedPreferencesCard';
import StorageUsageRow from '../components/StorageUsageRow';
import AccountActionsSection from '../components/AccountActionsSection';
import ThemePickerModal from '../components/ThemePickerModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

/**
 * SettingsScreen Component
 *
 * Full Settings screen recreated from the "Globist Profile & Settings"
 * design handoff: grouped rows (nav + toggle), a Feed Preferences segmented
 * card, Storage/Cache usage, and Account Actions with a Delete Account
 * confirmation modal. Each section below is its own component (see
 * ../components) — this file is just the layout + the two modals' open state.
 */
export default function SettingsScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = getStyles(colors);
  const { settings, toggleSetting } = useSettings();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  return (
    <View style={styles.container}>
      <SettingsHeader onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {SETTINGS_GROUPS.map((group) => (
          <View key={group.title}>
            <SettingsSectionLabel>{group.title}</SettingsSectionLabel>
            <View style={{ gap: SPACING.sm }}>
              {group.rows.map((row) => (
                <SettingsRow
                  key={row.id}
                  row={
                    row.id === 'theme'
                      ? { ...row, sub: `English · ${THEME_MODE_LABEL[mode]}` }
                      : row
                  }
                  on={!!settings.toggles[row.id]}
                  onToggle={() => toggleSetting(row.id)}
                  onPress={row.id === 'theme' ? () => setShowThemePicker(true) : undefined}
                />
              ))}
            </View>
          </View>
        ))}

        <FeedPreferencesCard />
        <StorageUsageRow />
        <AccountActionsSection onRequestDeleteAccount={() => setShowDeleteConfirm(true)} />
      </ScrollView>

      <ThemePickerModal visible={showThemePicker} onClose={() => setShowThemePicker(false)} />
      <DeleteAccountModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />
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
      paddingBottom: SPACING.xl,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.lg + SPACING.xs,
    },
  });
}
