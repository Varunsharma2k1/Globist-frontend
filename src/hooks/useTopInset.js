import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Smallest comfortable top area on Android (dp). Most phones report less
// (status bar only, 24–32), so they're lifted to this; phones whose notch /
// punch-hole already reports more keep their own, larger value.
const ANDROID_MIN_TOP = 44;

/**
 * Top spacing for screen headers that looks right on every phone, computed
 * from the device's REAL insets (react-native-safe-area-context reads the
 * status bar AND the display cutout — notch, punch-hole, waterfall — from
 * the OS on each phone; no per-device values here):
 *
 *   iOS:     the safe area already covers the notch / Dynamic Island → use it.
 *   Android: max(real inset, 44). Notch-less and small-notch phones (e.g.
 *            OnePlus 6, ~30) get lifted to a comfortable 44; tall cutouts
 *            (e.g. 48–56) keep their own value, never extra on top.
 *
 * Use this instead of `useSafeAreaInsets().top` for anything at the top.
 */
export function useTopInset() {
  const { top } = useSafeAreaInsets();
  return Platform.OS === 'android' ? Math.max(top, ANDROID_MIN_TOP) : top;
}

export default useTopInset;
