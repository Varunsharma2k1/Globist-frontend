import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function TravelerStepper({ value, onAdjust, min, max }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.stepperContainer}>
      <Text style={styles.stepperLabel}>Number of Travellers</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => onAdjust(-1)} disabled={value <= min}>
          <Minus size={16} color={value <= min ? colors.textMuted : colors.ink} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}</Text>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => onAdjust(1)} disabled={value >= max}>
          <Plus size={16} color={value >= max ? colors.textMuted : colors.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    stepperContainer: {
      marginBottom: SPACING.md,
    },
    stepperLabel: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
      marginBottom: SPACING.xs,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.xs,
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.md,
    },
    stepperBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepperValue: {
      fontFamily: FONTS.heading,
      fontSize: 16,
      color: colors.ink,
    },
  });
}
