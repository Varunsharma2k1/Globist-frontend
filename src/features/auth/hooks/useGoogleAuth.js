import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { CONFIG } from '../../../config';

// Completes the auth session when the OS hands control back to the app.
WebBrowser.maybeCompleteAuthSession();

// expo-auth-session throws if a platform's client id is missing, so unset ids
// get a placeholder; `configured` tells the UI whether Google is really usable.
const PLACEHOLDER = 'unconfigured';

// Google rejects Expo Go's redirect ("Access blocked"), so real Google
// sign-in only works in a development/production build.
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const CLIENT_ID_FOR_PLATFORM = {
  ios: CONFIG.GOOGLE_IOS_CLIENT_ID,
  android: CONFIG.GOOGLE_ANDROID_CLIENT_ID,
  web: CONFIG.GOOGLE_WEB_CLIENT_ID,
};

/**
 * Wraps Google's OAuth flow. `signIn()` opens the Google account chooser and
 * resolves with a Google ID token (to be exchanged with our backend), or
 * rejects if the user cancels / Google returns an error.
 */
export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: CONFIG.GOOGLE_IOS_CLIENT_ID || PLACEHOLDER,
    androidClientId: CONFIG.GOOGLE_ANDROID_CLIENT_ID || PLACEHOLDER,
    webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID || PLACEHOLDER,
  });

  const configured = !IS_EXPO_GO && Boolean(CLIENT_ID_FOR_PLATFORM[Platform.OS]);
  const pending = useRef(null);

  useEffect(() => {
    if (!response || !pending.current) return;
    const { resolve, reject } = pending.current;
    if (response.type === 'success') {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (idToken) {
        resolve(idToken);
      } else {
        reject(new Error('Google did not return an ID token'));
      }
    } else if (response.type === 'error') {
      reject(response.error || new Error('Google sign-in failed'));
    } else {
      reject(Object.assign(new Error('Google sign-in cancelled'), { cancelled: true }));
    }
    pending.current = null;
  }, [response]);

  const signIn = () =>
    new Promise((resolve, reject) => {
      pending.current = { resolve, reject };
      promptAsync().catch((err) => {
        pending.current = null;
        reject(err);
      });
    });

  return { configured, isExpoGo: IS_EXPO_GO, ready: configured && Boolean(request), signIn };
}
