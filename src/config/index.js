import { Platform } from 'react-native';

/**
 * Centralized Application Configuration
 *
 * All environment variables, API endpoints, storage keys, and constant values
 * are stored here. Junior developers can easily update API base URLs or app settings
 * in one single file without touching screen components or API logic.
 */

const getApiBaseUrl = () => {
  // Allow overriding via Expo environment variable (EXPO_PUBLIC_API_URL)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Standard development host selection
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }

  // Default IP for iOS Simulator / Web / Local Wi-Fi testing
  return 'http://192.168.29.4:5001/api';
};

export const CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  API_TIMEOUT: 10000, // 10 seconds timeout for HTTP requests
  APP_NAME: 'Globist',
  DEFAULT_DEMO_VIDEO:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

/**
 * Centralized AsyncStorage Keys
 * Using constants prevents typos across files when saving/retrieving local data.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'globist_token',
  USER_INFO: 'globist_user_info',
};
