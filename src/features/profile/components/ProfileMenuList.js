import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function ProfileMenuList({ items }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.menuCard}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuRow, index < items.length - 1 && styles.menuRowDivider]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <item.icon size={21} color={colors.pastel.peach.fg} strokeWidth={1.8} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    menuCard: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
      overflow: 'hidden',
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 4,
      paddingHorizontal: SPACING.sm + 4,
      paddingVertical: SPACING.md,
    },
    menuRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    menuLabel: {
      flex: 1,
      fontFamily: FONTS.semibold,
      fontSize: 16,
      color: colors.ink,
    },
  });
}
