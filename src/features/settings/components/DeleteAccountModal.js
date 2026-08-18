import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, RADIUS } from '../../../theme';
import { getSharedModalStyles } from './sharedModalStyles';

/**
 * Delete-account confirmation. Note: "Delete" is a stub (just closes the
 * modal) — there's no real account-deletion API wired up yet, matching the
 * original screen's behavior.
 */
export default function DeleteAccountModal({ visible, onClose }) {
  const { colors } = useTheme();
  const modalStyles = getSharedModalStyles(colors);
  const styles = getStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.modalCard}>
          <View style={styles.modalIconCircle}>
            <TriangleAlert size={22} color="#C0392B" strokeWidth={2} />
          </View>
          <Text style={modalStyles.modalTitle}>Delete Account?</Text>
          <Text style={modalStyles.modalBody}>
            This permanently deletes your Globist account, trips, and reels. This action
            can&apos;t be undone.
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalBtn, styles.modalCancelBtn]} onPress={onClose}>
              <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.modalDeleteBtn]} onPress={onClose}>
              <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    modalIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F6E1DE',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: SPACING.sm + 2,
      marginTop: 4,
    },
    modalBtn: {
      flex: 1,
      borderRadius: RADIUS.pill,
      paddingVertical: SPACING.sm + 4,
      alignItems: 'center',
    },
    modalCancelBtn: {
      borderWidth: 1,
      borderColor: colors.divider,
    },
    modalDeleteBtn: {
      backgroundColor: '#C0392B',
    },
    modalBtnText: {
      fontFamily: FONTS.bold,
      fontSize: 14,
    },
  });
}
