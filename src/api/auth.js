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
 * Exchanges a Google ID token for our own session (creates the account on first use).
 * @param {string} idToken
 */
export const loginWithGoogleToken = async (idToken) => {
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

/** Ends this device's session on the server. */
export const logoutSession = (refreshToken) =>
  client.post('/auth/logout', { refreshToken }, { skipAuth: true });

/** Ends every session of this account, on all devices. */
export const logoutAllSessions = () => client.post('/auth/logout-all');

/** Signed-in devices: [{ _id, device: { platform, name }, lastUsedAt, current }] */
export const getSessions = async () => (await client.get('/auth/sessions')).data.sessions;

/** Signs out one device. */
export const revokeSession = (sessionId) => client.delete(`/auth/sessions/${sessionId}`);

/** Emails a 6-digit reset code (the reply is the same whether or not the account exists). */
export const requestPasswordReset = async (email) =>
  (await client.post('/auth/password/forgot', { email }, { skipAuth: true })).data;

/** Sets a new password with the emailed code; signs out all devices and starts a new session. */
export const resetPasswordWithCode = async ({ email, code, newPassword }) =>
  toSession(
    (await client.post('/auth/password/reset', { email, code, newPassword }, { skipAuth: true }))
      .data
  );

/** Signed-in password change; other devices are signed out. */
export const changePassword = async ({ currentPassword, newPassword }) =>
  (await client.post('/auth/password/change', { currentPassword, newPassword })).data;

/** Updates name / bio / location (server validates lengths). */
export const updateProfile = async (fields) =>
  normalizeUser((await client.put('/users/profile', fields)).data);

/** Permanently deletes the account. Re-auth: { password } or, for Google-only accounts, { confirm: 'DELETE' }. */
export const deleteMyAccount = (body) => client.delete('/users/me', { data: body });
