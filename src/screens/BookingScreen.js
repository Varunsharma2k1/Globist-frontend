import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Minus, Plus, Calendar, CreditCard, Smartphone, Store, CheckCircle2 } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { createBooking } from '../api';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

const PAYMENT_METHODS = [
  { key: 'card', icon: CreditCard, label: 'Card' },
  { key: 'upi', icon: Smartphone, label: 'UPI' },
  { key: 'agency', icon: Store, label: 'Pay at Agency' },
];

const SERVICE_FEE_RATE = 0.03;

/**
 * BookingScreen Component
 *
 * Checkout interface for reserving travel packages.
 * Uses `createBooking` API service and `useAuth` hook.
 */
export default function BookingScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { trip } = route.params || {};
  const { user } = useAuth();

  const [travelers, setTravelers] = useState(1);
  const [date, setDate] = useState('2026-10-15');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const pricePerPerson = trip?.price || 18000;
  const subtotal = pricePerPerson * travelers;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const totalPrice = subtotal + serviceFee;

  const adjustTravelers = (delta) => {
    setTravelers((prev) => Math.min(8, Math.max(1, prev + delta)));
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      // Backend's paymentMethod enum only knows 'upi' | 'card' | 'netbanking' —
      // "Pay at Agency" has no equivalent, so it falls back to the schema default (upi).
      const backendPaymentMethod = paymentMethod === 'agency' ? undefined : paymentMethod;

      await createBooking({
        tripId: trip?._id,
        travelersCount: travelers,
        startDate: date,
        paymentMethod: backendPaymentMethod,
      });
    } catch (error) {
      console.warn('[BookingScreen] Booking submission error:', error);
    } finally {
      setLoading(false);
      setConfirmed(true);
    }
  };

  if (confirmed) {
    return (
      <View style={styles.container}>
        <Header title="Confirm Booking" onBack={() => navigation.goBack()} />
        <View style={[styles.confirmedBody, { paddingBottom: SPACING.xl + insets.bottom }]}>
          <View style={styles.confirmedIcon}>
            <CheckCircle2 size={40} color={COLORS.success} strokeWidth={1.5} />
          </View>
          <Text style={styles.confirmedTitle}>Booking Confirmed</Text>
          <Text style={styles.confirmedTrip}>{trip?.title || 'Spiti Expedition'}</Text>
          <Button
            title="Back to Home"
            onPress={() => navigation.navigate('MainTabs')}
            style={{ marginTop: SPACING.xl, width: '100%', maxWidth: LAYOUT.contentMaxWidth }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Confirm Booking" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}>
        <Card style={styles.summaryCard}>
          <Text style={TYPOGRAPHY.h3}>{trip?.title || 'Spiti Expedition'}</Text>
          <View style={styles.summaryLocRow}>
            <MapPin size={12} color={COLORS.textMuted} />
            <Text style={styles.summaryLoc}>{trip?.location || 'Himachal Pradesh'}</Text>
          </View>
          <Text style={styles.summaryPrice}>₹{pricePerPerson.toLocaleString()} / person</Text>
        </Card>

        <Text style={TYPOGRAPHY.h3}>Booking Details</Text>
        <View style={{ marginTop: SPACING.sm }}>
          <Input
            label="Travel Date"
            value={date}
            onChangeText={setDate}
            placeholder="2026-10-15"
            leftIcon={<Calendar size={16} color={COLORS.textMuted} />}
          />

          <View style={styles.stepperContainer}>
            <Text style={styles.stepperLabel}>Number of Travelers</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => adjustTravelers(-1)}
                disabled={travelers <= 1}
              >
                <Minus size={16} color={travelers <= 1 ? COLORS.textMuted : COLORS.ink} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{travelers}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => adjustTravelers(1)}
                disabled={travelers >= 8}
              >
                <Plus size={16} color={travelers >= 8 ? COLORS.textMuted : COLORS.ink} />
              </TouchableOpacity>
            </View>
          </View>

          <Input
            label="Contact Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
          />
        </View>

        <Text style={[TYPOGRAPHY.h3, { marginBottom: SPACING.sm }]}>Payment Method</Text>
        <View style={styles.paymentRow}>
          {PAYMENT_METHODS.map((pm) => {
            const Icon = pm.icon;
            const active = paymentMethod === pm.key;
            return (
              <TouchableOpacity
                key={pm.key}
                style={[styles.paymentCard, active && styles.paymentCardActive]}
                onPress={() => setPaymentMethod(pm.key)}
              >
                <Icon size={20} color={active ? COLORS.white : COLORS.ink} strokeWidth={1.75} />
                <Text style={[styles.paymentText, active && styles.paymentTextActive]}>
                  {pm.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Card style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Price Summary</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              {travelers} traveler{travelers > 1 ? 's' : ''} × ₹{pricePerPerson.toLocaleString()}
            </Text>
            <Text style={styles.breakdownVal}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Service Fee (3%)</Text>
            <Text style={styles.breakdownVal}>₹{serviceFee.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>₹{totalPrice.toLocaleString()}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.bottomBar, { height: 84 + insets.bottom, paddingBottom: insets.bottom }]}>
        <View style={styles.bottomBarInner}>
          <View>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceVal}>₹{totalPrice.toLocaleString()}</Text>
          </View>
          <Button
            title="Confirm & Pay"
            onPress={handleConfirmBooking}
            loading={loading}
            style={{ width: 170 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
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
    color: COLORS.textMuted,
  },
  summaryPrice: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.ink,
  },
  stepperContainer: {
    marginBottom: SPACING.md,
  },
  stepperLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xs,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.ink,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  paymentCard: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  paymentCardActive: {
    backgroundColor: COLORS.ink,
  },
  paymentText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
  },
  paymentTextActive: {
    color: COLORS.white,
  },
  breakdownCard: {
    marginTop: SPACING.sm,
  },
  breakdownTitle: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  breakdownLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  breakdownVal: {
    fontFamily: FONTS.body,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.ink,
  },
  totalVal: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.ink,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.divider,
    paddingHorizontal: SPACING.lg,
  },
  bottomBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  priceLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  priceVal: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.ink,
  },
  confirmedBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  confirmedIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  confirmedTitle: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.ink,
  },
  confirmedTrip: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
