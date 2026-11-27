import * as Haptics from 'expo-haptics';

/**
 * The ONLY place the app triggers haptics, so the rules live in one spot:
 *
 *   haptics.select()   light tick — tabs, segmented controls, toggles, votes
 *   haptics.tap()      button presses (primary actions)
 *   haptics.impact()   a "physical" moment — liking a tape
 *   haptics.success()  something completed — booking, tape published, review posted
 *   haptics.error()    something failed — payment, wrong password
 *
 * Same code on iOS (Taptic Engine) and Android (vibrator). Never fires on
 * scrolling, typing or reel swipes (Apple HIG: only meaningful moments).
 * Failures are ignored (e.g. haptics off in the phone's settings, simulator).
 * `setHapticsEnabled(false)` turns everything off app-wide.
 */
let enabled = true;
let lastAt = 0;
const MIN_GAP_MS = 40; // avoid a buzz storm from rapid double events

export const setHapticsEnabled = (value) => {
  enabled = Boolean(value);
};

function fire(fn) {
  if (!enabled) return;
  const now = Date.now();
  if (now - lastAt < MIN_GAP_MS) return;
  lastAt = now;
  fn().catch(() => {});
}

const haptics = {
  select: () => fire(() => Haptics.selectionAsync()),
  tap: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  impact: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};

export default haptics;
