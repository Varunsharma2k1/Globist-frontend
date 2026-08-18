import client from './client';
import { normalizeUser } from './normalize';

/**
 * Authentication Service Module
 *
 * Encapsulates all backend authentication requests. Junior developers can easily add new auth methods
 * (e.g., password reset, OAuth) here without touching screen components or contexts.
 */

/**
 * Authenticates user with phone number and password.
 * @param {string} phone
 * @param {string} password
 * @returns {Promise<{token: string, user: Object}>}
 */
export const loginUser = async (phone, password) => {
  const response = await client.post('/auth/login', { phone, password });
  return { ...response.data, user: normalizeUser(response.data.user) };
};

/**
 * Registers a new user account.
 * @param {Object} userData - User details ({ name, phone, password, role })
 * @returns {Promise<{token: string, user: Object}>}
 */
export const signupUser = async (userData) => {
  const response = await client.post('/auth/signup', userData);
  return { ...response.data, user: normalizeUser(response.data.user) };
};

/**
 * Fetches current authenticated user profile using stored JWT token.
 * @returns {Promise<Object>} User profile object
 */
export const getCurrentUser = async () => {
  const response = await client.get('/users/profile');
  return normalizeUser(response.data);
};
