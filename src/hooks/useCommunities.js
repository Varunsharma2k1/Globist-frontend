import { useContext, useMemo } from 'react';
import { CommunitiesContext } from '../context/CommunitiesContext';
import { COMMUNITY_POSTS } from '../data/communityPosts';
import { getCommunity } from '../data/communities';

/** Raw communities state + actions (join, vote, post, comment). */
export const useCommunities = () => {
  const context = useContext(CommunitiesContext);
  if (!context) throw new Error('useCommunities must be used within a CommunitiesProvider');
  return context;
};

/**
 * Helpers that fold the user's own activity into the demo data: live member
 * counts, post scores with the user's vote, and comment totals.
 */
export const useCommunityData = () => {
  const { joined, votes, userPosts, userComments } = useCommunities();

  return useMemo(() => {
    const isJoined = (id) => joined.includes(id);
    const memberCount = (community) => community.members + (isJoined(community.id) ? 1 : 0);
    const allPosts = [...userPosts, ...COMMUNITY_POSTS];
    const withActivity = (post) => ({
      ...post,
      userVote: votes[post.id] || 0,
      score: post.score + (votes[post.id] || 0),
      commentCount: post.commentCount + (userComments[post.id]?.length || 0),
      comments: [...post.comments, ...(userComments[post.id] || [])],
    });

    return {
      joinedCommunities: joined.map(getCommunity).filter(Boolean),
      isJoined,
      memberCount,
      getPostById: (id) => {
        const post = allPosts.find((p) => p.id === id);
        return post ? withActivity(post) : null;
      },
      getPostsFor: (communityId, sort = 'hot') => {
        const list = allPosts.filter((p) => p.communityId === communityId).map(withActivity);
        const age = (p) => (p.createdAt ? (Date.now() - p.createdAt) / 3600000 : p.hoursAgo);
        const sorters = {
          hot: (a, b) => b.score / Math.pow(age(b) + 2, 1.2) - a.score / Math.pow(age(a) + 2, 1.2),
          new: (a, b) => age(a) - age(b),
          top: (a, b) => b.score - a.score,
        };
        return list.sort(sorters[sort] || sorters.hot);
      },
    };
  }, [joined, votes, userPosts, userComments]);
};
