import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Android immersive mode: hides the system back / home / recents bar so the
 * app (reels especially) uses the full screen. A swipe up from the bottom
 * edge shows the bar for a few seconds, then it hides again by itself.
 *
 * Android can bring the bar back when the app is reopened, so hide it again
 * every time the app returns to the foreground. No-op on iOS.
 */
export function useImmersiveNavBar() {
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const hide = () => NavigationBar.setVisibilityAsync('hidden').catch(() => {});
    hide();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') hide();
    });
    return () => sub.remove();
  }, []);
}

export default useImmersiveNavBar;
