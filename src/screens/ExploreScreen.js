// Re-export shim: ExploreScreen now lives in src/features/explore/ (see
// that folder for the screen split into hooks + sub-components). Kept here
// so existing `from '../screens/ExploreScreen'` imports keep working.
export { default } from '../features/explore/screens/ExploreScreen';
