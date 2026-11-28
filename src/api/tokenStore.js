import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../config';

/**
 * Holds the session tokens and keeps the access token fresh.
 *
 * - Tokens live in SecureStore (Android Keystore / iOS Keychain), encrypted
 *   and readable only by this app — never in AsyncStorage.
 * - The access token is short-lived (~15 min). `getAccessToken()` renews it
 *   shortly before expiry with the refresh token, so users stay signed in
 *   for months without noticing.
 * - Each refresh returns a NEW refresh token; the old one dies on the server.
 *   Only one refresh runs at a time (concurrent callers share it), otherwise
 *   the server would see the old token reused and revoke the session.
 * - If the server rejects the refresh token, the session is over: tokens are
 *   wiped and `onSessionExpired` listeners fire (AuthContext -> guest).
 *   Network failures do NOT sign the user out.
 */

const KEYS = { access: 'triptape.accessToken', refresh: 'triptape.refreshToken' };
const SECURE_OPTS = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY };
const RENEW_BEFORE_MS = 60 * 1000;

let access = null;
let refresh = null;
let accessExpMs = 0;
let loaded = false;
let inflight = null;
const expiredListeners = new Set();

// Bare axios (not the shared client) so refreshing never recurses through its interceptors.
const raw = axios.create({ baseURL: CONFIG.API_BASE_URL, timeout: CONFIG.API_TIMEOUT });

function decodeExpMs(jwt) {
  try {
    const part = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(
      global.atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '='))
    );
    return json.exp ? json.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

function setAccess(token) {
  access = token || null;
  accessExpMs = token ? decodeExpMs(token) : 0;
}

export async function load() {
  if (loaded) return;
  try {
    const [a, r] = await Promise.all([
      SecureStore.getItemAsync(KEYS.access),
      SecureStore.getItemAsync(KEYS.refresh),
    ]);
    setAccess(a);
    refresh = r;
  } catch {
    // Keystore unreadable (e.g. restored onto a new device): start signed out.
    setAccess(null);
    refresh = null;
  }
  loaded = true;
}

export async function save({ token, refreshToken }) {
  setAccess(token);
  refresh = refreshToken || null;
  loaded = true;
  await Promise.all([
    SecureStore.setItemAsync(KEYS.access, token, SECURE_OPTS),
    refreshToken
      ? SecureStore.setItemAsync(KEYS.refresh, refreshToken, SECURE_OPTS)
      : SecureStore.deleteItemAsync(KEYS.refresh),
  ]);
}

export async function clear() {
  setAccess(null);
  refresh = null;
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.access).catch(() => {}),
    SecureStore.deleteItemAsync(KEYS.refresh).catch(() => {}),
  ]);
}

export const hasSession = () => Boolean(refresh || access);
export const getRefreshToken = () => refresh;

export function onSessionExpired(fn) {
  expiredListeners.add(fn);
  return () => expiredListeners.delete(fn);
}

async function expire() {
  await clear();
  expiredListeners.forEach((fn) => fn());
}

/** Swaps the refresh token for a new pair. Shared by concurrent callers. */
export function refreshNow() {
  if (!refresh) return Promise.reject(new Error('no session'));
  if (!inflight) {
    const sent = refresh;
    inflight = raw
      .post('/auth/refresh', { refreshToken: sent })
      .then(async ({ data }) => {
        await save(data);
        return data.token;
      })
      .catch(async (err) => {
        const status = err.response?.status;
        // Only a definite "no" from the server ends the session.
        if ((status === 401 || status === 403) && refresh === sent) await expire();
        throw err;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** A valid access token, renewed if it is about to expire. Null for guests. */
export async function getAccessToken() {
  await load();
  if (!access && !refresh) return null;
  if (access && accessExpMs - Date.now() > RENEW_BEFORE_MS) return access;
  if (!refresh) return access;
  try {
    return await refreshNow();
  } catch {
    return access; // offline: try the old one; the server decides
  }
}

/** Called when the server says the session is gone (revoked elsewhere, etc.). */
export const sessionRejected = expire;
