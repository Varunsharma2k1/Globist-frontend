import { ENV } from './env';

/**
 * Centralized Application Configuration
 *
 * App-level constants derived from validated env vars (see `src/config/env.js`)
 * plus static values that aren't environment-dependent (storage keys, app
 * name). Screens/services should import from here, not from `env.js`
 * directly, unless they need a raw env value with no app-level wrapping.
 */
export const CONFIG = {
  API_BASE_URL: ENV.API_BASE_URL,
  API_TIMEOUT: ENV.API_TIMEOUT,
  APP_NAME: 'Globist',
  DEFAULT_DEMO_VIDEO: ENV.DEFAULT_DEMO_VIDEO,
};

/**
 * Centralized AsyncStorage Keys
 * Using constants prevents typos across files when saving/retrieving local data.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'globist_token',
  USER_INFO: 'globist_user_info',
  APP_SETTINGS: 'globist_app_settings',
  THEME_MODE: 'globist_theme_mode',
};
