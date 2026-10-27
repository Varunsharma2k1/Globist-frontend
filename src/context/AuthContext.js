import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';
import {
  loginUser,
  signupUser,
  googleLoginUser,
  setAccountType,
  getCurrentUser,
} from '../api/auth';

/**
 * Global Authentication Context & State Provider
 *
 * Manages the active user session (JWT + cached user in AsyncStorage) and the
 * auth actions: email login/signup, Google sign-in, one-time account type
 * selection and logout. Screens never touch tokens directly.
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
  }, []);

  const clearSession = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_INFO,
    ]);
    setUser(null);
  };

  /**
   * Restores the cached session on app launch, then re-validates it against
   * the backend in the background so a deleted account / expired token
   * signs the user out instead of leaving a stale session.
   */
  const loadUserSession = async () => {
    try {
      const [token, cachedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_INFO),
      ]);
      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
        refreshUser();
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
    } catch (error) {
      if (error.response?.status === 401) await clearSession();
      // Network errors: keep the cached session so the app still opens offline.
    }
  };

  const persistSession = async ({ token, refreshToken, user: userData }) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.AUTH_TOKEN, token],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken || ''],
      [STORAGE_KEYS.USER_INFO, JSON.stringify(userData)],
    ]);
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => persistSession(await loginUser(email, password));

  const signup = async ({ name, email, password }) =>
    persistSession(await signupUser({ name, email, password }));

  const loginWithGoogle = async (idToken) => persistSession(await googleLoginUser(idToken));

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

  const logout = clearSession;

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
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
