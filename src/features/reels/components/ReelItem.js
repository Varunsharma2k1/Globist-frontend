import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { VideoView } from 'expo-video';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING } from '../../../theme';
import { useReelPlayback } from '../hooks/useReelPlayback';
import { useReelLike } from '../hooks/useReelLike';
import { useReelComments } from '../hooks/useReelComments';
import { useReelShare } from '../hooks/useReelShare';
import ReelBackground, { categoryKey } from './ReelBackground';
import ReelGradient from './ReelGradient';
import ReelCenterControls from './ReelCenterControls';
import ReelHeartBurst from './ReelHeartBurst';
import ReelActionsRail from './ReelActionsRail';
import ReelInfoOverlay from './ReelInfoOverlay';
import ReelBookingBar from './ReelBookingBar';
import ReelCommentsSheet from './ReelCommentsSheet';

const DOUBLE_TAP_MS = 260;

/**
 * ReelItem Component
 *
 * One full reel page: video (or a poster placeholder), scrims, play/pause +
 * double-tap-to-like, the caption/actions row, the Book Trip bar, and the
 * comments sheet. Pure orchestration — playback, likes, comments, and
 * sharing each live in their own hook (see ../hooks), and every overlay
 * region is its own component.
 *
 * Sizing: pass `height` for a feed page (it must match the list's snap
 * interval exactly), or omit it to fill the parent (e.g. a full-screen
 * preview). `bottomInset` pads the bottom bar clear of the home indicator
 * when nothing else (like the tab bar) already does.
 */
function ReelItem({
  reel,
  height,
  bottomInset = 0,
  isActive,
  muted,
  onToggleMute,
  onCreatorPress,
  onBookPress,
  bookingPending,
}) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [commentsVisible, setCommentsVisible] = useState(false);
  const heartBurstRef = useRef(null);
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);

  const { hasVideo, player, paused, controlsVisible, handleTogglePlay, handleToggleMute } =
    useReelPlayback({ mediaUrl: reel.mediaUrl, isActive, muted, onToggleMute });
  const { likes, liked, handleLike, likeOnce } = useReelLike(reel);
  const { comments, commentText, setCommentText, handlePostComment } = useReelComments(
    reel,
    user?.name
  );
  const { shares, handleShare } = useReelShare(reel);

  useEffect(() => () => clearTimeout(singleTapTimerRef.current), []);

  // A single tap toggles play/pause, a double tap likes. The single-tap
  // action waits out the double-tap window so a like doesn't also pause.
  const handleSurfacePress = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      clearTimeout(singleTapTimerRef.current);
      lastTapRef.current = 0;
      likeOnce();
      heartBurstRef.current?.play();
      return;
    }
    lastTapRef.current = now;
    singleTapTimerRef.current = setTimeout(() => {
      if (hasVideo) handleTogglePlay();
    }, DOUBLE_TAP_MS);
  }, [likeOnce, hasVideo, handleTogglePlay]);

  const handleMore = () => {
    Alert.alert(reel.creatorHandle || 'Reel options', 'More options coming soon.');
  };

  const tone = colors.reelTone[categoryKey(reel.imageType)] || colors.reelTone.default;
  const sizeStyle = height ? { height } : styles.fill;

  return (
    <View style={[styles.container, sizeStyle, { backgroundColor: tone }]}>
      <ReelBackground imageType={reel.imageType} location={reel.location} />

      {hasVideo && (
        <VideoView
          style={StyleSheet.absoluteFill}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      <ReelGradient />

      <TouchableWithoutFeedback onPress={handleSurfacePress}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <ReelHeartBurst ref={heartBurstRef} />

      {hasVideo && controlsVisible && (
        <ReelCenterControls
          paused={paused}
          muted={muted}
          onTogglePlay={handleTogglePlay}
          onToggleMute={handleToggleMute}
        />
      )}

      <View
        style={[styles.bottomArea, { paddingBottom: SPACING.md + bottomInset }]}
        pointerEvents="box-none"
      >
        <View style={styles.infoRow} pointerEvents="box-none">
          <ReelInfoOverlay reel={reel} onCreatorPress={onCreatorPress} />
          <ReelActionsRail
            liked={liked}
            likes={likes}
            commentCount={comments.length}
            shares={shares}
            onLike={handleLike}
            onOpenComments={() => setCommentsVisible(true)}
            onShare={handleShare}
            onMore={handleMore}
          />
        </View>

        <ReelBookingBar
          agency={reel.agency}
          location={reel.location}
          pending={bookingPending}
          onPress={onBookPress ? () => onBookPress(reel) : undefined}
        />
      </View>

      <ReelCommentsSheet
        visible={commentsVisible}
        comments={comments}
        commentText={commentText}
        onChangeText={setCommentText}
        onPostComment={handlePostComment}
        onClose={() => setCommentsVisible(false)}
        currentUserName={user?.name}
      />
    </View>
  );
}

export default memo(ReelItem);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
