import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExploreTripCard from '../../explore/components/ExploreTripCard';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/** Upcoming departures first, then the other trips the agency organises. */
export default function AgencyTrips({ upcoming, others, onOpenTrip }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  if (!upcoming.length && !others.length) {
    return (
      <View style={styles.section}>
        <Text style={typography.h3}>Trips</Text>
        <Text style={styles.empty}>No trips listed yet.</Text>
      </View>
    );
  }

  const block = (title, list) =>
    list.length ? (
      <View style={styles.section}>
        <Text style={typography.h3}>{title}</Text>
        <View style={styles.list}>
          {list.map((trip, i) => (
            <ExploreTripCard
              key={trip._id}
              trip={trip}
              index={i}
              onPress={() => onOpenTrip(trip)}
            />
          ))}
        </View>
      </View>
    ) : null;

  return (
    <>
      {block('Upcoming trips', upcoming)}
      {block(upcoming.length ? 'Also organises' : 'Trips organised', others)}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.lg },
    list: { marginTop: SPACING.sm, gap: SPACING.md },
    empty: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted, marginTop: SPACING.xs },
  });
}
