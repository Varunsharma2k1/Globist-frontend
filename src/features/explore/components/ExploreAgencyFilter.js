import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExploreChip from './ExploreChip';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/**
 * "Agency" section of the filter sheet: a Verified-only toggle (the quick
 * way to filter by trust) plus multi-select chips for each agency running
 * one of the trips in view, verified ones first.
 */
export default function ExploreAgencyFilter({
  options,
  selected,
  verifiedOnly,
  onToggleAgency,
  onToggleVerified,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      <View style={styles.options}>
        <ExploreChip
          label="Verified agencies only"
          trailing={<VerifiedBadge size={14} />}
          active={verifiedOnly}
          onPress={onToggleVerified}
        />
      </View>
      {options.length ? (
        <>
          <Text style={styles.subLabel}>Or pick agencies you trust</Text>
          <View style={styles.options}>
            {options.map(({ id, agency, count }) => (
              <ExploreChip
                key={id}
                label={`${agency.name} · ${count}`}
                trailing={agency.isVerified ? <VerifiedBadge size={13} /> : null}
                active={selected.includes(id)}
                onPress={() => onToggleAgency(id)}
              />
            ))}
          </View>
        </>
      ) : null}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.xs + 2,
    },
    subLabel: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },
  });
}
