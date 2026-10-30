import { useMemo, useState } from 'react';
import { createBooking } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { defaultOccupancy, priceForOccupancy } from '../../../data/occupancy';
import { departureDates, departureInterval, durationDays, tripEndDate } from '../utils/departures';

const SERVICE_FEE_RATE = 0.03;
const MIN_TRAVELERS = 1;
const MAX_TRAVELERS = 8;
// How long the simulated payment "processes" before succeeding.
const PAYMENT_DELAY_MS = 1200;

/**
 * Owns the booking checkout form's state, derived pricing, and submission.
 *
 * Payment is skipped for now: "Book now" shows a short processing state,
 * then the booking is saved to the on-device ledger (so it appears in My
 * Trips) and treated as paid. Travellers can put their wallet balance
 * (1 point = ₹1) towards the total; only the rest is "paid".
 *
 * @param {Object} trip - the trip being booked (from route params)
 * @param {Object} [referral] - reel attribution from route params (see
 *   buildReferral in features/reels/utils); absent for direct bookings
 * @param {string} [initialOccupancy] - room sharing picked on the trip page
 */
export function useBookingForm(trip, referral, initialOccupancy) {
  const { user } = useAuth();
  const { bookTrip, wallet } = useTripLedger();

  const departures = useMemo(() => departureDates(trip), [trip]);
  const [travelers, setTravelers] = useState(1);
  const [occupancy, setOccupancy] = useState(initialOccupancy || defaultOccupancy(trip));
  const [date, setDate] = useState(departures[0] || null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [useWallet, setUseWallet] = useState(false);

  const pricePerPerson = priceForOccupancy(trip, occupancy) || 18000;
  const subtotal = pricePerPerson * travelers;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const totalPrice = subtotal + serviceFee;
  const walletBalance = Math.max(0, wallet.balance);
  const walletUsed = useWallet ? Math.min(walletBalance, totalPrice) : 0;
  const amountToPay = totalPrice - walletUsed;
  const endDate = date ? tripEndDate(trip, date) : null;

  const adjustTravelers = (delta) => {
    setTravelers((prev) => Math.min(MAX_TRAVELERS, Math.max(MIN_TRAVELERS, prev + delta)));
  };

  const pickDate = (iso) => {
    setDate(iso);
    setError(null);
  };

  const handleConfirmBooking = async () => {
    if (!date) {
      setError('Pick a departure date from the calendar.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Mirror to the backend when it can take it (backend trips, real
      // sessions); the on-device ledger stays the source of truth for now.
      const [backendBooking] = await Promise.all([
        createBooking({
          tripId: trip?._id,
          travelersCount: travelers,
          occupancy: occupancy || undefined,
          startDate: date,
          paymentMethod: 'upi',
          referredBy: referral?.referredBy,
        }).catch(() => null),
        new Promise((resolve) => setTimeout(resolve, PAYMENT_DELAY_MS)),
      ]);

      const booking = bookTrip({
        user,
        trip,
        startDate: date,
        endDate,
        travelersCount: travelers,
        occupancy: occupancy || null,
        pricePerPerson,
        subtotal,
        serviceFee,
        totalPrice,
        walletUsed,
        phone,
        referral: referral
          ? {
              referredBy: referral.referredBy,
              creatorHandle: referral.creatorHandle,
              reelId: referral.reelId,
            }
          : null,
        backendId: backendBooking?._id || null,
      });
      setConfirmedBooking(booking);
    } finally {
      setLoading(false);
    }
  };

  return {
    departures,
    intervalDays: departureInterval(trip),
    tripDays: durationDays(trip),
    travelers,
    adjustTravelers,
    occupancy,
    setOccupancy,
    date,
    setDate: pickDate,
    endDate,
    phone,
    setPhone,
    loading,
    error,
    confirmedBooking,
    pricePerPerson,
    subtotal,
    serviceFee,
    totalPrice,
    walletBalance,
    useWallet,
    setUseWallet,
    walletUsed,
    amountToPay,
    handleConfirmBooking,
    minTravelers: MIN_TRAVELERS,
    maxTravelers: MAX_TRAVELERS,
  };
}

export default useBookingForm;
