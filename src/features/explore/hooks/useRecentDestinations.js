import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../config';

const MAX_RECENTS = 5;

/**
 * Destinations the user recently opened in Explore, newest first, persisted
 * as { key, name } so they can be matched back to live destinations.
 */
export function useRecentDestinations() {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.EXPLORE_RECENTS)
      .then((stored) => {
        if (stored) setRecents(JSON.parse(stored));
      })
      .catch((error) => console.warn('[useRecentDestinations] Failed to load:', error));
  }, []);

  const addRecent = useCallback((destination) => {
    setRecents((prev) => {
      const next = [
        { key: destination.key, name: destination.name },
        ...prev.filter((r) => r.key !== destination.key),
      ].slice(0, MAX_RECENTS);
      AsyncStorage.setItem(STORAGE_KEYS.EXPLORE_RECENTS, JSON.stringify(next)).catch((error) =>
        console.warn('[useRecentDestinations] Failed to save:', error)
      );
      return next;
    });
  }, []);

  return { recents, addRecent };
}

export default useRecentDestinations;
