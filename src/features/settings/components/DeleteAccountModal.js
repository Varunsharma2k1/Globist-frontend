import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import haptics from '../../../utils/haptics';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { getSharedModalStyles } from './sharedModalStyles';

/**
 * Permanently deletes the account (DELETE /users/me). Asks for the password
 * again (or, for Google sign-ups with no password, typing DELETE) so a phone
 * left unlocked can't be used to wipe someone's account.
 */
export default function DeleteAccountModal({ visible, onClose }) {
  const { colors } = useTheme();
  const modalStyles = getSharedModalStyles(colors);
  const styles = getStyles(colors);
  const { user, deleteAccount } = useAuth();
  const googleOnly =
    user?.hasPassword === false || (user?.authProvider === 'google' && !user?.hasPassword);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ready = googleOnly ? value.trim() === 'DELETE' : value.length > 0;

  const close = () => {
    setValue('');
    setError(null);
    onClose();
  };

  const confirm = async () => {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      await deleteAccount(googleOnly ? { confirm: 'DELETE' } : { password: value });
      haptics.success();
      close();
    } catch (e) {
      haptics.error();
      setError(e.response?.data?.message || 'Could not delete. Check your connection.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView behavior="padding" style={modalStyles.modalBackdrop}>
        <View style={modalStyles.modalCard}>
          <View style={styles.iconCircle}>
            <TriangleAlert size={22} color={colors.error} strokeWidth={2} />
          </View>
          <Text style={modalStyles.modalTitle}>Delete your account?</Text>
          <Text style={modalStyles.modalBody}>
            This permanently deletes your profile, tapes, followers and reviews. Booking records are
            kept for tax purposes. This can&apos;t be undone.
          </Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={googleOnly ? 'Type DELETE to confirm' : 'Enter your password'}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!googleOnly}
            autoCapitalize={googleOnly ? 'characters' : 'none'}
            autoCorrect={false}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={close} disabled={busy}>
              <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.delete, !ready && { opacity: 0.4 }]}
              onPress={confirm}
              disabled={!ready || busy}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.errorBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      alignSelf: 'stretch',
      minHeight: 44,
      paddingHorizontal: SPACING.md,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
      color: colors.text,
      fontFamily: FONTS.body,
      fontSize: 14,
    },
    error: { alignSelf: 'stretch', fontFamily: FONTS.heading, fontSize: 12, color: colors.error },
    actions: { flexDirection: 'row', gap: SPACING.sm + 2, marginTop: 4, alignSelf: 'stretch' },
    btn: {
      flex: 1,
      minHeight: 44,
      borderRadius: RADIUS.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancel: { borderWidth: 1, borderColor: colors.divider },
    delete: { backgroundColor: colors.error },
    btnText: { fontFamily: FONTS.heading, fontSize: 14 },
  });
}
