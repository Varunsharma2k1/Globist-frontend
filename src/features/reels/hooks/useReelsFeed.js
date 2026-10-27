import { useCallback, useEffect, useState } from 'react';
import { getReels } from '../../../api';

/**
 * Fetches the reels feed on mount, exposing an error flag + retry so a
 * network failure isn't mistaken for "no reels yet".
 */
export function useReelsFeed() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getReels();
      setReels(data || []);
    } catch (err) {
      console.warn('[useReelsFeed] Error fetching reels:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { reels, loading, error, retry: load };
}

export default useReelsFeed;
