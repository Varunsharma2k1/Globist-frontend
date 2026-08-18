// Re-export shim: InboxScreen now lives in src/features/inbox/ (see that
// folder for the screen split into data + sub-components). Kept here so
// existing `from '../screens/InboxScreen'` imports keep working unchanged.
export { default } from '../features/inbox/screens/InboxScreen';
