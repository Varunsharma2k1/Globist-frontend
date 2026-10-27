import { useCallback, useMemo, useState } from 'react';
import { useReelEngagement } from '../context/ReelEngagementContext';

const MINUTE = 60 * 1000;
const NO_COMMENTS = [];

// Demo comments shown on real (saved) reels so the feed doesn't look empty.
// Preview reels with no `_id` yet (e.g. Post Reel's template preview) get
// none, so "zero values" there are genuinely zero, not seeded.
function seedComments(reel) {
  const place = reel.location || 'this trip';
  const now = Date.now();
  return [
    {
      id: 'c1',
      author: '@wanderlust_kate',
      text: `This looks incredible! Adding ${place} to my list 😍`,
      createdAt: now - 42 * MINUTE,
    },
    {
      id: 'c2',
      author: '@travel_with_sam',
      text: 'How much did this trip cost roughly?',
      createdAt: now - 3 * 60 * MINUTE,
    },
    {
      id: 'c3',
      author: '@nomad.riya',
      text: 'Saving this for my next long weekend 🙌',
      createdAt: now - 26 * 60 * MINUTE,
    },
  ];
}

/**
 * Owns a single reel's comment thread — the seeded demo comments plus any
 * the current user posts locally during this session (newest first). Demo
 * only: nothing is sent to the backend.
 *
 * @param {{ _id?: string, location?: string }} reel
 * @param {string} [authorName]
 */
export function useReelComments(reel, authorName) {
  const engagement = useReelEngagement();
  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const reelId = reel._id;
  const shared = Boolean(engagement && reelId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seeded = useMemo(() => (reelId ? seedComments(reel) : []), [reelId]);
  const posted = shared ? engagement.commentsById[reelId] || NO_COMMENTS : localComments;
  const comments = useMemo(() => [...posted, ...seeded], [posted, seeded]);

  const handlePostComment = useCallback(() => {
    const text = commentText.trim();
    if (!text) return false;
    const comment = {
      id: `local-${Date.now()}`,
      author: authorName || 'You',
      text,
      createdAt: Date.now(),
      isOwn: true,
    };
    if (shared) engagement.addComment(reelId, comment);
    else setLocalComments((prev) => [comment, ...prev]);
    setCommentText('');
    return true;
  }, [commentText, authorName, shared, engagement, reelId]);

  return { comments, commentText, setCommentText, handlePostComment };
}

export default useReelComments;
