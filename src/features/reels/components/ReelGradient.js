import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

/**
 * Top + bottom scrims over the video so the header, caption, and booking bar
 * stay readable on bright footage. Sized in percentages so it scales with
 * whatever height the reel page ends up being.
 */
export default function ReelGradient() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.top}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="reelTopScrim" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0.45" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#reelTopScrim)" />
        </Svg>
      </View>
      <View style={styles.bottom}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="reelBottomScrim" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0" />
              <Stop offset="0.55" stopColor="#000000" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.75" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#reelBottomScrim)" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '18%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
});
