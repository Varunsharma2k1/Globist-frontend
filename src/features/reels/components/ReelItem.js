import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Share, Alert, useWindowDimensions } from 'react-native';
import { VideoView } from 'expo-video';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useReelPlayback } from '../hooks/useReelPlayback';
import { useReelLike } from '../hooks/useReelLike';
import { useReelComments } from '../hooks/useReelComments';
import ReelBackground, { categoryKey } from './ReelBackground';
import ReelCenterControls from './ReelCenterControls';
import ReelActionsRail from './ReelActionsRail';
import ReelInfoOverlay from './ReelInfoOverlay';
import ReelCommentsSheet from './ReelCommentsSheet';

/**
 * ReelItem Component
 *
 * Fullscreen vertical video card: renders the reel's video (or a poster
 * placeholder), playback controls, like/comment/share actions, creator info,
 * and a comments sheet. Pure orchestration — playback, likes, and comments
 * are each owned by their own hook (see ../hooks), and every overlay region
 * is its own component (see the other files in this folder), so this file
 * stays a thin composition rather than growing without bound.
 */
export default function ReelItem({
  reel,
  height,
  isActive,
  muted,
  onToggleMute,
  onAgencyPress,
  onCreatorPress,
}) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { height: windowHeight } = useWindowDimensions();
  const itemHeight = height || windowHeight;

  const [commentsVisible, setCommentsVisible] = useState(false);

  const { hasVideo, player, paused, controlsVisible, handleTogglePlay, handleToggleMute } =
    useReelPlayback({ mediaUrl: reel.mediaUrl, isActive, muted, onToggleMute });
  const { likes, liked, handleLike } = useReelLike(reel);
  const { comments, commentText, setCommentText, handlePostComment } = useReelComments(
    reel,
    user?.name
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this travel reel from ${reel.location || 'Globist'}: ${reel.caption || ''}`,
      });
    } catch (error) {
      console.warn('[ReelItem] Error sharing reel:', error);
    }
  };

  const handleMore = () => {
    Alert.alert(reel.creatorHandle || 'Reel options', 'More options coming soon.');
  };

  const tone = colors.reelTone[categoryKey(reel.imageType)] || colors.reelTone.default;

  return (
    <View style={[styles.container, { height: itemHeight, backgroundColor: tone }]}>
      <ReelBackground imageType={reel.imageType} location={reel.location} />

      {hasVideo && (
        <VideoView
          style={StyleSheet.absoluteFill}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {hasVideo && (
        <TouchableWithoutFeedback onPress={handleTogglePlay}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      {hasVideo && controlsVisible && (
        <ReelCenterControls
          paused={paused}
          muted={muted}
          onTogglePlay={handleTogglePlay}
          onToggleMute={handleToggleMute}
        />
      )}

      <ReelActionsRail
        liked={liked}
        likes={likes}
        commentCount={comments.length}
        onLike={handleLike}
        onOpenComments={() => setCommentsVisible(true)}
        onShare={handleShare}
        onMore={handleMore}
      />

      <ReelInfoOverlay reel={reel} onCreatorPress={onCreatorPress} onAgencyPress={onAgencyPress} />

      <ReelCommentsSheet
        visible={commentsVisible}
        comments={comments}
        commentText={commentText}
        onChangeText={setCommentText}
        onPostComment={handlePostComment}
        onClose={() => setCommentsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
});
