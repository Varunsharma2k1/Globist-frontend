import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { SPACING } from '../../../theme';

const PLAY_SIZE = 64;
const MUTE_SIZE = 44;
const GAP = SPACING.md;

/**
 * Play/pause in the exact centre of the phone screen with the mute toggle a
 * little below it, shown briefly on tap and kept up while paused. Plain flow
 * layout: an invisible spacer the size of the mute button sits above play, so
 * the column is balanced and play lands dead-centre.
 *
 * The reel ends above the tab bar (and Android's gesture bar), so its own
 * centre sits higher than the screen's. `centerOffset` — the height of what's
 * below the reel, halved — pushes the controls down to the screen centre.
 */
export default function ReelCenterControls({
  paused,
  muted,
  onTogglePlay,
  onToggleMute,
  centerOffset = 0,
}) {
  return (
    <View style={[styles.layer, { paddingTop: centerOffset * 2 }]} pointerEvents="box-none">
      <View style={styles.spacer} pointerEvents="none" />

      <TouchableOpacity
        style={styles.playBtn}
        onPress={onTogglePlay}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={paused ? 'Play reel' : 'Pause reel'}
      >
        {paused ? (
          <Play size={30} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Pause size={30} color="#FFFFFF" fill="#FFFFFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.muteBtn}
        onPress={onToggleMute}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={22} color="#FFFFFF" /> : <Volume2 size={22} color="#FFFFFF" />}
      </TouchableOpacity>
    </View>
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
    height: MUTE_SIZE,
    marginBottom: GAP,
  },
  playBtn: round(PLAY_SIZE),
  muteBtn: {
    ...round(MUTE_SIZE),
    marginTop: GAP,
  },
});
