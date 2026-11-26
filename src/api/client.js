import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { CONFIG } from '../config';
import * as tokenStore from './tokenStore';

/**
 * Axios HTTP Client Instance
 *
 * Attaches a fresh access token to every request (see tokenStore) and, if the
 * server still says TOKEN_EXPIRED, refreshes once and retries. A request
 * rejected with SESSION_INVALID (revoked / signed out elsewhere) ends the
 * local session; the app falls back to guest browsing.
 */
const client = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    // Shown in "signed-in devices"; not used for security decisions.
    'X-Client-Platform': Platform.OS,
    'X-Device-Name': String(Constants.deviceName || Platform.OS).slice(0, 80),
  },
});

client.interceptors.request.use(async (config) => {
  if (!config.skipAuth) {
    const token = await tokenStore.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  const code = response?.data?.code;
  if (response?.status === 401 && config && !config.skipAuth && config.headers?.Authorization) {
    if (code === 'TOKEN_EXPIRED' && !config._retried) {
      try {
        const token = await tokenStore.refreshNow();
        config._retried = true;
        config.headers.Authorization = `Bearer ${token}`;
        return client(config);
      } catch {
        // fall through: refresh failed (offline or session over)
      }
    } else if (code === 'SESSION_INVALID') {
      await tokenStore.sessionRejected();
    }
  }
  return Promise.reject(error);
});

// Error logger for developer convenience (never logs tokens).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : 'NETWORK_ERROR';
    const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
    console.warn(`[API Client Error ${status}] ${url}:`, error.message);
    return Promise.reject(error);
  }
);

export default client;
