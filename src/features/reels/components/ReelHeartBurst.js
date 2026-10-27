import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { LIKE_COLOR } from './ReelActionsRail';

/**
 * Big centered heart that pops and fades on double-tap-to-like. Driven
 * imperatively (`ref.current.play()`) so triggering it doesn't re-render the
 * reel.
 */
const ReelHeartBurst = forwardRef(function ReelHeartBurst(_, ref) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    play() {
      scale.setValue(0.3);
      opacity.setValue(1);
      Animated.sequence([
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 260, delay: 220, useNativeDriver: true }),
      ]).start();
    },
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { opacity, transform: [{ scale }] }]}>
      <Heart size={104} color={LIKE_COLOR} fill={LIKE_COLOR} strokeWidth={0} />
    </Animated.View>
  );
});

export default ReelHeartBurst;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
