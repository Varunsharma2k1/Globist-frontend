import { useMemo, useRef } from 'react';
import { Animated, Easing, PanResponder, useWindowDimensions } from 'react-native';

const SWIPE_FRACTION = 0.25;
const SWIPE_VELOCITY = 0.5;

/**
 * Instagram-style horizontal swipe between tabs: the screen follows the
 * finger, and a long or fast enough swipe slides it off and switches tab —
 * drag right for the tab on the left, drag left for the tab on the right.
 * Only clearly-horizontal drags are taken, so vertical reel paging and taps
 * keep working.
 *
 * @param {Object} navigation - the tab screen's navigation
 * @param {{ left?: string, right?: string }} tabs - route names either side
 * @returns {{ translateX: Animated.Value, panHandlers: Object }}
 */
export function useTabSwipe(navigation, { left, right }) {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useMemo(() => {
    const targetFor = (dx) => (dx > 0 ? left : right);
    const springBack = () =>
      Animated.spring(translateX, { toValue: 0, friction: 8, useNativeDriver: true }).start();

    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) =>
        Math.abs(g.dx) > 16 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderMove: (_, g) => {
        // Rubber-band when there's no tab on that side.
        translateX.setValue(targetFor(g.dx) ? g.dx : g.dx * 0.2);
      },
      onPanResponderRelease: (_, g) => {
        const target = targetFor(g.dx);
        const far = Math.abs(g.dx) > width * SWIPE_FRACTION;
        const fast = Math.abs(g.vx) > SWIPE_VELOCITY;
        if (!target || !(far || fast)) {
          springBack();
          return;
        }
        Animated.timing(translateX, {
          toValue: Math.sign(g.dx) * width,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          navigation.navigate(target);
          // Reset once hidden, so Reels is back in place next time.
          setTimeout(() => translateX.setValue(0), 50);
        });
      },
      onPanResponderTerminate: springBack,
      onPanResponderTerminationRequest: () => false,
    });
  }, [navigation, left, right, width, translateX]);

  return { translateX, panHandlers: panResponder.panHandlers };
}

export default useTabSwipe;
