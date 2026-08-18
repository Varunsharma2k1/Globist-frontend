// Re-export shim: SettingsScreen now lives in src/features/settings/ (see
// that folder for the screen split into hooks + sub-components). Kept here
// so existing `from '../screens/SettingsScreen'` imports keep working.
export { default } from '../features/settings/screens/SettingsScreen';
