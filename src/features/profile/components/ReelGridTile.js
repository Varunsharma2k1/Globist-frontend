import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Play, Heart } from 'lucide-react-native';
import { getCoverImage } from '../../../data/coverImages';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';

/** One square-ish tile in the My Posts grid: a frame from the video, a play badge and the like count. */
export default function ReelGridTile({ reel, width, onPress }) {
  const { colors } = useTheme();
  const [uri, setUri] = useState(null);

  useEffect(() => {
    let active = true;
    VideoThumbnails.getThumbnailAsync(reel.mediaUrl, { time: 1000 })
      .then((thumb) => active && setUri(thumb.uri))
      // Couldn't read a frame (offline / unsupported): use the location photo.
      .catch(() => active && setUri(getCoverImage(reel)));
    return () => {
      active = false;
    };
  }, [reel]);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tile,
        { width, height: width * (4 / 3), backgroundColor: colors.surfaceMuted },
      ]}
      accessibilityRole="button"
      accessibilityLabel={reel.caption || 'Open reel'}
    >
      {uri ? <Image source={{ uri }} style={styles.image} /> : null}
      <View style={styles.playBadge}>
        <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
      </View>
      <View style={styles.likes}>
        <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
        <Text style={styles.likesText}>{reel.likes ?? 0}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  playBadge: { position: 'absolute', top: 8, right: 8 },
  likes: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 3,
  },
});
