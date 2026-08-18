// Re-export shim: BookingScreen now lives in src/features/booking/ (see
// that folder for the screen split into hooks + sub-components). Kept here
// so existing `from '../screens/BookingScreen'` imports keep working.
export { default } from '../features/booking/screens/BookingScreen';
