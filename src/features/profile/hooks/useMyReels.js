import { useState, useEffect } from 'react';
import { getReels } from '../../../api';

// The three demo videos used as the user's reels for now (server/uploads/reels).
const DEMO_REEL_FILES = ['reel1.mp4', 'reel2.mp4', 'reel3.mp4'];

/**
 * The reels shown in the profile's "My Posts" grid. Until reels are tied to
 * the signed-in user, this is the three demo reels from the feed.
 */
export function useMyReels() {
  const [reels, setReels] = useState([]);
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

  return { reels, loading, error };
}
