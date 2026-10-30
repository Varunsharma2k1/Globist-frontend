import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMyBookings } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { demoCounts } from '../utils/demoCounts';
import { otherBackendBookings } from '../utils/travelerBookings';

/**
 * How many trips the My Trips list shows, for the profile's row and stats:
 * trips booked in the app plus the user's other backend bookings, or the
 * placeholder count when there are none (same rules as useProfileTrips).
 * Backend bookings are refetched whenever the profile comes into focus.
 */
export function useBookedTripsCount() {
  const { user } = useAuth();
  const { myBookings } = useTripLedger();
  const [backendBookings, setBackendBookings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getMyBookings()
        .then((list) => active && setBackendBookings(list))
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  const count = myBookings.length + otherBackendBookings(backendBookings, myBookings).length;
  return count || demoCounts(user?._id).trips;
}

export default useBookedTripsCount;
