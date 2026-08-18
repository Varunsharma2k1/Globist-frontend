import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING } from '../../../theme';

/**
 * Shared "section title + optional right-side action" row used above both
 * the Featured Regions and Top Handcrafted Packages lists.
 */
export default function SectionHeader({ title, children }) {
  const { typography } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={typography.h3}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
});
