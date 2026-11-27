import { useCallback, useEffect, useState } from 'react';
import { getWishlist, toggleWishlist } from '../../../api/trips';
import { useAuth } from '../../../hooks/useAuth';
import haptics from '../../../utils/haptics';

const isServerTrip = (id) => /^[a-f0-9]{24}$/.test(String(id || ''));

/**
 * ♡ state for one trip, saved in the user's wishlist on the server.
 * Optimistic: the heart flips immediately and rolls back if the call fails.
 */
export function useSavedTrip(tripId) {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isGuest);
  const [saved, setSaved] = useState(false);
  const canSave = isServerTrip(tripId);

  useEffect(() => {
    if (!signedIn || !canSave) return undefined;
    let alive = true;
    getWishlist()
      .then((trips) => alive && setSaved(trips.some((t) => t._id === tripId)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [signedIn, canSave, tripId]);

  const toggle = useCallback(async () => {
    const next = !saved;
    setSaved(next);
    haptics.select();
    try {
      setSaved(await toggleWishlist(tripId));
    } catch {
      setSaved(!next);
    }
  }, [saved, tripId]);

  return { saved, canSave, toggle };
}

export default useSavedTrip;
