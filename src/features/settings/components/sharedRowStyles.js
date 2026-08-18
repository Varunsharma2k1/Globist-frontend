import { StyleSheet } from 'react-native';
import { SPACING, FONTS, RADIUS } from '../../../theme';

// Shared "card row" look reused by SectionLabel, SettingsRow,
// StorageUsageRow, and AccountActionsSection — kept in one place so those
// four don't each redefine the same tokens slightly differently.
export function getSharedRowStyles(colors) {
  return StyleSheet.create({
    sectionTitle: {
      fontFamily: FONTS.bold,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textMuted,
      marginBottom: SPACING.sm + 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 2,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 4,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    rowText: {
      flex: 1,
      minWidth: 0,
    },
    rowLabel: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: colors.ink,
    },
    rowSub: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
