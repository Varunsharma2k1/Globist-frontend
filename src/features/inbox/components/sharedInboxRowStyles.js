import { StyleSheet } from 'react-native';
import { SPACING, FONTS, RADIUS } from '../../../theme';

// Shared row-card look reused by NotificationRow, ChatRow, and CommunityRow.
export function getSharedInboxRowStyles(colors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 2,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    iconTile: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: {
      fontFamily: FONTS.body,
      fontSize: 13.5,
      color: colors.text,
      lineHeight: 18,
    },
    rowTime: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },
    chatName: {
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: colors.ink,
      marginBottom: 2,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.ink,
    },
  });
}
