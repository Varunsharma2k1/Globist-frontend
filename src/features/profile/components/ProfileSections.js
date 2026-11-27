import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const useStyles = () => {
  const { colors } = useTheme();
  return { colors, styles: getStyles(colors) };
};

/** Section heading ("Quick access", "Preferences", …). */
export function SectionTitle({ children }) {
  const { styles } = useStyles();
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

/** 2-column grid of quick-access cards: icon, title, subtitle, chevron. */
export function QuickAccessGrid({ items }) {
  const { colors, styles } = useStyles();
  return (
    <View style={styles.grid}>
      {items.map(({ id, Icon, title, sub, badge, onPress }) => (
        <Pressable
          key={id}
          onPress={onPress}
          style={styles.quick}
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          <View style={styles.quickTop}>
            <View style={styles.iconCircle}>
              <Icon size={18} color={colors.pastel.mountain.fg} />
            </View>
            {badge != null ? <Text style={styles.badge}>{badge}</Text> : null}
          </View>
          <Text style={styles.quickTitle}>{title}</Text>
          <View style={styles.quickBottom}>
            <Text style={styles.quickSub} numberOfLines={2}>
              {sub}
            </Text>
            <View style={styles.chevronCircle}>
              <ChevronRight size={14} color={colors.pastel.mountain.fg} strokeWidth={2.6} />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

/** Grouped list: rows with icon circle, title, subtitle and a chevron. */
export function RowGroup({ rows }) {
  const { colors, styles } = useStyles();
  return (
    <View style={styles.group}>
      {rows.map(({ id, Icon, title, sub, onPress }, i) => (
        <Pressable
          key={id}
          onPress={onPress}
          style={[styles.row, i > 0 && styles.rowDivider]}
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          <View style={styles.iconCircle}>
            <Icon size={18} color={colors.pastel.mountain.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{title}</Text>
            {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  );
}

function getStyles(colors) {
  const dark = colors.mode === 'dark';
  const card = {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    shadowColor: '#17271E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: dark ? 0 : 0.05,
    shadowRadius: 16,
    elevation: dark ? 0 : 1,
  };
  return StyleSheet.create({
    sectionTitle: {
      fontFamily: FONTS.heading,
      fontSize: 18,
      color: colors.ink,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm + 4,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm + 4 },
    quick: { ...card, width: '48%', flexGrow: 1, padding: SPACING.md },
    quickTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    badge: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    quickTitle: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.ink,
      marginTop: SPACING.sm + 4,
    },
    quickBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, marginTop: 2 },
    quickSub: {
      flex: 1,
      fontFamily: FONTS.body,
      fontSize: 12,
      lineHeight: 16,
      color: colors.textMuted,
    },
    chevronCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: dark ? colors.surfaceMuted : colors.pastel.mountain.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: dark ? colors.surfaceMuted : colors.pastel.mountain.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    group: { ...card, paddingHorizontal: SPACING.md },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 4,
      paddingVertical: SPACING.sm + 6,
    },
    rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
    rowTitle: { fontFamily: FONTS.heading, fontSize: 14, color: colors.ink },
    rowSub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  });
}
