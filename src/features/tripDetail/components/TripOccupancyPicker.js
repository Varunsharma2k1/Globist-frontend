import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { OCCUPANCY_LABELS, OCCUPANCY_HINTS } from '../../../data/occupancy';

/**
 * Room-sharing options as a radio list (cheapest first), each with its
 * per-person price. `compact` renders a tighter version for the booking
 * screen. Renders nothing for trips without room sharing (day walks).
 */
export default function TripOccupancyPicker({ options, value, onChange, compact = false }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  if (!options?.length) return null;
  const cheapest = options[0].pricePerPerson;

  return (
    <View style={styles.section}>
      <Text style={typography.h3}>Room sharing</Text>
      {compact ? null : (
        <Text style={styles.subtitle}>Prices are per person and change with room sharing.</Text>
      )}
      <View style={styles.list}>
        {options.map(({ occupancy, pricePerPerson }) => {
          const active = occupancy === value;
          const extra = pricePerPerson - cheapest;
          return (
            <TouchableOpacity
              key={occupancy}
              style={[styles.row, compact && styles.rowCompact, active && styles.rowActive]}
              onPress={() => onChange(occupancy)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.label}>{OCCUPANCY_LABELS[occupancy] || occupancy}</Text>
                {compact ? null : <Text style={styles.hint}>{OCCUPANCY_HINTS[occupancy]}</Text>}
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.price}>₹{pricePerPerson.toLocaleString()}</Text>
                <Text style={styles.priceNote}>
                  {extra > 0 ? `+₹${extra.toLocaleString()}` : 'Lowest price'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: {
      marginBottom: SPACING.lg,
    },
    subtitle: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    list: {
      marginTop: SPACING.sm + 4,
      gap: SPACING.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 4,
      padding: SPACING.md - 2,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    rowCompact: {
      paddingVertical: SPACING.sm + 2,
    },
    rowActive: {
      borderColor: colors.ink,
      borderWidth: 1.5,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioActive: {
      borderColor: colors.ink,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.ink,
    },
    rowText: {
      flex: 1,
    },
    label: {
      fontFamily: FONTS.semibold,
      fontSize: 15,
      color: colors.ink,
    },
    hint: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 1,
    },
    priceCol: {
      alignItems: 'flex-end',
    },
    price: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: colors.ink,
    },
    priceNote: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 1,
    },
  });
}
