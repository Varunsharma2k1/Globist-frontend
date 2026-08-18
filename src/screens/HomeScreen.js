// Re-export shim: HomeScreen now lives in src/features/home/ (see that
// folder for the screen split into hooks + sub-components). Kept here so
// existing `from '../screens/HomeScreen'` imports keep working unchanged.
export { default } from '../features/home/screens/HomeScreen';
