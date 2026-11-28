import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserRoundPlus, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { getSharedRowStyles } from './sharedRowStyles';
import SettingsSectionLabel from './SettingsSectionLabel';

export default function AccountActionsSection({ onRequestDeleteAccount }) {
  const { colors } = useTheme();
  const rowStyles = getSharedRowStyles(colors);
  const styles = getStyles(colors);
  const { user, logout, logoutAllDevices } = useAuth();
  const navigation = useNavigation();

  // One account per phone for now: switching = sign out, then sign in as someone else.
  const switchAccount = () =>
    Alert.alert(
      'Add or switch account',
      `You'll be signed out of ${user?.name || 'this account'} and can sign in with another one.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            await logout();
            navigation.navigate('Auth');
          },
        },
      ]
    );

  const confirmLogoutAll = () =>
    Alert.alert(
      'Log out of all devices?',
      "You'll be signed out everywhere, including this phone. Use this if you lost a device or think someone else is using your account.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out everywhere',
          style: 'destructive',
          onPress: () =>
            logoutAllDevices().catch(() =>
              Alert.alert('Could not reach the server', 'Check your connection and try again.')
            ),
        },
      ]
    );

  // Guests have no account to log out of or delete.
  if (user?.isGuest) return null;

  return (
    <View>
      <SettingsSectionLabel>Account Actions</SettingsSectionLabel>
      <View style={{ gap: SPACING.sm }}>
        <TouchableOpacity style={rowStyles.row} onPress={switchAccount} activeOpacity={0.7}>
          <UserRoundPlus size={19} color={colors.text} strokeWidth={2} />
          <Text style={[rowStyles.rowLabel, { flex: 1 }]}>Add or Switch Account</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={logout}>
          <Text style={styles.actionBtnText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={confirmLogoutAll}>
          <Text style={styles.actionBtnText}>Log Out of All Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onRequestDeleteAccount}>
          <Text style={[styles.actionBtnText, { color: '#C0392B' }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    actionBtn: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.sm + 6,
      alignItems: 'center',
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    actionBtnText: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: colors.ink,
    },
  });
}
