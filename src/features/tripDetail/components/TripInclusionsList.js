import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/**
 * Overview text plus Highlights / Inclusions / Exclusions lists. Each block
 * only renders when the trip has data for it.
 */
export default function TripInclusionsList({ description, highlights, inclusions, exclusions }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  const List = ({ title, items, icon: Icon, tint }) =>
    items?.length ? (
      <View style={styles.block}>
        <Text style={typography.h3}>{title}</Text>
        <View style={styles.list}>
          {items.map((text) => (
            <View key={text} style={styles.row}>
              <Icon size={16} color={tint} strokeWidth={2.25} style={styles.icon} />
              <Text style={styles.rowText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>
    ) : null;

  return (
    <>
      {description ? (
        <View style={styles.block}>
          <Text style={typography.h3}>Overview</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      ) : null}
      <List title="Highlights" items={highlights} icon={Sparkles} tint={colors.ink} />
      <List title="What's included" items={inclusions} icon={Check} tint={colors.success} />
      <List title="Not included" items={exclusions} icon={X} tint={colors.error} />
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    block: {
      marginBottom: SPACING.lg,
    },
    description: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
      marginTop: SPACING.xs,
    },
    list: {
      marginTop: SPACING.sm,
      gap: SPACING.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.sm,
    },
    icon: {
      marginTop: 2,
    },
    rowText: {
      flex: 1,
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
  });
}
