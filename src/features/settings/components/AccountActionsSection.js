import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRoundPlus, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { getSharedRowStyles } from './sharedRowStyles';
import SettingsSectionLabel from './SettingsSectionLabel';

export default function AccountActionsSection({ onRequestDeleteAccount }) {
  const { colors } = useTheme();
  const rowStyles = getSharedRowStyles(colors);
  const styles = getStyles(colors);
  const { user, logout } = useAuth();

  // Guests have no account to log out of or delete.
  if (user?.isGuest) return null;

  return (
    <View>
      <SettingsSectionLabel>Account Actions</SettingsSectionLabel>
      <View style={{ gap: SPACING.sm }}>
        <View style={rowStyles.row}>
          <UserRoundPlus size={19} color={colors.text} strokeWidth={2} />
          <Text style={[rowStyles.rowLabel, { flex: 1 }]}>Add Account / Switch Account</Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={logout}>
          <Text style={styles.actionBtnText}>Log Out</Text>
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
      fontSize: 15,
      color: colors.ink,
    },
  });
}
