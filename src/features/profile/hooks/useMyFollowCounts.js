import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getPublicProfile } from '../../../api/follows';
import { useFollow, isServerUserId } from '../../../context/FollowContext';

/** My follower / following counts, refreshed whenever the profile is shown. */
export function useMyFollowCounts() {
  const { meId, followingCount } = useFollow();
  const [counts, setCounts] = useState({ followers: undefined, following: undefined });

  useFocusEffect(
    useCallback(() => {
      if (!isServerUserId(meId)) return undefined;
      let alive = true;
      getPublicProfile(meId)
        .then(({ followers, following }) => alive && setCounts({ followers, following }))
        .catch(() => {});
      return () => {
        alive = false;
      };
    }, [meId, followingCount])
  );

  return counts;
}

export default useMyFollowCounts;
