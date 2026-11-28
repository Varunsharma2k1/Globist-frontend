import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A Pressable that springs down slightly while held and back on release —
 * the soft "squish" iOS uses on cards. Runs on the native driver.
 */
export default function PressableScale({ children, style, scaleTo = 0.97, onPressIn, onPressOut, ...rest }) {
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (toValue) =>
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: toValue === 1 ? 6 : 0 }).start();

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        spring(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        spring(1);
        onPressOut?.(e);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
