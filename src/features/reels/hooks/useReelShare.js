import { useCallback, useRef, useState } from 'react';
import { Share } from 'react-native';
import { useReelEngagement } from '../context/ReelEngagementContext';
import { buildShareMessage } from '../utils/reelFormat';

/**
 * Opens the native iOS/Android share sheet for a reel and bumps the (demo)
 * share count when the user actually shares. Cancelling the sheet is a
 * normal outcome, not an error. Android always reports `sharedAction`, so
 * the count there goes up whenever the sheet is opened and closed.
 *
 * @param {Object} reel
 */
export function useReelShare(reel) {
  const engagement = useReelEngagement();
  const [localShares, setLocalShares] = useState(0);
  const sharingRef = useRef(false);
  const reelId = reel._id;
  const shared = Boolean(engagement && reelId);

  const shares = (reel.shares || 0) + (shared ? engagement.sharesById[reelId] || 0 : localShares);

  const handleShare = useCallback(async () => {
    // The share sheet is modal; ignore extra taps while it's opening.
    if (sharingRef.current) return;
    sharingRef.current = true;
    try {
      const result = await Share.share({
        title: reel.location ? `Travel reel — ${reel.location}` : 'Triptape travel reel',
        message: buildShareMessage(reel),
      });
      if (result.action === Share.sharedAction) {
        if (shared) engagement.recordShare(reelId);
        else setLocalShares((n) => n + 1);
      }
    } catch (error) {
      console.warn('[useReelShare] Error sharing reel:', error);
    } finally {
      sharingRef.current = false;
    }
  }, [reel, shared, engagement, reelId]);

  return { shares, handleShare };
}

export default useReelShare;
