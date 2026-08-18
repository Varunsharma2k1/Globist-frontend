import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, loginUser, signupUser } from '../api';
import { STORAGE_KEYS } from '../config';

/**
 * Global Authentication Context & State Provider
 *
 * Manages active user session, token storage, and authentication actions (login, signup, logout).
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
  }, []);

  /**
   * Restores user session from stored JWT token on application launch.
   */
  const loadUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.warn('[AuthContext] Session restore failed, clearing token:', error?.message);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs user in and persists authorization token.
   */
  const login = async (phone, password) => {
    const data = await loginUser(phone, password);
    const { token, user: userData } = data;
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setUser(userData);
    return userData;
  };

  /**
   * Registers a new user account and persists authorization token.
   */
  const signup = async (signupData) => {
    const data = await signupUser(signupData);
    const { token, user: userData } = data;
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setUser(userData);
    return userData;
  };

  /**
   * Logs out current user and clears session state.
   */
  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
