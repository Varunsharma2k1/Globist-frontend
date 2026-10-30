import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mountain } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

// Triptape only lists mountain trips (Himachal / Uttarakhand) for now, so
// Mountain is the only vibe offered.
const CATEGORIES = [{ key: 'mountain', icon: Mountain, label: 'Mountain' }];

export default function CategoryPicker({ value, onChange }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      <Text style={styles.sectionLabel}>Category Vibe</Text>
      <View style={styles.typeRow}>
        {CATEGORIES.map((t) => {
          const Icon = t.icon;
          const active = value === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, active && styles.typeCardActive]}
              onPress={() => onChange(t.key)}
            >
              <Icon size={18} color={active ? colors.inkContrast : colors.ink} strokeWidth={1.75} />
              <Text style={[styles.typeText, active && styles.typeTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    sectionLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    typeRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    typeCard: {
      width: 84,
      aspectRatio: 1.15,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    typeCardActive: {
      backgroundColor: colors.ink,
    },
    typeText: {
      fontFamily: FONTS.heading,
      fontSize: 11,
      color: colors.ink,
    },
    typeTextActive: {
      color: colors.inkContrast,
    },
  });
}
