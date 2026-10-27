import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '../../../theme';

/**
 * Play/pause button dead-centre on the reel (shown briefly on tap and while
 * paused), with a small mute toggle tucked in the top-right corner.
 */
export default function ReelCenterControls({ paused, muted, onTogglePlay, onToggleMute }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.layer} pointerEvents="box-none">
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
        style={[styles.muteBtn, { top: insets.top + 56 }]}
        onPress={onToggleMute}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={18} color="#FFFFFF" /> : <Volume2 size={18} color="#FFFFFF" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteBtn: {
    position: 'absolute',
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
