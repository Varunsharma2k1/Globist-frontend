import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG, STORAGE_KEYS } from '../config';

/**
 * Axios HTTP Client Instance
 *
 * Configured with centralized base URL, request timeout, and an automated request interceptor
 * that attaches JWT Authorization Bearer tokens to every outgoing API request.
 */
const client = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token from AsyncStorage if available
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API Client] Error reading auth token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Basic error logger for developer convenience
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : 'NETWORK_ERROR';
    console.warn(`[API Client Error ${status}]:`, error.message);
    return Promise.reject(error);
  }
);

export default client;
