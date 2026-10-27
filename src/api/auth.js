import client from './client';
import { normalizeUser } from './normalize';

/**
 * Authentication Service Module
 *
 * Encapsulates all backend authentication requests. Every call that starts a
 * session resolves to `{ token, refreshToken, user }` with a normalized user.
 */

const toSession = (data) => ({ ...data, user: normalizeUser(data.user) });

/**
 * Signs in with email and password.
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return toSession(response.data);
};

/**
 * Registers a new account. The role is chosen afterwards (see setAccountType).
 * @param {{name: string, email: string, password: string}} userData
 */
export const signupUser = async (userData) => {
  const response = await client.post('/auth/signup', userData);
  return toSession(response.data);
};

/**
 * Exchanges a Google ID token for a Triptape session (creates the account on
 * first use).
 * @param {string} idToken
 */
export const googleLoginUser = async (idToken) => {
  const response = await client.post('/auth/google', { idToken });
  return toSession(response.data);
};

/**
 * Saves the one-time account type choice for a newly created account.
 * @param {'traveler'|'creator'|'agency'} role
 * @returns {Promise<Object>} Updated user
 */
export const setAccountType = async (role) => {
  const response = await client.patch('/auth/account-type', { role });
  return normalizeUser(response.data.user);
};

/**
 * Fetches current authenticated user profile using stored JWT token.
 * @returns {Promise<Object>} User profile object
 */
export const getCurrentUser = async () => {
  const response = await client.get('/users/profile');
  return normalizeUser(response.data);
};
