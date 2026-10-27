import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { LIKE_COLOR } from './ReelActionsRail';

const SIZE = 96;

/**
 * Instagram-style double-tap hearts: each one pops in exactly where the finger
 * landed (with a slight random tilt), settles, then floats up and fades.
 * Rapid double-taps stack several hearts. Driven imperatively
 * (`ref.current.play(x, y)`) so a like never re-renders the reel itself.
 */
const ReelHeartBurst = forwardRef(function ReelHeartBurst(_, ref) {
  const [hearts, setHearts] = useState([]);
  const nextId = useRef(0);

  useImperativeHandle(ref, () => ({
    play(x, y) {
      const id = nextId.current++;
      const tilt = Math.round(Math.random() * 40 - 20);
      setHearts((list) => [...list, { id, x, y, tilt }]);
    },
  }));

  const remove = useCallback((id) => setHearts((list) => list.filter((h) => h.id !== id)), []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {hearts.map((h) => (
        <BurstHeart key={h.id} {...h} onDone={remove} />
      ))}
    </View>
  );
});

function BurstHeart({ id, x, y, tilt, onDone }) {
  const pop = useRef(new Animated.Value(0)).current;
  const leave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 170, useNativeDriver: true }),
      Animated.delay(250),
      Animated.timing(leave, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onDone(id));
  }, [pop, leave, id, onDone]);

  const scale = Animated.add(
    pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
    leave.interpolate({ inputRange: [0, 1], outputRange: [0, -0.25] })
  );
  const translateY = leave.interpolate({ inputRange: [0, 1], outputRange: [0, -70] });
  const opacity = leave.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Animated.View
      style={[
        styles.heart,
        {
          left: x - SIZE / 2,
          top: y - SIZE / 2,
          opacity,
          transform: [{ translateY }, { rotate: `${tilt}deg` }, { scale }],
        },
      ]}
    >
      <Heart size={SIZE} color={LIKE_COLOR} fill={LIKE_COLOR} strokeWidth={0} />
    </Animated.View>
  );
}

export default ReelHeartBurst;

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
