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
  APP_NAME: 'TripTape',
  DEFAULT_DEMO_VIDEO: ENV.DEFAULT_DEMO_VIDEO,
};

/**
 * Centralized AsyncStorage Keys
 * Using constants prevents typos across files when saving/retrieving local data.
 */
export const STORAGE_KEYS = {
  // Legacy plain-text token keys: only read to wipe them. Tokens are in SecureStore (api/tokenStore).
  AUTH_TOKEN: 'triptape_token',
  REFRESH_TOKEN: 'triptape_refresh_token',
  USER_INFO: 'triptape_user_info',
  APP_SETTINGS: 'triptape_app_settings',
  THEME_MODE: 'triptape_theme_mode',
  EXPLORE_RECENTS: 'triptape_explore_recents',
  COMMUNITIES: 'triptape_communities',
  AGENCY_PROFILES: 'triptape_agency_profiles',
  TRIP_LEDGER: 'triptape_trip_ledger',
};
