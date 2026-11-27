import { useState, useEffect, useMemo } from 'react';
import { getMyBookings } from '../../../api';
import { getWishlist } from '../../../api/trips';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { buildTravelerBooking, otherBackendBookings } from '../utils/travelerBookings';

/**
 * Trips behind the profile's "Trips" (kind: 'booked') and "Saved" (kind:
 * 'saved') tabs — real data only:
 * - booked: trips booked in the app (on-device ledger, newest first, each
 *   carrying its `ledgerBooking` for the trip-status / tape actions) plus any
 *   other server bookings;
 * - saved: the user's ♡ wishlist from the server.
 */
export function useProfileTrips(kind) {
  const { user } = useAuth();
  const { myBookings } = useTripLedger();
  const [saved, setSaved] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (kind === 'saved') {
          const list = await getWishlist();
          if (active) setSaved(list);
        } else {
          const list = await getMyBookings().catch(() => []);
          if (active) setBookings(list);
        }
      } catch (error) {
        console.warn('[useProfileTrips] Failed to load trips:', error?.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [kind]);

  // Saved: plain trips. Booked: each trip with its invoice details.
  const trips = useMemo(() => {
    if (kind === 'saved') return saved;
    const backend = otherBackendBookings(bookings, myBookings);
    return [
      ...myBookings.map((booking, index) => ({
        ...buildTravelerBooking({ user, booking, index }),
        ledgerBooking: booking,
      })),
      ...backend.map((booking, index) => buildTravelerBooking({ user, booking, index })),
    ];
  }, [bookings, myBookings, saved, user, kind]);

  return { trips, loading };
}
