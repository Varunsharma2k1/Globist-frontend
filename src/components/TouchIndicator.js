import React, { useCallback, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SIZE = 48;
const RIPPLE_MS = 380;

/**
 * "Show touches" for screen recordings: draws a translucent circle under every
 * finger while it's down, then a quick ripple when it lifts. Wrap the app root
 * with it. When `enabled` is false it only renders its children.
 *
 * Touch events bubble up from every child, so this never blocks or steals a
 * touch. (A native Modal draws in its own window, so taps inside one aren't
 * seen here.)
 */
export default function TouchIndicator({ enabled, children }) {
  const rootRef = useRef(null);
  const origin = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState([]); // fingers currently down
  const [ripples, setRipples] = useState([]); // finished taps fading out

  const measure = useCallback(() => {
    rootRef.current?.measureInWindow((x, y) => {
      origin.current = { x, y };
    });
  }, []);

  const toPoint = (t) => ({
    id: String(t.identifier),
    x: t.pageX - origin.current.x,
    y: t.pageY - origin.current.y,
  });

  const track = (e) => setActive(Array.from(e.nativeEvent.touches).map(toPoint));

  const release = (e) => {
    const lifted = Array.from(e.nativeEvent.changedTouches).map(toPoint);
    setActive(Array.from(e.nativeEvent.touches).map(toPoint));
    lifted.forEach((point) => {
      const anim = new Animated.Value(0);
      const ripple = { key: `${point.id}-${Date.now()}`, point, anim };
      setRipples((prev) => [...prev, ripple]);
      Animated.timing(anim, { toValue: 1, duration: RIPPLE_MS, useNativeDriver: true }).start(() =>
        setRipples((prev) => prev.filter((r) => r.key !== ripple.key))
      );
    });
  };

  if (!enabled) return children;

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={measure}
      onTouchStart={(e) => {
        measure();
        track(e);
      }}
      onTouchMove={track}
      onTouchEnd={release}
      onTouchCancel={release}
    >
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {active.map((p) => (
          <View key={p.id} style={[styles.dot, { left: p.x - SIZE / 2, top: p.y - SIZE / 2 }]} />
        ))}
        {ripples.map(({ key, point, anim }) => (
          <Animated.View
            key={key}
            style={[
              styles.dot,
              {
                left: point.x - SIZE / 2,
                top: point.y - SIZE / 2,
                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
                transform: [
                  { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  dot: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});
