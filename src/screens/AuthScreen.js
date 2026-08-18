// Re-export shim: AuthScreen now lives in src/features/auth/ (see that
// folder for the screen split into hooks + sub-components). Kept here so
// existing `from '../screens/AuthScreen'` imports keep working unchanged.
export { default } from '../features/auth/screens/AuthScreen';
