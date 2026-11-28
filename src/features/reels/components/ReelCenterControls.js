import React, { useEffect, useRef } from 'react';
import { Animated, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { SPACING } from '../../../theme';

// Play/pause and mute are the same size.
const BUTTON_SIZE = 56;
const ICON_SIZE = 24;
const FADE_IN_MS = 120;
const FADE_OUT_MS = 200;
const GAP = SPACING.md;

/**
 * Play/pause in the exact centre of the phone screen with the mute toggle a
 * little below it. Fades in on tap and fades out quickly (`visible`); while
 * hidden it ignores touches so taps reach the reel. Plain flow
 * layout: an invisible spacer the size of the mute button sits above play, so
 * the column is balanced and play lands dead-centre.
 *
 * The reel ends above the tab bar (and Android's gesture bar), so its own
 * centre sits higher than the screen's. `centerOffset` — the height of what's
 * below the reel, halved — pushes the controls down to the screen centre.
 */
export default function ReelCenterControls({
  visible,
  paused,
  muted,
  onTogglePlay,
  onToggleMute,
  centerOffset = 0,
}) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? FADE_IN_MS : FADE_OUT_MS,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View
      style={[styles.layer, { paddingTop: centerOffset * 2, opacity }]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      <View style={styles.spacer} pointerEvents="none" />

      <TouchableOpacity
        style={styles.playBtn}
        onPress={onTogglePlay}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={paused ? 'Play tape' : 'Pause tape'}
      >
        {paused ? (
          <Play size={ICON_SIZE} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Pause size={ICON_SIZE} color="#FFFFFF" fill="#FFFFFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.muteBtn}
        onPress={onToggleMute}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <VolumeX size={ICON_SIZE} color="#FFFFFF" />
        ) : (
          <Volume2 size={ICON_SIZE} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const round = (size) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: 'rgba(0,0,0,0.38)',
  justifyContent: 'center',
  alignItems: 'center',
});

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: BUTTON_SIZE,
    marginBottom: GAP,
  },
  playBtn: round(BUTTON_SIZE),
  muteBtn: {
    ...round(BUTTON_SIZE),
    marginTop: GAP,
  },
});
