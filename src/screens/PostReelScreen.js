// Re-export shim: PostReelScreen now lives in src/features/postReel/ (see
// that folder for the screen split into hooks + sub-components). Kept here
// so existing `from '../screens/PostReelScreen'` imports keep working.
// Also fixes a latent bug from an earlier pass: the old file's getStyles()
// referenced `typography.body` without `typography` ever being passed in,
// which would have thrown a ReferenceError as soon as this screen rendered.
export { default } from '../features/postReel/screens/PostReelScreen';
