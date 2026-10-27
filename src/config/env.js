import { Platform } from 'react-native';

/**
 * Typed, validated access to environment variables.
 *
 * Expo's CLI automatically loads `.env` / `.env.local` / `.env.development` /
 * `.env.production` at build time and inlines any `EXPO_PUBLIC_*` var into
 * `process.env` — no extra plugin (react-native-config, dotenv, etc.) needed.
 * See `.env.example` for the full list of variables this app recognizes.
 *
 * Nothing outside this file should read `process.env` directly — import
 * `ENV` instead, so every consumer gets a validated, typed value with a
 * single documented source of truth.
 *
 * @typedef {Object} Env
 * @property {string} API_BASE_URL   Base URL for all backend HTTP requests.
 * @property {number} API_TIMEOUT    Request timeout in milliseconds.
 * @property {string} APP_ENV        'development' | 'production'.
 * @property {string} DEFAULT_DEMO_VIDEO  Fallback reel video URL used when a
 *   post has no uploaded media (e.g. seeded/demo content).
 * @property {string} GOOGLE_WEB_CLIENT_ID      Google OAuth web client ID ('' if unset).
 * @property {string} GOOGLE_IOS_CLIENT_ID      Google OAuth iOS client ID ('' if unset).
 * @property {string} GOOGLE_ANDROID_CLIENT_ID  Google OAuth Android client ID ('' if unset).
 */

// Fallback used only in local development when EXPO_PUBLIC_API_URL isn't
// set. Physical devices/simulators need the host machine's LAN IP here —
// NOT `10.0.2.2` (Android emulator's loopback alias), since that only
// resolves on emulators, not real phones.
const DEV_API_BASE_URL_FALLBACK = 'http://192.168.29.4:5001/api';

const DEFAULT_DEMO_VIDEO_FALLBACK =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds and validates the env object once at module load. Throws early
 * (at app startup, not mid-request) if a configured value is malformed, so
 * misconfiguration is loud instead of surfacing as a mysterious network
 * failure later.
 * @returns {Env}
 */
function buildEnv() {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || DEV_API_BASE_URL_FALLBACK;
  if (!isValidUrl(apiBaseUrl)) {
    throw new Error(
      `[env] EXPO_PUBLIC_API_URL is not a valid URL: "${apiBaseUrl}". ` +
        'Set it in .env.local or fix the fallback in src/config/env.js.'
    );
  }

  const apiTimeoutRaw = process.env.EXPO_PUBLIC_API_TIMEOUT_MS;
  const apiTimeout = apiTimeoutRaw ? Number(apiTimeoutRaw) : 10000;
  if (!Number.isFinite(apiTimeout) || apiTimeout <= 0) {
    throw new Error(
      `[env] EXPO_PUBLIC_API_TIMEOUT_MS must be a positive number, got: "${apiTimeoutRaw}"`
    );
  }

  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production');

  return Object.freeze({
    API_BASE_URL: apiBaseUrl,
    API_TIMEOUT: apiTimeout,
    APP_ENV: appEnv,
    DEFAULT_DEMO_VIDEO: process.env.EXPO_PUBLIC_DEFAULT_DEMO_VIDEO || DEFAULT_DEMO_VIDEO_FALLBACK,
    // Google OAuth client IDs (Google Cloud Console). All optional: Google
    // sign-in stays disabled until the one for the current platform is set.
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
    PLATFORM: Platform.OS,
  });
}

/** @type {Env} */
export const ENV = buildEnv();
