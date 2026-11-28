import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useSettings } from '../../../hooks/useSettings';
import { useAuth } from '../../../hooks/useAuth';
import { SPACING, LAYOUT } from '../../../theme';
import { SETTINGS_GROUPS, THEME_MODE_LABEL } from '../data/settingsGroups';
import SettingsHeader from '../components/SettingsHeader';
import SettingsSectionLabel from '../components/SettingsSectionLabel';
import SettingsRow from '../components/SettingsRow';
import StorageUsageRow from '../components/StorageUsageRow';
import AccountActionsSection from '../components/AccountActionsSection';
import ThemePickerModal from '../components/ThemePickerModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

/**
 * SettingsScreen Component
 *
 * Full Settings screen recreated from the "TripTape Profile & Settings"
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
  const { user } = useAuth();
  const guest = !user || user.isGuest;

  // Settings are for signed-in accounts only; if we end up here signed out
  // (e.g. after deleting the account or logging out), leave.
  useEffect(() => {
    if (guest) navigation.goBack();
  }, [guest, navigation]);

  // Rows that open something. Others (toggles) handle themselves.
  const ROW_ACTIONS = {
    editProfile: () => navigation.navigate('EditProfile'),
    password: () => navigation.navigate('ChangePassword'),
    twofa: () => Alert.alert('Two-factor authentication', 'Coming soon.'),
    theme: () => setShowThemePicker(true),
    help: () => navigation.navigate('HelpCenter'),
    report: () => navigation.navigate('ReportProblem'),
    terms: () => navigation.navigate('Legal'),
    about: () => navigation.navigate('About'),
  };
  const rowPress = (id) => ROW_ACTIONS[id];

  if (guest) return <View style={styles.container} />;

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
                  row={row.id === 'theme' ? { ...row, sub: THEME_MODE_LABEL[mode] } : row}
                  on={!!settings.toggles[row.id]}
                  onToggle={() => toggleSetting(row.id)}
                  onPress={rowPress(row.id)}
                />
              ))}
              {group.title === 'Data & Media' ? <StorageUsageRow /> : null}
            </View>
          </View>
        ))}

        <AccountActionsSection onRequestDeleteAccount={() => setShowDeleteConfirm(true)} />
      </ScrollView>

      <ThemePickerModal visible={showThemePicker} onClose={() => setShowThemePicker(false)} />
      <DeleteAccountModal visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} />
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
