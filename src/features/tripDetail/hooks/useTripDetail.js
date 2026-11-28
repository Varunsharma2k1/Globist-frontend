import { useState, useEffect, useCallback } from 'react';
import { getTripById } from '../../../api';

/**
 * Loads one trip from the server. No made-up fallback: if it can't load,
 * the screen shows an error with Retry.
 */
export function useTripDetail(tripId) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!tripId) throw new Error('missing trip');
      setTrip(await getTripById(tripId));
    } catch (e) {
      setError(
        e.response?.status === 404 || e.message === 'missing trip'
          ? 'This trip is no longer available.'
          : 'Could not load this trip. Check your connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  return { trip, loading, error, retry: load };
}

export default useTripDetail;
