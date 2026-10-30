import { useState, useEffect, useMemo } from 'react';
import { getExploreTrips, getMyBookings } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { demoCounts, pickDemoTrips } from '../utils/demoCounts';
import { buildTravelerBooking, otherBackendBookings } from '../utils/travelerBookings';

/**
 * Trips behind the profile's "My Trips" (kind: 'booked') and "Saved Trips"
 * (kind: 'saved') rows. Booked trips are the ones booked in the app (the
 * on-device ledger, newest first, each carrying its `ledgerBooking` for the
 * trip-status / reel actions) followed by any other backend bookings; when
 * there are none (and for saved trips, which have no backend yet) it shows
 * placeholder picks from the catalogue, matching the counts on the profile.
 */
export function useProfileTrips(kind) {
  const { user } = useAuth();
  const { myBookings } = useTripLedger();
  const [catalogue, setCatalogue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [explore, list] = await Promise.all([
          getExploreTrips(),
          kind === 'booked' ? getMyBookings().catch(() => []) : Promise.resolve([]),
        ]);
        if (!active) return;
        setCatalogue(explore.trips);
        setBookings(list);
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
    const counts = demoCounts(user?._id);
    if (kind === 'saved') return pickDemoTrips(catalogue, user?._id, kind, counts.saved);
    const backend = otherBackendBookings(bookings, myBookings);
    if (myBookings.length || backend.length) {
      return [
        ...myBookings.map((booking, index) => ({
          ...buildTravelerBooking({ user, booking, index }),
          ledgerBooking: booking,
        })),
        ...backend.map((booking, index) => buildTravelerBooking({ user, booking, index })),
      ];
    }
    return pickDemoTrips(catalogue, user?._id, kind, counts.trips).map((trip, index) =>
      buildTravelerBooking({ user, trip, index })
    );
  }, [bookings, myBookings, catalogue, user, kind]);

  return { trips, loading };
}
