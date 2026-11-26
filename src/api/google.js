import { ENV } from '../config/env';

/**
 * Native Google sign-in (@react-native-google-signin). The module is native
 * code, so it exists only in a development/production build, not in Expo Go;
 * it's required lazily so the rest of the app still runs in Expo Go.
 */
let configured = false;

function loadModule() {
  try {
    // eslint-disable-next-line global-require
    return require('@react-native-google-signin/google-signin');
  } catch {
    return null;
  }
}

export class GoogleSignInError extends Error {}

/** Opens the Google account picker. Returns an ID token, or null if cancelled. */
export async function getGoogleIdToken() {
  const mod = loadModule();
  if (!mod?.GoogleSignin) {
    throw new GoogleSignInError('Google sign-in needs the development build (it does not work in Expo Go).');
  }
  if (!ENV.GOOGLE_WEB_CLIENT_ID) {
    throw new GoogleSignInError('Google sign-in is not configured (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID).');
  }
  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = mod;
  if (!configured) {
    GoogleSignin.configure({ webClientId: ENV.GOOGLE_WEB_CLIENT_ID });
    configured = true;
  }
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const res = await GoogleSignin.signIn();
    if (!isSuccessResponse(res)) return null; // user closed the sheet
    if (!res.data.idToken) throw new GoogleSignInError('Google did not return an ID token.');
    return res.data.idToken;
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.IN_PROGRESS) return null;
    if (isErrorWithCode(e) && e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new GoogleSignInError('Google Play services is not available on this device.');
    }
    throw e;
  }
}

/** Clears the cached Google account so the picker shows again next time. */
export async function signOutGoogle() {
  const mod = loadModule();
  if (!mod?.GoogleSignin || !configured) return;
  try {
    await mod.GoogleSignin.signOut();
  } catch {
    // not signed in with Google
  }
}
