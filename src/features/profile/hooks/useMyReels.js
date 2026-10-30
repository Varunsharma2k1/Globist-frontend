import { useState, useEffect, useMemo } from 'react';
import { getReels } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';

// The three demo videos used as the user's reels for now (server/uploads/reels).
const DEMO_REEL_FILES = ['reel1.mp4', 'reel2.mp4', 'reel3.mp4'];

/**
 * The reels shown in the profile's "My Posts" grid: the reels the signed-in
 * user posted in the app (on-device ledger), followed by the three demo
 * reels from the feed until backend reels are tied to the user.
 */
export function useMyReels() {
  const { user } = useAuth();
  const { ledger } = useTripLedger();
  const [demoReels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await getReels();
        if (!active) return;
        const demo = DEMO_REEL_FILES.map((file) =>
          all.find((r) => r.mediaUrl?.endsWith(`/${file}`))
        ).filter(Boolean);
        setReels(demo.length ? demo : all.slice(0, 3));
      } catch (err) {
        console.warn('[useMyReels] Failed to load reels:', err?.message);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const reels = useMemo(
    () => [...ledger.reels.filter((r) => r.user?._id === user?._id), ...demoReels],
    [ledger.reels, demoReels, user?._id]
  );

  return { reels, loading, error: error && !reels.length };
}
