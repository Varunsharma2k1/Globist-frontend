import { useState } from 'react';

// Demo comments shown on real (saved) reels so the feed doesn't look empty.
// Preview reels with no `_id` yet (e.g. Post Reel's template preview) get
// none, so "zero values" there are genuinely zero, not seeded.
function seedComments(reel) {
  const place = reel.location || 'this trip';
  return [
    {
      id: 'c1',
      author: '@wanderlust_kate',
      text: `This looks incredible! Adding ${place} to my list 😍`,
    },
    { id: 'c2', author: '@travel_with_sam', text: 'How much did this trip cost roughly?' },
  ];
}

/**
 * Owns a single reel's comment thread — the seeded demo comments plus any
 * the current user posts locally during this session.
 *
 * @param {{ _id?: string, location?: string }} reel
 * @param {string} [authorName]
 */
export function useReelComments(reel, authorName) {
  const [comments, setComments] = useState(() => (reel._id ? seedComments(reel) : []));
  const [commentText, setCommentText] = useState('');

  const handlePostComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, author: authorName || 'You', text },
    ]);
    setCommentText('');
  };

  return { comments, commentText, setCommentText, handlePostComment };
}

export default useReelComments;
