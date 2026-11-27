import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';
import {
  loginUser,
  signupUser,
  setAccountType,
  getCurrentUser,
  loginWithGoogleToken,
  logoutSession,
  logoutAllSessions,
  resetPasswordWithCode,
} from '../api/auth';
import { getGoogleIdToken, signOutGoogle } from '../api/google';
import * as tokenStore from '../api/tokenStore';

/**
 * Global Authentication Context & State Provider
 *
 * Manages the active user session and the auth actions: email login/signup,
 * Google, one-time account type selection and logout. Tokens live only in
 * tokenStore (encrypted SecureStore); AsyncStorage keeps just the cached,
 * non-secret user profile. Screens never touch tokens.
 *
 * Users stay signed in for months: the access token is renewed silently and
 * the session only ends on logout, after ~90 days unused, or when the server
 * revokes it (logout everywhere, stolen-token detection) — then the app
 * quietly returns to guest browsing.
 *
 * Nobody has to sign in to open the app: without a session the user is an
 * in-memory guest (`{ isGuest: true }`, never persisted) who can browse
 * everything and is asked to sign in only to book or post (see
 * useRequireAuth). Logging out returns to guest.
 *
 * "Continue with Google" opens the native Google account sheet, then the
 * server verifies the ID token and returns our own JWT session.
 */
export const AuthContext = createContext();

const GUEST_USER = { _id: 'guest', name: 'Guest', role: 'traveler', isGuest: true };
// Pre-SecureStore builds kept tokens here in plain text; wiped on launch.
const LEGACY_TOKEN_KEYS = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
    // Server ended the session (revoked, expired, signed out elsewhere).
    return tokenStore.onSessionExpired(() => {
      AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO).catch(() => {});
      setUser(GUEST_USER);
    });
  }, []);

  const clearSession = async () => {
    await tokenStore.clear();
    await AsyncStorage.multiRemove([...LEGACY_TOKEN_KEYS, STORAGE_KEYS.USER_INFO]);
    setUser(GUEST_USER);
  };

  /**
   * Restores the cached session on app launch, then re-validates it against
   * the backend in the background so a deleted account / expired token
   * signs the user out instead of leaving a stale session.
   */
  const loadUserSession = async () => {
    try {
      AsyncStorage.multiRemove(LEGACY_TOKEN_KEYS).catch(() => {});
      await tokenStore.load();
      const cachedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
      if (tokenStore.hasSession() && cachedUser) {
        setUser(JSON.parse(cachedUser));
        refreshUser();
      } else {
        await clearSession();
      }
    } catch (error) {
      console.warn('[AuthContext] Session restore failed, clearing session:', error?.message);
      await clearSession();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const fresh = await getCurrentUser();
      // Keep the lightweight login-shaped user (wishlist as ids, not populated).
      const { wishlist, ...rest } = fresh;
      setUser((prev) => {
        const next = { ...prev, ...rest };
        AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(next)).catch(() => {});
        return next;
      });
    } catch {
      // Offline: keep the cached session. A dead session is handled by
      // tokenStore.onSessionExpired, never by a single failed request.
    }
  };

  const persistSession = async ({ token, refreshToken, user: userData }) => {
    await tokenStore.save({ token, refreshToken });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => persistSession(await loginUser(email, password));

  const signup = async ({ name, email, password }) =>
    persistSession(await signupUser({ name, email, password }));

  /**
   * Google sign-in. Resolves to null if the user closed the account sheet.
   */
  const loginWithGoogle = async () => {
    const idToken = await getGoogleIdToken();
    if (!idToken) return null;
    return persistSession(await loginWithGoogleToken(idToken));
  };

  /**
   * Saves the traveller / creator / agency choice for a brand-new account,
   * which also dismisses the account-type prompt.
   */
  const selectAccountType = async (role) => {
    const updated = await setAccountType(role);
    const next = { ...user, ...updated };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(next));
    setUser(next);
    return next;
  };

  /** Signs out this device: the server revokes the session, then local wipe. */
  const logout = async () => {
    const refreshToken = tokenStore.getRefreshToken();
    if (refreshToken) await logoutSession(refreshToken).catch(() => {}); // offline: still sign out locally
    await signOutGoogle();
    await clearSession();
  };

  /** Merges profile changes into the session (memory + cached user info). */
  const updateUser = async (partial) => {
    const next = { ...user, ...partial };
    setUser(next);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(next)).catch(() => {});
  };

  /** Forgot-password: new password + emailed code. Signs this device in. */
  const resetPassword = async ({ email, code, newPassword }) =>
    persistSession(await resetPasswordWithCode({ email, code, newPassword }));

  /** Signs out every device (e.g. after a lost phone). */
  const logoutAllDevices = async () => {
    await logoutAllSessions();
    await signOutGoogle();
    await clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        selectAccountType,
        logout,
        logoutAllDevices,
        resetPassword,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
