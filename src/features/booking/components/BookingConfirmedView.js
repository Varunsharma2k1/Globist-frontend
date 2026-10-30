import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Film } from 'lucide-react-native';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';
import { formatDay, formatDaysNights } from '../utils/departures';
import { reelReward } from '../../wallet/utils/rewards';

/**
 * Shown once "Book now" succeeds: payment successful + trip booked, the
 * booking's key details, and a nudge that a reel tagging the agency after
 * the trip earns wallet credit.
 */
export default function BookingConfirmedView({ booking, onViewTrips, onGoHome }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { trip } = booking;

  const rows = [
    ['Booking ID', booking._id],
    ['Departs', formatDay(booking.startDate)],
    ['Returns', formatDay(booking.endDate)],
    ['Travellers', String(booking.travelersCount)],
    ['Payment ref', booking.paymentRef],
    ...(booking.walletUsed
      ? [
          ['Trip total', `₹${booking.totalPrice.toLocaleString('en-IN')}`],
          ['Paid from wallet', `₹${booking.walletUsed.toLocaleString('en-IN')}`],
        ]
      : []),
    ['Amount paid', `₹${(booking.amountPaid ?? booking.totalPrice).toLocaleString('en-IN')}`],
  ];

  return (
    <View style={styles.container}>
      <Header title="Booking Confirmed" />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: SPACING.xl + insets.bottom }]}
      >
        <View style={styles.icon}>
          <CheckCircle2 size={40} color={colors.success} strokeWidth={1.5} />
        </View>
        <Text style={styles.paid}>Payment successful</Text>
        <Text style={styles.title}>Trip booked successfully!</Text>
        <Text style={styles.trip}>
          {trip?.title} · {formatDaysNights(trip)}
        </Text>
        {booking.referral?.creatorHandle ? (
          <Text style={styles.trip}>Booked via {booking.referral.creatorHandle}&apos;s reel</Text>
        ) : null}

        <Card style={styles.card}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowVal}>{value}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.earn}>
          <Film size={18} color={colors.pastel.peach.fg} />
          <Text style={styles.earnText}>
            After your trip, post a reel tagging {booking.agency?.name || 'the agency'} and earn{' '}
            <Text style={styles.earnStrong}>₹{reelReward(booking).toLocaleString('en-IN')}</Text> in
            your Triptape wallet.
          </Text>
        </View>

        <Button title="View in My Trips" onPress={onViewTrips} style={styles.btn} />
        <Button title="Back to Home" variant="outline" onPress={onGoHome} style={styles.btn} />
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    body: {
      alignItems: 'center',
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    icon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.successBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.lg,
      marginBottom: SPACING.md,
    },
    paid: { fontFamily: FONTS.bold, fontSize: 13, color: colors.success },
    title: { fontFamily: FONTS.heading, fontSize: 22, color: colors.ink, marginTop: 4 },
    trip: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.xs,
      textAlign: 'center',
    },
    card: { width: '100%', marginTop: SPACING.lg },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    rowLabel: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted },
    rowVal: { fontFamily: FONTS.semibold, fontSize: 13, color: colors.ink },
    earn: {
      flexDirection: 'row',
      gap: SPACING.sm,
      width: '100%',
      backgroundColor: colors.pastel.peach.bg,
      borderRadius: 16,
      padding: SPACING.md,
      marginBottom: SPACING.md,
    },
    earnText: { flex: 1, fontFamily: FONTS.body, fontSize: 13, color: colors.pastel.peach.fg },
    earnStrong: { fontFamily: FONTS.heading },
    btn: { width: '100%', marginTop: SPACING.sm },
  });
}
