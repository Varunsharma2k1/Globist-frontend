import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLikedReelIds, likeReel, unlikeReel } from '../../../api/reels';
import { useAuth } from '../../../hooks/useAuth';

const ReelEngagementContext = createContext(null);
const isServerId = (id) => /^[a-f0-9]{24}$/.test(String(id || ''));

/**
 * App-wide likes for tapes, backed by the server:
 *  - which tapes I liked (GET /reels/liked-ids), so hearts are filled everywhere;
 *  - like / unlike are optimistic, then corrected with the server's count;
 *  - share counts are kept for this session only.
 */
export function ReelEngagementProvider({ children }) {
  const { user } = useAuth();
  const meId = user && !user.isGuest ? String(user._id) : null;
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [likeCounts, setLikeCounts] = useState({}); // reelId -> latest count from server
  const [commentDelta, setCommentDelta] = useState({}); // reelId -> comments added/removed here
  const [sharesById, setSharesById] = useState({});

  useEffect(() => {
    setLikedIds(new Set());
    setLikeCounts({});
    if (!meId) return undefined;
    let alive = true;
    getLikedReelIds()
      .then((ids) => alive && setLikedIds(new Set(ids)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [meId]);

  const isLiked = useCallback((reelId) => likedIds.has(String(reelId)), [likedIds]);

  const likesFor = useCallback(
    (reel) => likeCounts[String(reel._id)] ?? reel.likes ?? 0,
    [likeCounts]
  );

  /** Sets liked on/off. Returns false if it can't (guest / unsaved tape). */
  const setLiked = useCallback(
    (reel, on) => {
      const id = String(reel._id);
      if (!meId || !isServerId(id)) return false;
      if (likedIds.has(id) === on) return true;
      const before = likesFor(reel);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (on) next.add(id);
        else next.delete(id);
        return next;
      });
      setLikeCounts((prev) => ({ ...prev, [id]: Math.max(0, before + (on ? 1 : -1)) }));
      (on ? likeReel(id) : unlikeReel(id))
        .then(({ likes }) => setLikeCounts((prev) => ({ ...prev, [id]: likes })))
        .catch(() => {
          // Roll back.
          setLikedIds((prev) => {
            const next = new Set(prev);
            if (on) next.delete(id);
            else next.add(id);
            return next;
          });
          setLikeCounts((prev) => ({ ...prev, [id]: before }));
        });
      return true;
    },
    [meId, likedIds, likesFor]
  );

  const bumpComments = useCallback((reelId, by) => {
    setCommentDelta((prev) => ({ ...prev, [reelId]: (prev[reelId] || 0) + by }));
  }, []);

  const recordShare = useCallback((reelId) => {
    setSharesById((prev) => ({ ...prev, [reelId]: (prev[reelId] || 0) + 1 }));
  }, []);

  const value = useMemo(
    () => ({
      meId,
      isLiked,
      likesFor,
      setLiked,
      commentDelta,
      bumpComments,
      sharesById,
      recordShare,
    }),
    [meId, isLiked, likesFor, setLiked, commentDelta, bumpComments, sharesById, recordShare]
  );

  return <ReelEngagementContext.Provider value={value}>{children}</ReelEngagementContext.Provider>;
}

/** The shared store, or null outside the provider. */
export function useReelEngagement() {
  return useContext(ReelEngagementContext);
}
