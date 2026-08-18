import { useEffect, useState } from 'react';
import { getReels } from '../../../api';

/**
 * Fetches the reels feed once on mount.
 */
export function useReelsFeed() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getReels();
        setReels(data || []);
      } catch (error) {
        console.warn('[useReelsFeed] Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { reels, loading };
}

export default useReelsFeed;
