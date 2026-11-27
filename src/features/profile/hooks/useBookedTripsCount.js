import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMyBookings } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { otherBackendBookings } from '../utils/travelerBookings';

/**
 * How many trips the My Trips list shows, for the profile's row and stats:
 * trips booked in the app plus the user's other backend bookings.
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

  // Real count only (no demo placeholder).
  return myBookings.length + otherBackendBookings(backendBookings, myBookings).length;
}

export default useBookedTripsCount;
