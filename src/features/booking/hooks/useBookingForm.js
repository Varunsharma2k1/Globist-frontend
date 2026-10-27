import { useState } from 'react';
import { createBooking } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { defaultOccupancy, priceForOccupancy } from '../../../data/occupancy';

const SERVICE_FEE_RATE = 0.03;
const MIN_TRAVELERS = 1;
const MAX_TRAVELERS = 8;

/**
 * Owns the booking checkout form's state, derived pricing, and submission.
 *
 * @param {Object} trip - the trip being booked (from route params)
 * @param {Object} [referral] - reel attribution from route params (see
 *   buildReferral in features/reels/utils); absent for direct bookings
 * @param {string} [initialOccupancy] - room sharing picked on the trip page
 */
export function useBookingForm(trip, referral, initialOccupancy) {
  const { user } = useAuth();

  const [travelers, setTravelers] = useState(1);
  const [occupancy, setOccupancy] = useState(initialOccupancy || defaultOccupancy(trip));
  const [date, setDate] = useState('2026-10-15');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const pricePerPerson = priceForOccupancy(trip, occupancy) || 18000;
  const subtotal = pricePerPerson * travelers;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const totalPrice = subtotal + serviceFee;

  const adjustTravelers = (delta) => {
    setTravelers((prev) => Math.min(MAX_TRAVELERS, Math.max(MIN_TRAVELERS, prev + delta)));
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
        occupancy: occupancy || undefined,
        startDate: date,
        paymentMethod: backendPaymentMethod,
        referredBy: referral?.referredBy,
      });
    } catch (error) {
      console.warn('[useBookingForm] Booking submission error:', error);
    } finally {
      setLoading(false);
      setConfirmed(true);
    }
  };

  return {
    travelers,
    adjustTravelers,
    occupancy,
    setOccupancy,
    date,
    setDate,
    phone,
    setPhone,
    paymentMethod,
    setPaymentMethod,
    loading,
    confirmed,
    pricePerPerson,
    subtotal,
    serviceFee,
    totalPrice,
    handleConfirmBooking,
    minTravelers: MIN_TRAVELERS,
    maxTravelers: MAX_TRAVELERS,
  };
}

export default useBookingForm;
