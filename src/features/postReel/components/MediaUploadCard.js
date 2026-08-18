import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Upload, Eye, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

function VideoPreview({ uri }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return (
    <VideoView
      style={StyleSheet.absoluteFill}
      player={player}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

/**
 * Tap-to-upload video card. Once a video is picked, shows a live looping
 * preview with "Preview" (opens the full reel-template modal) and "Change"
 * (re-open the picker) actions overlaid.
 */
export default function MediaUploadCard({ media, onPick, onOpenPreview }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (media) {
    return (
      <View style={styles.uploadCard}>
        <VideoPreview uri={media.uri} />
        <View style={styles.mediaActionRow}>
          <TouchableOpacity style={styles.mediaActionBtn} onPress={onOpenPreview}>
            <Eye size={14} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.mediaActionText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaActionBtn} onPress={onPick}>
            <RotateCcw size={14} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.mediaActionText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.uploadCard} onPress={onPick} activeOpacity={0.85}>
      <View style={styles.uploadEmpty}>
        <Upload size={24} color={colors.textMuted} strokeWidth={1.75} />
        <Text style={styles.uploadEmptyText}>Tap to upload a video</Text>
      </View>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    uploadCard: {
      height: 180,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
      overflow: 'hidden',
      marginBottom: SPACING.md,
    },
    uploadEmpty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
    },
    uploadEmptyText: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    mediaActionRow: {
      position: 'absolute',
      right: SPACING.sm,
      bottom: SPACING.sm,
      flexDirection: 'row',
      gap: SPACING.xs,
    },
    mediaActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(22,19,17,0.75)',
      paddingHorizontal: SPACING.sm + 2,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.pill,
    },
    mediaActionText: {
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: '#FFFFFF',
    },
  });
}
