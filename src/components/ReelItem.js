// Re-export shim: ReelItem now lives in src/features/reels/ (see that
// folder for the component split into hooks + sub-components). Kept here so
// existing `from '../components/ReelItem'` imports keep working unchanged.
export { default } from '../features/reels/components/ReelItem';
