import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, buildShadow, buildTypography } from '../theme';
import { STORAGE_KEYS } from '../config';

/**
 * Global Theme Context
 *
 * Drives Light / Dark / System appearance across the app. "System" tracks
 * the OS appearance live via useColorScheme(); Light/Dark pin a fixed
 * palette regardless of OS setting. Persisted so the choice survives restarts.
 */
export const ThemeContext = createContext();

const THEME_MODES = ['light', 'dark', 'system'];

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (stored && THEME_MODES.includes(stored)) {
          setModeState(stored);
        }
      } catch (error) {
        console.warn('[ThemeContext] Failed to load theme mode:', error?.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setMode = useCallback((next) => {
    if (!THEME_MODES.includes(next)) return;
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, next).catch((error) =>
      console.warn('[ThemeContext] Failed to persist theme mode:', error?.message)
    );
  }, []);

  const resolvedScheme = mode === 'system' ? systemScheme || 'light' : mode;
  const colors = resolvedScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const value = useMemo(
    () => ({
      mode, // 'light' | 'dark' | 'system'
      resolvedScheme, // 'light' | 'dark' — what's actually being shown right now
      colors,
      shadow: buildShadow(colors),
      typography: buildTypography(colors),
      setMode,
      loaded,
    }),
    [mode, resolvedScheme, colors, setMode, loaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
