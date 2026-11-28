import { AppState } from 'react-native';
import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';
import { useAuth } from '../hooks/useAuth';
import * as api from '../api/communities';

/**
 * Communities, shared through the server (MongoDB): which communities you
 * joined, everyone's posts, comments and votes — so a post from one phone
 * shows on every other phone.
 *
 * The community catalogue (names, covers) and the starter posts still ship
 * in the app (src/data). Votes on those starter posts stay on this device;
 * everything people create goes to the server.
 *
 * Guests can browse; joining, posting, commenting and voting need an account.
 */
export const CommunitiesContext = createContext();

const isServerId = (id) => /^[a-f0-9]{24}$/.test(String(id));
const hoursSince = (iso) => Math.max(0, (Date.now() - new Date(iso).getTime()) / 3600000);
const handleOf = (u) =>
  (u?.username || u?.name || 'traveller')
    .toLowerCase()
    .replace(/[^a-z0-9_.]+/g, '_')
    .replace(/^_|_$/g, '');

const toComment = (c) => ({
  id: String(c._id),
  handle: handleOf(c.user),
  hoursAgo: hoursSince(c.createdAt),
  text: c.text,
  likes: 0,
  isMine: Boolean(c.isMine),
});

const toPost = (p) => ({
  id: String(p._id),
  communityId: p.community,
  handle: handleOf(p.user),
  author: p.user,
  hoursAgo: hoursSince(p.createdAt),
  createdAt: new Date(p.createdAt).getTime(),
  flair: p.flair,
  title: p.title,
  body: p.body,
  score: p.score,
  serverVote: p.userVote || 0,
  commentCount: p.commentCount,
  comments: (p.comments || []).map(toComment),
  isMine: Boolean(p.isMine),
  fromServer: true,
});

class NeedsSignIn extends Error {}

