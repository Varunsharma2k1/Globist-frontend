import { useContext, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequireAuth } from './useRequireAuth';
import { CommunitiesContext } from '../context/CommunitiesContext';
import { COMMUNITY_POSTS } from '../data/communityPosts';
import { getCommunity } from '../data/communities';

/** Raw communities state + actions (join, vote, post, comment, load). */
export const useCommunities = () => {
  const context = useContext(CommunitiesContext);
  if (!context) throw new Error('useCommunities must be used within a CommunitiesProvider');
  return context;
};

/**
 * Read helpers: server posts (shared by everyone) merged with the app's
 * starter posts, live member counts, and the viewer's votes.
 */
export const useCommunityData = () => {
  const { joined, stats, posts, details, localVotes } = useCommunities();

  return useMemo(() => {
    const isJoined = (id) => joined.includes(id);
    // Real numbers from the server only (no made-up base counts).
    const memberCount = (community) => stats[community.id]?.members || 0;
    const onlineCount = (community) => stats[community.id]?.online || 0;

    const starter = (post) => ({
      ...post,
      userVote: localVotes[post.id] || 0,
      score: post.score + (localVotes[post.id] || 0),
    });
    const fromServer = (post) => ({ ...post, userVote: post.serverVote });
    const serverList = (communityId) => (posts[communityId] || []).map(fromServer);

    return {
      joinedCommunities: joined.map(getCommunity).filter(Boolean),
      isJoined,
      memberCount,
      onlineCount,
      getPostById: (id) => {
        if (details[id]) return fromServer(details[id]);
        const s = Object.values(posts).flat().find((p) => p.id === id);
        if (s) return fromServer(s);
        const p = COMMUNITY_POSTS.find((x) => x.id === id);
        return p ? starter(p) : null;
      },
      getPostsFor: (communityId, sort = 'hot') => {
        const list = [
          ...serverList(communityId),
          ...COMMUNITY_POSTS.filter((p) => p.communityId === communityId).map(starter),
        ];
        const age = (p) => (p.createdAt ? (Date.now() - p.createdAt) / 3600000 : p.hoursAgo);
        const sorters = {
          hot: (a, b) => b.score / Math.pow(age(b) + 2, 1.2) - a.score / Math.pow(age(a) + 2, 1.2),
          new: (a, b) => age(a) - age(b),
          top: (a, b) => b.score - a.score,
        };
        return list.sort(sorters[sort] || sorters.hot);
      },
    };
  }, [joined, stats, posts, details, localVotes]);
};

/**
 * The actions, made safe for buttons: guests get the sign-in sheet, server
 * errors show a short alert, and nothing throws into the UI.
 */
export const useCommunityActions = () => {
  const navigation = useNavigation();
  const { requireAuth } = useRequireAuth(navigation);
  const ctx = useCommunities();

  return useMemo(() => {
    const guard = (fn) => async (...args) => {
      if (!requireAuth(null)) return undefined;
      try {
        return await fn(...args);
      } catch (e) {
        const msg =
          e?.response?.data?.message || (e && !e.isAxiosError && e.message) || 'Please try again.';
        Alert.alert('Something went wrong', msg);
        return undefined;
      }
    };
    return {
      toggleJoin: guard(ctx.toggleJoin),
      vote: guard(ctx.vote),
      addPost: guard(ctx.addPost),
      addComment: guard(ctx.addComment),
    };
  }, [ctx.toggleJoin, ctx.vote, ctx.addPost, ctx.addComment, requireAuth]);
};
