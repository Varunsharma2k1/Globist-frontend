import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { useTopInset } from '../../../hooks/useTopInset';

export default function ProfileHeaderBar({ onOpenSettings }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const topInset = useTopInset();

  return (
    <View style={[styles.header, { paddingTop: topInset + SPACING.sm }]}>
      <Text style={styles.headerTitle}>Profile</Text>
      {/* No gear for guests: Settings is only for signed-in accounts. */}
      {onOpenSettings ? (
        <TouchableOpacity
          style={styles.gearBtn}
          onPress={onOpenSettings}
          accessibilityLabel="Settings"
        >
          <Settings size={22} color={colors.ink} strokeWidth={1.8} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.sm,
    },
    headerTitle: {
      fontFamily: FONTS.heading,
      fontSize: 28,
      color: colors.ink,
    },
    gearBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