export const CommunitiesProvider = ({ children }) => {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isGuest && user._id);

  const [joined, setJoined] = useState([]);
  const [stats, setStats] = useState({}); // slug -> { members, online }
  const [posts, setPosts] = useState({}); // communityId -> [server post]
  const [details, setDetails] = useState({}); // postId -> server post with comments
  const [localVotes, setLocalVotes] = useState({}); // starter posts only
  const localLoaded = useRef(false);

  // Starter-post votes (device only).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.COMMUNITIES)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : {};
        setLocalVotes(saved.votes || {});
      })
      .catch(() => {})
      .finally(() => {
        localLoaded.current = true;
      });
  }, []);
  useEffect(() => {
    if (localLoaded.current) {
      AsyncStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify({ votes: localVotes })).catch(
        () => {}
      );
    }
  }, [localVotes]);

  const refreshMembership = useCallback(() => {
    api.getCommunityStats().then(setStats).catch(() => {});
    if (signedIn) api.getJoinedCommunities().then(setJoined).catch(() => {});
    else setJoined([]);
  }, [signedIn]);

  useEffect(() => {
    refreshMembership();
    setPosts({});
    setDetails({});
  }, [refreshMembership]);

  // Keep members / online fresh while the app is open.
  useEffect(() => {
    const t = setInterval(() => {
      if (AppState.currentState === 'active') api.getCommunityStats().then(setStats).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  /** Fetch a community's posts from the server (call on focus / pull-to-refresh). */
  const loadPosts = useCallback(async (communityId) => {
    try {
      const list = await api.getCommunityPosts(communityId);
      setPosts((prev) => ({ ...prev, [communityId]: list.map(toPost) }));
    } catch {
      // offline: keep what we have
    }
  }, []);

  /** Fetch one server post with its comments. Starter posts need nothing. */
  const loadPost = useCallback(async (postId) => {
    if (!isServerId(postId)) return;
    try {
      const p = toPost(await api.getCommunityPost(postId));
      setDetails((prev) => ({ ...prev, [postId]: p }));
    } catch {
      // keep what we have
    }
  }, []);

  const requireSignIn = useCallback(() => {
    if (!signedIn) throw new NeedsSignIn('Sign in to join communities and post');
  }, [signedIn]);

  const toggleJoin = useCallback(
    async (id) => {
      requireSignIn();
      const wasJoined = joined.includes(id);
      setJoined((prev) => (wasJoined ? prev.filter((j) => j !== id) : [...prev, id]));
      setStats((m) => {
        const cur = m[id] || { members: 0, online: 0 };
        const d = wasJoined ? -1 : 1; // you're online, so you count in both
        return {
          ...m,
          [id]: { members: Math.max(0, cur.members + d), online: Math.max(0, cur.online + d) },
        };
      });
      try {
        await (wasJoined ? api.leaveCommunity(id) : api.joinCommunity(id));
        api.getCommunityStats().then(setStats).catch(() => {});
      } catch (e) {
        refreshMembership(); // roll back to the server's truth
        throw e;
      }
    },
    [joined, requireSignIn, refreshMembership]
  );

  const patchPost = useCallback((postId, patch) => {
    setPosts((prev) => {
      const next = {};
      for (const [k, list] of Object.entries(prev)) {
        next[k] = list.map((p) => (p.id === postId ? { ...p, ...patch(p) } : p));
      }
      return next;
    });
    setDetails((prev) => (prev[postId] ? { ...prev, [postId]: { ...prev[postId], ...patch(prev[postId]) } } : prev));
  }, []);

  /** direction: 1 (up) or -1 (down); tapping the active one clears it. */
  const vote = useCallback(
    async (postId, direction) => {
      if (!isServerId(postId)) {
        setLocalVotes((prev) => ({ ...prev, [postId]: prev[postId] === direction ? 0 : direction }));
        return;
      }
      requireSignIn();
      const current =
        details[postId]?.serverVote ??
        Object.values(posts).flat().find((p) => p.id === postId)?.serverVote ??
        0;
      const value = current === direction ? 0 : direction;
      patchPost(postId, (p) => ({ serverVote: value, score: p.score + (value - p.serverVote) }));
      try {
        const res = await api.voteCommunityPost(postId, value);
        patchPost(postId, () => ({ serverVote: res.userVote, score: res.score }));
      } catch {
        loadPost(postId);
      }
    },
    [details, posts, patchPost, requireSignIn, loadPost]
  );

  const addPost = useCallback(
    async (communityId, { title, body, flair }) => {
      requireSignIn();
      const post = toPost(await api.createCommunityPost(communityId, { title, body, flair }));
      setPosts((prev) => ({ ...prev, [communityId]: [post, ...(prev[communityId] || [])] }));
      return post;
    },
    [requireSignIn]
  );

  const addComment = useCallback(
    async (postId, text) => {
      requireSignIn();
      if (!isServerId(postId)) throw new Error('This is a sample post. Comments are open on posts from members.');
      const c = toComment(await api.addCommunityComment(postId, text));
      patchPost(postId, (p) => ({ commentCount: p.commentCount + 1, comments: [...p.comments, c] }));
      setDetails((prev) => {
        const d = prev[postId];
        // patchPost already added it when the detail exists; make sure it is there once.
        if (d && d.comments.some((x) => x.id === c.id)) return prev;
        return d ? { ...prev, [postId]: { ...d, comments: [...d.comments, c] } } : prev;
      });
    },
    [patchPost, requireSignIn]
  );

  const value = useMemo(
    () => ({
      signedIn,
      joined,
      stats,
      posts,
      details,
      localVotes,
      toggleJoin,
      vote,
      addPost,
      addComment,
      loadPosts,
      loadPost,
      refreshMembership,
    }),
    [signedIn, joined, stats, posts, details, localVotes, toggleJoin, vote, addPost, addComment, loadPosts, loadPost, refreshMembership]
  );

  return <CommunitiesContext.Provider value={value}>{children}</CommunitiesContext.Provider>;
};

export { NeedsSignIn };
