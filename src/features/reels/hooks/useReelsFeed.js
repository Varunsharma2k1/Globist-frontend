import { useCallback, useEffect, useMemo, useState } from 'react';
import { getReels } from '../../../api';
import { useTripLedger } from '../../../hooks/useTripLedger';

/**
 * Backend reels with the reels posted in the app (on-device ledger, newest
 * first) on top. A ledger reel that was also mirrored to the backend
 * replaces its backend copy, since only the ledger one knows its trip.
 */
export function mergeReels(backendReels, ledgerReels) {
  const mirrored = new Set(ledgerReels.map((r) => r.backendId).filter(Boolean));
  return [...ledgerReels, ...backendReels.filter((r) => !mirrored.has(r._id))];
}

/**
 * Fetches the reels feed on mount, exposing an error flag + retry so a
 * network failure isn't mistaken for "no reels yet".
 */
export function useReelsFeed() {
  const { ledger } = useTripLedger();
  const [backendReels, setReels] = useState([]);
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

  const reels = useMemo(() => mergeReels(backendReels, ledger.reels), [backendReels, ledger.reels]);

  // Posted reels still show when the backend feed can't be reached.
  return { reels, loading, error: error && !reels.length, retry: load };
}

export default useReelsFeed;
