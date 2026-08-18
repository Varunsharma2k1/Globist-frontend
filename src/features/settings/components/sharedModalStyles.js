import { StyleSheet } from 'react-native';
import { SPACING, FONTS, RADIUS } from '../../../theme';

// Shared centered-modal-card look reused by ThemePickerModal and DeleteAccountModal.
export function getSharedModalStyles(colors) {
  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(20,17,14,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xl,
    },
    modalCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg + 2,
      gap: SPACING.sm + 2,
    },
    modalTitle: {
      fontFamily: FONTS.heading,
      fontSize: 18,
      color: colors.ink,
    },
    modalBody: {
      fontFamily: FONTS.body,
      fontSize: 13.5,
      color: colors.textMuted,
      lineHeight: 19,
    },
  });
}
