import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Film, Clock } from 'lucide-react-native';
import Card from '../../../components/Card';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { formatDaysNights } from '../utils/departures';

/**
 * Top of the booking page: the trip, its length in days / nights, the agency
 * running it (with the blue tick when verified, as on the trip page), the
 * per-person price and the reel it was booked through, if any.
 */
export default function BookingSummaryCard({ trip, pricePerPerson, referralHandle }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const agency = trip?.agency;

  return (
    <Card style={styles.summaryCard}>
      <Text style={typography.h3}>{trip?.title || 'Spiti Expedition'}</Text>
      <View style={styles.metaRow}>
        <View style={styles.daysPill}>
          <Clock size={12} color={colors.ink} />
          <Text style={styles.daysText}>{formatDaysNights(trip)}</Text>
        </View>
        <MapPin size={12} color={colors.textMuted} />
        <Text style={styles.summaryLoc} numberOfLines={1}>
          {trip?.location || 'Himachal Pradesh'}
        </Text>
      </View>
      {agency?.name ? (
        <View style={styles.agencyRow}>
          <Text style={styles.byLabel}>by</Text>
          <Text style={styles.agencyName} numberOfLines={1}>
            {agency.name}
          </Text>
          {agency.isVerified ? <VerifiedBadge size={15} label /> : null}
        </View>
      ) : null}
      <Text style={styles.summaryPrice}>₹{pricePerPerson.toLocaleString()} / person</Text>
      {referralHandle ? (
        <View style={styles.referralRow}>
          <Film size={12} color={colors.textMuted} />
          <Text style={styles.referralText}>Booking via {referralHandle}&apos;s reel</Text>
        </View>
      ) : null}
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    summaryCard: {
      marginBottom: SPACING.lg,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: SPACING.xs,
    },
    daysPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 999,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      marginRight: SPACING.xs,
    },
    daysText: {
      fontFamily: FONTS.bold,
      fontSize: 12,
      color: colors.ink,
    },
    summaryLoc: {
      flexShrink: 1,
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    agencyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: SPACING.sm,
    },
    byLabel: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    agencyName: {
      flexShrink: 1,
      fontFamily: FONTS.bold,
      fontSize: 14,
      color: colors.ink,
    },
    summaryPrice: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
      marginTop: SPACING.sm,
    },
    referralRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: SPACING.sm,
    },
    referralText: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
    },
  });
}
