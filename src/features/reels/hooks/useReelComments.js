import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getReelComments, postReelComment, deleteReelComment } from '../../../api/reels';
import { useReelEngagement } from '../context/ReelEngagementContext';
import haptics from '../../../utils/haptics';

const isServerId = (id) => /^[a-f0-9]{24}$/.test(String(id || ''));

/** Server comment -> the shape the comment rows render. */
const toRow = (c, meId) => ({
  id: c._id,
  author: c.user?.username ? `@${c.user.username}` : c.user?.name || 'Traveller',
  text: c.text,
  createdAt: new Date(c.createdAt).getTime(),
  isOwn: Boolean(meId && String(c.user?._id) === meId),
});

/**
 * A tape's comments from the server. Loads when the sheet opens (`open`);
 * posting needs sign-in. Count = the tape's saved count + changes made here.
 */
export function useReelComments(reel, open) {
  const engagement = useReelEngagement();
  const navigation = useNavigation();
  const meId = engagement?.meId;
  const reelId = reel._id;
  const real = isServerId(reelId);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!open || !real) return undefined;
    let alive = true;
    setLoading(true);
    getReelComments(reelId)
      .then((list) => alive && setComments(list.map((c) => toRow(c, meId))))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [open, real, reelId, meId]);

  const commentCount = (reel.comments || 0) + ((real && engagement?.commentDelta[reelId]) || 0);

  const handlePostComment = useCallback(async () => {
    const text = commentText.trim();
    if (!text || posting || !real) return false;
    if (!meId) {
      navigation.navigate('Auth');
      return false;
    }
    setPosting(true);
    try {
      const saved = await postReelComment(reelId, text);
      setComments((prev) => [toRow(saved, meId), ...prev]);
      engagement?.bumpComments(reelId, 1);
      setCommentText('');
      haptics.success();
      return true;
    } catch (error) {
      haptics.error();
      Alert.alert("Couldn't post", error.response?.data?.message || 'Check your connection.');
      return false;
    } finally {
      setPosting(false);
    }
  }, [commentText, posting, real, meId, navigation, reelId, engagement]);

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await deleteReelComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        engagement?.bumpComments(reelId, -1);
      } catch {
        Alert.alert("Couldn't delete", 'Try again.');
      }
    },
    [engagement, reelId]
  );

  return {
    comments,
    commentCount,
    loading,
    commentText,
    setCommentText,
    handlePostComment,
    handleDeleteComment,
    posting,
  };
}

export default useReelComments;
