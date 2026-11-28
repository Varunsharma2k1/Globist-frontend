import React, { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Wraps a tab screen so it fades and rises in a few points each time the
 * tab is shown, instead of snapping in. Native-driver opacity + translate only,
 * so it costs nothing on the JS thread.
 */
export function withFocusFade(Screen) {
  function Faded(props) {
    const v = useRef(new Animated.Value(1)).current;
    useFocusEffect(
      useCallback(() => {
        v.setValue(0);
        Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 0 }).start();
      }, [v])
    );
    return (
      <Animated.View
        style={{
          flex: 1,
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
        }}
      >
        <Screen {...props} />
      </Animated.View>
    );
  }
  Faded.displayName = `FocusFade(${Screen.displayName || Screen.name || 'Screen'})`;
  return Faded;
}
