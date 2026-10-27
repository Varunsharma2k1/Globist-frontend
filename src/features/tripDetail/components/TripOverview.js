import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Clock, Gauge, Users, Route, CalendarDays } from 'lucide-react-native';
import VerifiedBadge from '../../../components/VerifiedBadge';
import RatingSummary from '../../../components/RatingSummary';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime()) || date < new Date()) return null;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Title, location, the agency (with blue tick + rating/reviews) and a grid
 * of key facts. Facts the trip doesn't have are simply left out.
 */
export default function TripOverview({ trip }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const agency = trip.agency || {};
  const route =
    trip.startPoint && trip.endPoint ? `${trip.startPoint} → ${trip.endPoint}` : trip.startPoint;
  const groupSize = trip.groupSize?.max ? `${trip.groupSize.min || 1}–${trip.groupSize.max}` : null;

  const facts = [
    { icon: Clock, label: 'Duration', value: trip.duration },
    { icon: Gauge, label: 'Difficulty', value: capitalize(trip.difficulty) },
    { icon: Users, label: 'Group size', value: groupSize },
    { icon: Route, label: 'Start → End', value: route },
    { icon: CalendarDays, label: 'Next departure', value: formatDate(trip.nextSlot) },
  ].filter((f) => f.value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trip.title}</Text>
      {trip.location ? (
        <View style={styles.locationRow}>
          <MapPin size={13} color={colors.textMuted} />
          <Text style={styles.location}>{trip.location}</Text>
        </View>
      ) : null}

      {agency.name ? (
        <View style={styles.agencyRow}>
          <Text style={styles.byLabel}>by</Text>
          <Text style={styles.agencyName} numberOfLines={1}>
            {agency.name}
          </Text>
          {agency.isVerified ? <VerifiedBadge size={15} label /> : null}
          <View style={styles.spacer} />
          <RatingSummary rating={trip.rating} reviewCount={trip.reviewCount} />
        </View>
      ) : null}

      {facts.length ? (
        <View style={styles.facts}>
          {facts.map(({ icon: Icon, label, value }) => (
            <View key={label} style={styles.fact}>
              <Icon size={16} strokeWidth={1.75} color={colors.textMuted} />
              <View style={styles.factText}>
                <Text style={styles.factLabel}>{label}</Text>
                <Text style={styles.factValue} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      marginBottom: SPACING.lg,
    },
    title: {
      fontFamily: FONTS.heading,
      fontSize: 24,
      letterSpacing: -0.4,
      color: colors.ink,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: SPACING.xs,
    },
    location: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
    },
    agencyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.divider,
    },
    byLabel: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    agencyName: {
      flexShrink: 1,
      fontFamily: FONTS.semibold,
      fontSize: 14,
      color: colors.ink,
    },
    spacer: {
      flex: 1,
    },
    facts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: SPACING.md,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
      padding: SPACING.sm,
    },
    fact: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      padding: SPACING.sm,
    },
    factText: {
      flex: 1,
    },
    factLabel: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
    },
    factValue: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.ink,
      marginTop: 1,
    },
  });
}
