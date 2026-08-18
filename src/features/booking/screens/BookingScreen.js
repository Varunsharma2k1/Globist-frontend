import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useBookingForm } from '../hooks/useBookingForm';
import BookingSummaryCard from '../components/BookingSummaryCard';
import TravelerStepper from '../components/TravelerStepper';
import PaymentMethodPicker from '../components/PaymentMethodPicker';
import PriceBreakdownCard from '../components/PriceBreakdownCard';
import BookingBottomBar from '../components/BookingBottomBar';
import BookingConfirmedView from '../components/BookingConfirmedView';

/**
 * BookingScreen Component
 *
 * Checkout interface for reserving travel packages. Form state, pricing,
 * and submission live in useBookingForm; each visual section is its own
 * component (see ../components) — this file is just the layout + the
 * confirmed/unconfirmed branch.
 */
export default function BookingScreen({ route, navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { trip } = route.params || {};

  const form = useBookingForm(trip);

  if (form.confirmed) {
    return (
      <BookingConfirmedView
        trip={trip}
        onBack={() => navigation.goBack()}
        onGoHome={() => navigation.navigate('MainTabs')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Confirm Booking" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}>
        <BookingSummaryCard trip={trip} pricePerPerson={form.pricePerPerson} />

        <Text style={typography.h3}>Booking Details</Text>
        <View style={{ marginTop: SPACING.sm }}>
          <Input
            label="Travel Date"
            value={form.date}
            onChangeText={form.setDate}
            placeholder="2026-10-15"
            leftIcon={<Calendar size={16} color={colors.textMuted} />}
          />

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

        <Text style={[typography.h3, { marginBottom: SPACING.sm }]}>Payment Method</Text>
        <PaymentMethodPicker value={form.paymentMethod} onChange={form.setPaymentMethod} />

        <PriceBreakdownCard
          travelers={form.travelers}
          pricePerPerson={form.pricePerPerson}
          subtotal={form.subtotal}
          serviceFee={form.serviceFee}
          totalPrice={form.totalPrice}
        />
      </ScrollView>

      <BookingBottomBar
        totalPrice={form.totalPrice}
        loading={form.loading}
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
  });
}
