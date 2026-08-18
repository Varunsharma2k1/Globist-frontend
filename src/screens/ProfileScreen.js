// Re-export shim: ProfileScreen now lives in src/features/profile/ (see
// that folder for the screen split into data + sub-components). Kept here
// so existing `from '../screens/ProfileScreen'` imports keep working.
export { default } from '../features/profile/screens/ProfileScreen';
