// Re-export shim: ReelsScreen now lives in src/features/reels/ (see that
// folder for the screen split into hooks + sub-components). Kept here so
// existing `from '../screens/ReelsScreen'` imports keep working unchanged.
export { default } from '../features/reels/screens/ReelsScreen';
