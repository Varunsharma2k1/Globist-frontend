import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { followUser, unfollowUser, getFollowingIds } from '../api/follows';
import { useAuth } from '../hooks/useAuth';
import haptics from '../utils/haptics';

/**
 * Who the signed-in user follows, shared by every Follow button so they all
 * agree. Optimistic: the button flips at once and rolls back on failure.
 */
const FollowContext = createContext(null);

export const isServerUserId = (id) => /^[a-f0-9]{24}$/.test(String(id || ''));

export function FollowProvider({ children }) {
  const { user } = useAuth();
  const meId = user && !user.isGuest ? String(user._id) : null;
  const [ids, setIds] = useState(() => new Set());

  useEffect(() => {
    setIds(new Set());
    if (!meId) return undefined;
    let alive = true;
    getFollowingIds()
      .then((list) => alive && setIds(new Set(list)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [meId]);

  const set = (id, on) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  /** @returns {Promise<{isFollowing, followers}|null>} server counts, null if it failed */
  const toggle = useCallback(
    async (userId) => {
      const id = String(userId);
      const on = !ids.has(id);
      set(id, on);
      haptics.select();
      try {
        return await (on ? followUser(id) : unfollowUser(id));
      } catch (error) {
        set(id, !on);
        haptics.error();
        return null;
      }
    },
    [ids]
  );

  const value = useMemo(
    () => ({ meId, isFollowing: (id) => ids.has(String(id)), followingCount: ids.size, toggle }),
    [meId, ids, toggle]
  );

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
}

export const useFollow = () => useContext(FollowContext);
