import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';

/**
 * Communities state that belongs to the signed-in device: which communities
 * are joined, the user's votes, and the posts / comments they have added.
 * (The communities and starter posts themselves are demo data in src/data.)
 * Persisted so it survives restarts.
 */
export const CommunitiesContext = createContext();

const EMPTY = { joined: [], votes: {}, userPosts: [], userComments: {} };

const handleFor = (user) =>
  (user?.name || 'traveller')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

export const CommunitiesProvider = ({ children }) => {
  const [state, setState] = useState(EMPTY);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.COMMUNITIES)
      .then((stored) => stored && setState({ ...EMPTY, ...JSON.parse(stored) }))
      .catch((error) => console.warn('[Communities] Failed to load:', error?.message));
  }, []);

  const update = useCallback((fn) => {
    setState((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const toggleJoin = useCallback(
    (id) =>
      update((prev) => ({
        ...prev,
        joined: prev.joined.includes(id)
          ? prev.joined.filter((j) => j !== id)
          : [...prev.joined, id],
      })),
    [update]
  );

  /** direction: 1 (up) or -1 (down); tapping the active one clears it. */
  const vote = useCallback(
    (postId, direction) =>
      update((prev) => {
        const current = prev.votes[postId] || 0;
        return {
          ...prev,
          votes: { ...prev.votes, [postId]: current === direction ? 0 : direction },
        };
      }),
    [update]
  );

  const addPost = useCallback(
    (communityId, { title, body, flair }, user) => {
      const post = {
        id: `u-${Date.now()}`,
        communityId,
        handle: handleFor(user),
        hoursAgo: 0,
        createdAt: Date.now(),
        flair,
        title,
        body,
        score: 1,
        commentCount: 0,
        comments: [],
        isMine: true,
      };
      update((prev) => ({ ...prev, userPosts: [post, ...prev.userPosts] }));
      return post;
    },
    [update]
  );

  const addComment = useCallback(
    (postId, text, user) =>
      update((prev) => {
        const comment = {
          id: `uc-${Date.now()}`,
          handle: handleFor(user),
          hoursAgo: 0,
          text,
          likes: 0,
          isMine: true,
        };
        return {
          ...prev,
          userComments: {
            ...prev.userComments,
            [postId]: [...(prev.userComments[postId] || []), comment],
          },
        };
      }),
    [update]
  );

  const value = useMemo(
    () => ({ ...state, toggleJoin, vote, addPost, addComment }),
    [state, toggleJoin, vote, addPost, addComment]
  );

  return <CommunitiesContext.Provider value={value}>{children}</CommunitiesContext.Provider>;
};
