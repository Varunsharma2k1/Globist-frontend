import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const ROLES = ['traveler', 'creator', 'agency'];

export default function RoleSelector({ value, onChange }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.roleContainer}>
      <Text style={styles.roleLabel}>Account Type</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => {
          const active = value === r;
          return (
            <TouchableOpacity
              key={r}
              style={[styles.roleChip, { backgroundColor: active ? colors.ink : colors.surfaceMuted }]}
              onPress={() => onChange(r)}
            >
              <Text style={[styles.roleText, { color: active ? colors.inkContrast : colors.text }]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    roleContainer: {
      marginBottom: SPACING.md,
    },
    roleLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      marginBottom: SPACING.xs,
      color: colors.text,
    },
    roleRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    roleChip: {
      flex: 1,
      paddingVertical: SPACING.sm + 2,
      borderRadius: RADIUS.pill,
      alignItems: 'center',
    },
    roleText: {
      fontFamily: FONTS.heading,
      fontSize: 11,
    },
  });
}
