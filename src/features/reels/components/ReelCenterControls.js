import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { SPACING } from '../../../theme';

/**
 * Center-screen play/pause + mute buttons, shown briefly on tap and while paused.
 */
export default function ReelCenterControls({ paused, muted, onTogglePlay, onToggleMute }) {
  return (
    <View style={styles.centerControls} pointerEvents="box-none">
      <TouchableOpacity style={styles.centerBtn} onPress={onTogglePlay} activeOpacity={0.7}>
        {paused ? (
          <Play size={26} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Pause size={26} color="#FFFFFF" fill="#FFFFFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.centerBtn} onPress={onToggleMute} activeOpacity={0.7}>
        {muted ? <VolumeX size={24} color="#FFFFFF" /> : <Volume2 size={24} color="#FFFFFF" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerControls: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
