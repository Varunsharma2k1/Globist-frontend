import { StyleSheet } from 'react-native';
import { SPACING, FONTS, RADIUS } from '../../theme';

export function getStyles(colors) {
  const dark = colors.mode === 'dark';
  // Soft, neutral bubbles (WhatsApp / iMessage feel): mine = quiet blue-grey tint,
  // theirs = plain grey. Dark text on light, light text on dark; no black blocks.
  const mineBg = dark ? '#33475B' : '#DCE6F0';
  const theirsBg = dark ? '#2C2C2E' : '#F2F2F7';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    subtitle: {
      textAlign: 'center',
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      paddingVertical: 4,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
    empty: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
    list: { padding: SPACING.md, flexGrow: 1 },
    day: {
      alignSelf: 'center',
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: colors.textMuted,
      marginVertical: SPACING.sm,
    },
    bubbleRow: { flexDirection: 'row', marginTop: SPACING.xs },
    rowMine: { justifyContent: 'flex-end' },
    rowTheirs: { justifyContent: 'flex-start' },
    bubble: {
      maxWidth: '78%',
      paddingHorizontal: SPACING.md - 2,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.md,
    },
    bubbleMine: { backgroundColor: mineBg, borderBottomRightRadius: 6 },
    bubbleTheirs: { backgroundColor: theirsBg, borderBottomLeftRadius: 6 },
    msgText: { fontFamily: FONTS.body, fontSize: 14, lineHeight: 20, color: colors.ink },
    msgTextMine: {},
    meta: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
      marginHorizontal: 4,
    },
    metaMine: { textAlign: 'right' },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.sm + 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      maxHeight: 120,
      minHeight: 44,
      paddingHorizontal: SPACING.md,
      paddingTop: 12,
      paddingBottom: 12,
      borderRadius: 22,
      backgroundColor: colors.surfaceMuted,
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: mineBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
