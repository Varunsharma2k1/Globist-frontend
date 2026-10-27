import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ReelEngagementContext = createContext(null);

/**
 * Session-scoped, frontend-only store for reel likes, locally posted
 * comments, and share counts — all demo data, nothing is persisted.
 *
 * Keyed by reel `_id` (not by list row) because the feed renders each reel
 * many times over for its endless loop and unmounts rows that scroll far
 * away; keeping the state here means a liked reel stays liked when it comes
 * back around or gets re-mounted.
 */
export function ReelEngagementProvider({ children }) {
  const [likedById, setLikedById] = useState({});
  const [commentsById, setCommentsById] = useState({});
  const [sharesById, setSharesById] = useState({});

  const setLiked = useCallback((reelId, liked) => {
    setLikedById((prev) => (Boolean(prev[reelId]) === liked ? prev : { ...prev, [reelId]: liked }));
  }, []);

  const toggleLiked = useCallback((reelId) => {
    setLikedById((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  }, []);

  const addComment = useCallback((reelId, comment) => {
    setCommentsById((prev) => ({ ...prev, [reelId]: [comment, ...(prev[reelId] || [])] }));
  }, []);

  const recordShare = useCallback((reelId) => {
    setSharesById((prev) => ({ ...prev, [reelId]: (prev[reelId] || 0) + 1 }));
  }, []);

  const value = useMemo(
    () => ({
      likedById,
      commentsById,
      sharesById,
      setLiked,
      toggleLiked,
      addComment,
      recordShare,
    }),
    [likedById, commentsById, sharesById, setLiked, toggleLiked, addComment, recordShare]
  );

  return <ReelEngagementContext.Provider value={value}>{children}</ReelEngagementContext.Provider>;
}

/**
 * Returns the shared engagement store, or null outside a provider (e.g. the
 * Post Reel preview) — callers fall back to their own local state then.
 */
export function useReelEngagement() {
  return useContext(ReelEngagementContext);
}
