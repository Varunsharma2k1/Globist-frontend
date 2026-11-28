import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useReelEngagement } from '../context/ReelEngagementContext';
import haptics from '../../../utils/haptics';

/**
 * Like state for one tape, saved on the server (see ReelEngagementContext).
 * Guests are sent to sign in. Unsaved previews (no `_id`, e.g. the Post Tape
 * preview) just toggle locally.
 */
export function useReelLike(reel) {
  const engagement = useReelEngagement();
  const navigation = useNavigation();
  const [previewLiked, setPreviewLiked] = useState(false);
  const saved = Boolean(engagement && reel._id);

  const liked = saved ? engagement.isLiked(reel._id) : previewLiked;
  const likes = saved ? engagement.likesFor(reel) : (reel.likes || 0) + (previewLiked ? 1 : 0);

  const set = useCallback(
    (on) => {
      if (!saved) {
        setPreviewLiked(on);
        return true;
      }
      if (!engagement.meId) {
        navigation.navigate('Auth');
        return false;
      }
      return engagement.setLiked(reel, on);
    },
    [saved, engagement, navigation, reel]
  );

  const handleLike = useCallback(() => {
    if (!liked) haptics.impact();
    set(!liked);
  }, [liked, set]);

  // Double-tap only ever likes (never unlikes), matching Instagram.
  const likeOnce = useCallback(() => {
    haptics.impact();
    return set(true);
  }, [set]);

  return { likes, liked, handleLike, likeOnce };
}

export default useReelLike;
