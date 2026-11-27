import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { useTopInset } from '../../../hooks/useTopInset';

export default function SettingsHeader({ onBack }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const topInset = useTopInset();

  return (
    <View style={[styles.header, { paddingTop: topInset + SPACING.sm }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <ArrowLeft size={20} color={colors.ink} strokeWidth={2.2} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    header: {
      paddingBottom: SPACING.sm + 2,
      paddingHorizontal: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backBtn: {
      position: 'absolute',
      left: SPACING.md,
      bottom: SPACING.sm + 2,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: FONTS.heading,
      fontSize: 18,
      color: colors.ink,
    },
  });
}
