import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMyReels } from '../../../api/reels';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { mergeReels } from '../../reels/hooks/useReelsFeed';

/**
 * The signed-in user's own tapes: GET /reels/mine (MongoDB, includes ones
 * still processing) plus any just-posted tape on this device that the server
 * hasn't returned yet. Refreshes whenever the profile comes into view.
 */
export function useMyReels() {
  const { user } = useAuth();
  const { ledger } = useTripLedger();
  const [serverReels, setServerReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const signedIn = Boolean(user && !user.isGuest);

  useFocusEffect(
    useCallback(() => {
      if (!signedIn) {
        setLoading(false);
        return undefined;
      }
      let active = true;
      getMyReels()
        .then((list) => {
          if (!active) return;
          setServerReels(list);
          setError(false);
        })
        .catch((err) => {
          console.warn('[useMyReels]', err?.message);
          if (active) setError(true);
        })
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [signedIn])
  );

  const reels = useMemo(
    () =>
      mergeReels(
        serverReels,
        ledger.reels.filter((r) => r.user?._id === user?._id)
      ),
    [serverReels, ledger.reels, user?._id]
  );

  return { reels, loading, error: error && !reels.length };
}

export default useMyReels;
