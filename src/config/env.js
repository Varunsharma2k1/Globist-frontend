import { Platform } from 'react-native';
import Constants from 'expo-constants';

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
 * API base URL resolution (first match wins):
 *   1. EXPO_PUBLIC_API_URL — explicit URL. Required for staging/production
 *      builds; optional locally (use it to point at a remote/staging API).
 *   2. Development only — auto-detected from the Metro dev server's host.
 *      The device loaded the JS bundle from Metro, so that host is reachable
 *      from the device; the backend is assumed to run on the same machine at
 *      EXPO_PUBLIC_API_PORT / EXPO_PUBLIC_API_PATH. This follows the dev
 *      machine's LAN IP automatically, so no IP is hardcoded anywhere.
 *   3. Otherwise startup fails with an explicit error — no silent fallback to
 *      a stale address.
 *
 * @typedef {Object} Env
 * @property {string} API_BASE_URL   Base URL for all backend HTTP requests.
 * @property {'env'|'metro'} API_BASE_URL_SOURCE  Where API_BASE_URL came from.
 * @property {number} API_TIMEOUT    Request timeout in milliseconds.
 * @property {string} APP_ENV        'development' | 'production'.
 * @property {string} DEFAULT_DEMO_VIDEO  Fallback reel video URL used when a
 *   post has no uploaded media (e.g. seeded/demo content).
 * @property {string} GOOGLE_WEB_CLIENT_ID  Web OAuth client ID for Google sign-in.
 * @property {string} PLATFORM       'ios' | 'android' | 'web'.
 */

const DEFAULTS = Object.freeze({
  API_PORT: 5001,
  API_PATH: '/api',
  API_TIMEOUT_MS: 10000,
  DEMO_VIDEO:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
});

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Takes the raw value rather than a variable name: Expo only inlines
// statically written `process.env.EXPO_PUBLIC_*` references, so dynamic
// `process.env[name]` lookups would always be undefined in the app.
function readPositiveNumber(name, raw, fallback) {
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`[env] ${name} must be a positive number, got: "${raw}"`);
  }
  return value;
}

/**
 * Host of the Metro dev server the app was loaded from, or null. Expo exposes
 * it in different fields depending on SDK/runtime (Expo Go vs dev client),
 * either as "host:port" or as a full exp:// / http:// URL.
 * @returns {string|null}
 */
function getMetroHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    Constants.experienceUrl,
    Constants.linkingUri,
  ];
  for (const value of candidates) {
    if (typeof value !== 'string' || !value) continue;
    const host = value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').split(/[:/?#]/)[0];
    // Loopback only works on simulators/emulators with port forwarding, so
    // keep looking for a LAN address a physical device can actually reach.
    if (host && !LOOPBACK_HOSTS.has(host)) return host;
  }
  return null;
}

/**
 * @returns {{ url: string, source: 'env'|'metro' }}
 */
function resolveApiBaseUrl() {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) {
    if (!isValidUrl(explicit)) {
      throw new Error(`[env] EXPO_PUBLIC_API_URL is not a valid URL: "${explicit}"`);
    }
    return { url: explicit.replace(/\/+$/, ''), source: 'env' };
  }

  if (__DEV__) {
    const host = getMetroHost();
    if (host) {
      const port = readPositiveNumber(
        'EXPO_PUBLIC_API_PORT',
        process.env.EXPO_PUBLIC_API_PORT,
        DEFAULTS.API_PORT
      );
      const path = process.env.EXPO_PUBLIC_API_PATH || DEFAULTS.API_PATH;
      return { url: `http://${host}:${port}${path}`, source: 'metro' };
    }
  }

  throw new Error(
    '[env] Could not determine the API URL. Set EXPO_PUBLIC_API_URL ' +
      '(required for production builds; see .env.example).'
  );
}

/**
 * Builds and validates the env object once at module load. Throws early
 * (at app startup, not mid-request) if a configured value is malformed, so
 * misconfiguration is loud instead of surfacing as a mysterious network
 * failure later.
 * @returns {Env}
 */
function buildEnv() {
  const api = resolveApiBaseUrl();
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production');

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(
      `[env] API_BASE_URL = ${api.url} (source: ${api.source === 'env' ? 'EXPO_PUBLIC_API_URL' : 'Metro host'})`
    );
  }

  return Object.freeze({
    API_BASE_URL: api.url,
    API_BASE_URL_SOURCE: api.source,
    API_TIMEOUT: readPositiveNumber(
      'EXPO_PUBLIC_API_TIMEOUT_MS',
      process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
      DEFAULTS.API_TIMEOUT_MS
    ),
    APP_ENV: appEnv,
    DEFAULT_DEMO_VIDEO: process.env.EXPO_PUBLIC_DEFAULT_DEMO_VIDEO || DEFAULTS.DEMO_VIDEO,
    // Web OAuth client ID from Google Cloud; the server checks tokens against it.
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || '',
    PLATFORM: Platform.OS,
  });
}

/** @type {Env} */
export const ENV = buildEnv();
