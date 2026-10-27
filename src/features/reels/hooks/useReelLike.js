import { useCallback, useState } from 'react';
import { useReelEngagement } from '../context/ReelEngagementContext';

/**
 * Like/unlike state for a single reel — demo only for now, no API call.
 *
 * The displayed count is derived (`reel.likes` + 1 while liked) rather than
 * incremented, so rapid repeated taps can only flip the liked flag and can
 * never double-count. Saved reels share state through ReelEngagementContext;
 * unsaved preview reels (no `_id`) just keep it locally.
 *
 * @param {{ _id?: string, likes?: number }} reel
 */
export function useReelLike(reel) {
  const engagement = useReelEngagement();
  const [localLiked, setLocalLiked] = useState(false);
  const reelId = reel._id;
  const shared = Boolean(engagement && reelId);

  const liked = shared ? Boolean(engagement.likedById[reelId]) : localLiked;
  const likes = (reel.likes || 0) + (liked ? 1 : 0);

  const handleLike = useCallback(() => {
    if (shared) engagement.toggleLiked(reelId);
    else setLocalLiked((v) => !v);
  }, [shared, engagement, reelId]);

  // Double-tap only ever likes (never unlikes), matching Instagram.
  const likeOnce = useCallback(() => {
    if (shared) engagement.setLiked(reelId, true);
    else setLocalLiked(true);
  }, [shared, engagement, reelId]);

  return { likes, liked, handleLike, likeOnce };
}

export default useReelLike;
