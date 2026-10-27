import { useState, useEffect, useCallback } from 'react';
import { getTripById, getExploreTrips } from '../../../api';

const FALLBACK_TRIP = {
  title: 'Spiti Valley Winter Expedition',
  duration: '7 Days / 6 Nights',
  price: 24500,
  location: 'Spiti, Himachal Pradesh',
  agency: { name: 'Highland Travellers', rating: 4.9 },
  description:
    'Experience sub-zero temperatures, frozen waterfalls, and ancient monasteries in high altitude Spiti.',
  inclusions: ['4x4 Vehicle Transfers', 'Stays in Homestays', 'Permits & Taxes', 'All Meals'],
};

/**
 * Fetches a trip by id, or falls back to the first explore-trips result (or
 * a static demo trip) if no id was passed — matches the original screen's
 * behavior of always having something to render.
 */
export function useTripDetail(tripId) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTripDetails = useCallback(async () => {
    try {
      if (tripId) {
        const data = await getTripById(tripId);
        setTrip(data);
      } else {
        const data = await getExploreTrips();
        setTrip(data.trips?.[0] || null);
      }
    } catch (error) {
      console.warn('[useTripDetail] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  return { trip: trip || FALLBACK_TRIP, loading };
}

export default useTripDetail;
