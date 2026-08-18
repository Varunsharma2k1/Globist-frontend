import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function TripInclusionsList({ description, inclusions }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const list = inclusions || ['Accommodation', 'Transfers', 'Guide', 'Meals'];

  return (
    <>
      <Text style={typography.h3}>Overview</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={[typography.h3, { marginTop: SPACING.md }]}>Package Inclusions</Text>
      <View style={styles.inclusionList}>
        {list.map((inc, i) => (
          <View key={i} style={styles.inclusionRow}>
            <Check size={16} color={colors.success} strokeWidth={2.5} />
            <Text style={styles.inclusionText}>{inc}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    description: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
      marginTop: SPACING.xs,
      marginBottom: SPACING.md,
    },
    inclusionList: {
      marginTop: SPACING.xs,
    },
    inclusionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      marginBottom: SPACING.sm,
    },
    inclusionText: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
    },
  });
}
