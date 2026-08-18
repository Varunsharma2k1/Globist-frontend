import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';

/**
 * Global Authentication Context & State Provider
 *
 * Manages active user session, token storage, and authentication actions (login, signup, logout).
 *
 * NOTE: `login`/`signup`/`loginWithGoogle` are placeholders — they don't call
 * the real backend yet, just build a local dummy user from whatever was
 * entered and persist it, so the rest of the app (route guarding, Profile
 * screen, etc.) can be built against a real session shape now. Swap these
 * for real `loginUser`/`signupUser`/Google OAuth calls once that's wired up.
 */
export const AuthContext = createContext();

const buildDummyUser = (overrides = {}) => ({
  _id: `dummy-${Date.now()}`,
  name: 'Varun Sharma',
  role: 'traveler',
  explorerTier: 'Gold',
  avatar: '',
  stats: { reelsPosted: 3, tripsBooked: 2, earnings: 1450 },
  ...overrides,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
  }, []);

  /**
   * Restores the dummy session cached in AsyncStorage on app launch.
   */
  const loadUserSession = async () => {
    try {
      const [token, cachedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_INFO),
      ]);
      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } catch (error) {
      console.warn('[AuthContext] Session restore failed, clearing session:', error?.message);
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_INFO]);
    } finally {
      setLoading(false);
    }
  };

  const persistSession = async (userData) => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `dummy-token-${userData._id}`);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  /**
   * Dummy sign-in: accepts any non-empty phone/password and starts a
   * session. Params are intentionally unused for now — kept in the
   * signature so call sites don't need to change once this calls a real
   * login API.
   */
  const login = async (_phone, _password) => {
    return persistSession(buildDummyUser());
  };

  /**
   * Dummy sign-up: accepts any non-empty fields and starts a session.
   */
  const signup = async ({ name, role }) => {
    return persistSession(buildDummyUser({ name, role: role || 'traveler' }));
  };

  /**
   * Dummy Google sign-in: no OAuth yet, just starts a session immediately.
   */
  const loginWithGoogle = async () => {
    return persistSession(buildDummyUser());
  };

  /**
   * Logs out current user and clears session state.
   */
  const logout = async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_INFO]);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginWithGoogle, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
