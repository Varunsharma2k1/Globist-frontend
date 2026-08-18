import { useState } from 'react';
import { likeReel } from '../../../api';

/**
 * Owns like/unlike state for a single reel and the optimistic-update +
 * best-effort API call that goes with it. Only hits the network for reels
 * that actually exist server-side (have an `_id`) — local-only preview
 * reels (e.g. Post Reel's template preview) just update UI state.
 *
 * @param {{ _id?: string, likes?: number }} reel
 */
export function useReelLike(reel) {
  const [likes, setLikes] = useState(reel.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));
      if (reel._id) {
        await likeReel(reel._id);
      }
    } catch (error) {
      console.warn('[useReelLike] Error liking reel:', error);
    }
  };

  return { likes, liked, handleLike };
}

export default useReelLike;
