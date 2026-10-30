import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT, FONTS } from '../../../theme';
import { useBookingForm } from '../hooks/useBookingForm';
import BookingSummaryCard from '../components/BookingSummaryCard';
import TravelerStepper from '../components/TravelerStepper';
import DepartureCalendar from '../components/DepartureCalendar';
import WalletRedeemCard from '../components/WalletRedeemCard';
import PriceBreakdownCard from '../components/PriceBreakdownCard';
import BookingBottomBar from '../components/BookingBottomBar';
import BookingConfirmedView from '../components/BookingConfirmedView';
import TripOccupancyPicker from '../../tripDetail/components/TripOccupancyPicker';
import { OCCUPANCY_LABELS } from '../../../data/occupancy';
import { formatDay, formatDaysNights } from '../utils/departures';

/**
 * BookingScreen Component
 *
 * Checkout interface for reserving travel packages: pick one of the
 * agency's fixed departures on a calendar, travellers and room sharing,
 * then "Book now" (payment is simulated for now). Form state, pricing,
 * and submission live in useBookingForm; each visual section is its own
 * component (see ../components) — this file is just the layout + the
 * confirmed/unconfirmed branch.
 */
export default function BookingScreen({ route, navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { trip, referral, occupancy } = route.params || {};

  const form = useBookingForm(trip, referral, occupancy);

  if (form.confirmedBooking) {
    return (
      <BookingConfirmedView
        booking={form.confirmedBooking}
        onViewTrips={() =>
          navigation.reset({
            index: 1,
            routes: [{ name: 'MainTabs' }, { name: 'ProfileTrips', params: { kind: 'booked' } }],
          })
        }
        onGoHome={() => navigation.navigate('MainTabs')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Confirm Booking" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}>
        <BookingSummaryCard
          trip={trip}
          pricePerPerson={form.pricePerPerson}
          referralHandle={referral?.creatorHandle}
        />

        <TripOccupancyPicker
          options={trip?.occupancyPricing}
          value={form.occupancy}
          onChange={form.setOccupancy}
          compact
        />

        <Text style={typography.h3}>Choose your departure</Text>
        <Text style={styles.hint}>
          {trip?.agency?.name || 'The agency'} runs this trip on fixed start dates. Pick one below.
        </Text>
        <DepartureCalendar
          dates={form.departures}
          value={form.date}
          onChange={form.setDate}
          tripDays={form.tripDays}
          intervalDays={form.intervalDays}
        />
        {form.date ? (
          <View style={styles.datesRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Departs</Text>
              <Text style={styles.dateVal}>{formatDay(form.date)}</Text>
            </View>
            <View style={[styles.dateCol, styles.returnCol]}>
              <Text style={[styles.dateLabel, styles.returnText]}>Returns</Text>
              <Text style={[styles.dateVal, styles.returnText]}>{formatDay(form.endDate)}</Text>
            </View>
          </View>
        ) : null}
        {form.date ? (
          <Text style={styles.tripLength}>
            {formatDaysNights(trip)} · {form.tripDays} day{form.tripDays > 1 ? 's' : ''} on the trip
          </Text>
        ) : null}
        {form.error ? <Text style={styles.error}>{form.error}</Text> : null}

        <Text style={typography.h3}>Booking Details</Text>
        <View style={{ marginTop: SPACING.sm }}>
          <TravelerStepper
            value={form.travelers}
            onAdjust={form.adjustTravelers}
            min={form.minTravelers}
            max={form.maxTravelers}
          />

          <Input
            label="Contact Phone"
            value={form.phone}
            onChangeText={form.setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
          />
        </View>

        <WalletRedeemCard
          balance={form.walletBalance}
          enabled={form.useWallet}
          onToggle={form.setUseWallet}
          applied={form.walletUsed}
        />

        <PriceBreakdownCard
          travelers={form.travelers}
          pricePerPerson={form.pricePerPerson}
          occupancyLabel={form.occupancy ? OCCUPANCY_LABELS[form.occupancy] : null}
          subtotal={form.subtotal}
          serviceFee={form.serviceFee}
          totalPrice={form.totalPrice}
          walletUsed={form.walletUsed}
          amountToPay={form.amountToPay}
        />
      </ScrollView>

      <BookingBottomBar
        totalPrice={form.amountToPay}
        loading={form.loading}
        disabled={!form.date}
        onConfirm={form.handleConfirmBooking}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: SPACING.lg,
      paddingBottom: 100,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    hint: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
      marginBottom: SPACING.sm,
    },
    datesRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    returnCol: { backgroundColor: colors.pastel.peach.bg },
    returnText: { color: colors.pastel.peach.fg },
    tripLength: {
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: SPACING.xs,
      marginBottom: SPACING.lg,
    },
    dateCol: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      padding: SPACING.sm + 4,
    },
    dateLabel: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    dateVal: { fontFamily: FONTS.bold, fontSize: 14, color: colors.ink, marginTop: 2 },
    error: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.error,
      marginBottom: SPACING.md,
    },
  });
}
