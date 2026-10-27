import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Film } from 'lucide-react-native';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function BookingSummaryCard({ trip, pricePerPerson, referralHandle }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  return (
    <Card style={styles.summaryCard}>
      <Text style={typography.h3}>{trip?.title || 'Spiti Expedition'}</Text>
      <View style={styles.summaryLocRow}>
        <MapPin size={12} color={colors.textMuted} />
        <Text style={styles.summaryLoc}>{trip?.location || 'Himachal Pradesh'}</Text>
      </View>
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
    summaryLocRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
      marginBottom: SPACING.xs,
    },
    summaryLoc: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    summaryPrice: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
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
