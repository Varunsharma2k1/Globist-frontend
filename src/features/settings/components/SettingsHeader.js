import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function SettingsHeader({ onBack }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
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
      fontSize: 20,
      color: colors.ink,
    },
  });
}
