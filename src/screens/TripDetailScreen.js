// Re-export shim: TripDetailScreen now lives in src/features/tripDetail/
// (see that folder for the screen split into hooks + sub-components). Kept
// here so existing `from '../screens/TripDetailScreen'` imports keep working.
export { default } from '../features/tripDetail/screens/TripDetailScreen';
