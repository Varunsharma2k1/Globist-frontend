import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook: useAuth
 *
 * Provides quick access to authentication state and auth methods (login, signup, logout).
 *
 * Usage example for junior developers:
 * ```js
 * const { user, login, logout, loading } = useAuth();
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
