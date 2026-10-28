import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';

/**
 * Global App Settings Context
 *
 * Persists Settings-screen preferences to AsyncStorage so they survive app
 * restarts. Shape matches the "Triptape Profile & Settings" design handoff:
 * grouped toggle rows + a Feed Preferences segmented choice.
 */
export const SettingsContext = createContext();

export const FEED_PREF_OPTIONS = [
  { key: 'algorithm', label: 'For You', sub: 'Personalized ranking based on your trips' },
  { key: 'chronological', label: 'Chronological', sub: 'Most recent posts first' },
];

const DEFAULT_SETTINGS = {
  toggles: {
    privacy: false,
    pushAll: true,
    notifComments: true,
    notifLikes: true,
    notifDMs: true,
    notifFollowers: false,
    emailSms: false,
    hqUploads: true,
    dataSaver: false,
    showTouches: false,
  },
  feedPref: 'algorithm',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
            toggles: { ...DEFAULT_SETTINGS.toggles, ...parsed.toggles },
          });
        }
      } catch (error) {
        console.warn('[SettingsContext] Failed to load settings:', error?.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = (next) => {
    AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(next)).catch((error) =>
      console.warn('[SettingsContext] Failed to persist settings:', error?.message)
    );
  };

  const toggleSetting = useCallback((key) => {
    setSettings((prev) => {
      const next = { ...prev, toggles: { ...prev.toggles, [key]: !prev.toggles[key] } };
      persist(next);
      return next;
    });
  }, []);

  const setFeedPref = useCallback((key) => {
    setSettings((prev) => {
      const next = { ...prev, feedPref: key };
      persist(next);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded, toggleSetting, setFeedPref }}>
      {children}
    </SettingsContext.Provider>
  );
};
