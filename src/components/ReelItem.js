import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Mountain, Waves, Sun, Heart, MessageCircle, Send, User, Music2, BadgeCheck, MoreHorizontal, Volume2, VolumeX, Play, Pause, X } from 'lucide-react-native';
import Tag from './Tag';
import { likeReel } from '../api';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, RADIUS, FONTS } from '../theme';

const CATEGORY_ICON = { desert: Sun, beach: Waves, mountain: Mountain };

function categoryKey(imageType) {
  if (imageType === 'desert') return 'desert';
  if (imageType === 'beach') return 'beach';
  return 'mountain';
}

function seedComments(reel) {
  const place = reel.location || 'this trip';
  return [
    { id: 'c1', author: '@wanderlust_kate', text: `This looks incredible! Adding ${place} to my list 😍` },
    { id: 'c2', author: '@travel_with_sam', text: 'How much did this trip cost roughly?' },
  ];
}

function StripePattern() {
  const stripes = new Array(8).fill(0);
  return (
    <View style={styles.stripeWrap} pointerEvents="none">
      {stripes.map((_, i) => (
        <View key={i} style={[styles.stripe, { left: -200 + i * 90 }]} />
      ))}
    </View>
  );
}

/**
 * ReelItem Component
 *
 * Fullscreen vertical video card rendering reel info, creator metadata, and interactive like counts.
 * Uses `likeReel` API service for clean data handling.
 */
export default function ReelItem({ reel, height, isActive, muted, onToggleMute, onAgencyPress, onCreatorPress }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { height: windowHeight } = useWindowDimensions();
  const itemHeight = height || windowHeight;
  const hasVideo = Boolean(reel.mediaUrl);

  const [likes, setLikes] = useState(reel.likes || 0);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState(() => seedComments(reel));
  const [commentText, setCommentText] = useState('');
  const hideTimerRef = useRef(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // Reveal the play/pause + mute controls, auto-hiding them shortly after —
  // unless the video is paused, in which case they stay up so there's always
  // a visible way to resume.
  const revealControls = (stillPaused) => {
    setControlsVisible(true);
    clearHideTimer();
    if (!stillPaused) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 1800);
    }
  };

  useEffect(() => clearHideTimer, []);

  const handleTogglePlay = () => {
    setPaused((prev) => {
      const next = !prev;
      revealControls(next);
      return next;
    });
  };

  const handleToggleMute = () => {
    onToggleMute?.();
    revealControls(paused);
  };

  const player = useVideoPlayer(hasVideo ? reel.mediaUrl : null, (p) => {
    p.loop = true;
    p.muted = muted;
  });

  useEffect(() => {
    if (!hasVideo || !player) return;
    if (isActive && !paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, paused, hasVideo, player]);

  // Always resume playing (not paused) when a reel becomes active again.
  useEffect(() => {
    if (!isActive) setPaused(false);
  }, [isActive]);

  useEffect(() => {
    if (player) player.muted = muted;
  }, [muted, player]);

  const handleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikes((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));
      if (reel._id) {
        await likeReel(reel._id);
      }
    } catch (error) {
      console.warn('[ReelItem] Error liking reel:', error);
    }
  };

  const handlePostComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: `local-${Date.now()}`, author: user?.name || 'You', text }]);
    setCommentText('');
  };

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

  const category = categoryKey(reel.imageType);
  const CategoryIcon = CATEGORY_ICON[category];
  const tone = COLORS.reelTone[category] || COLORS.reelTone.default;
  const region = reel.location || 'Himalayan Pass';

  return (
    <View style={[styles.container, { height: itemHeight, backgroundColor: tone }]}>
      {/* Background Visual Card (also serves as poster behind the video while it buffers) */}
      <View style={styles.visualContainer}>
        <StripePattern />
        <CategoryIcon size={72} color="rgba(255,255,255,0.35)" strokeWidth={1.25} />
        <Text style={styles.mediaTitle}>VIDEO REEL — {region.toUpperCase()}</Text>
      </View>

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
        <View style={styles.centerControls} pointerEvents="box-none">
          <TouchableOpacity style={styles.centerBtn} onPress={handleTogglePlay} activeOpacity={0.7}>
            {paused ? (
              <Play size={26} color={COLORS.white} fill={COLORS.white} />
            ) : (
              <Pause size={26} color={COLORS.white} fill={COLORS.white} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.centerBtn} onPress={handleToggleMute} activeOpacity={0.7}>
            {muted ? (
              <VolumeX size={24} color={COLORS.white} />
            ) : (
              <Volume2 size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Right Side Overlay Actions */}
      <View style={[styles.actionsOverlay, { bottom: SPACING.sm }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
          <Heart size={28} color={COLORS.white} fill={liked ? COLORS.white : 'transparent'} />
          <Text style={styles.actionCount}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setCommentsVisible(true)} activeOpacity={0.7}>
          <MessageCircle size={26} color={COLORS.white} />
          <Text style={styles.actionCount}>{comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
          <Send size={24} color={COLORS.white} />
          <Text style={styles.actionCount}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleMore} activeOpacity={0.7}>
          <MoreHorizontal size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Info Overlay */}
      <View style={[styles.infoOverlay, { bottom: SPACING.md }]}>
        <TouchableOpacity
          style={styles.creatorRow}
          onPress={() => onCreatorPress && onCreatorPress(reel)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <User size={16} color={COLORS.white} />
          </View>
          <Text style={styles.creatorName} numberOfLines={1}>
            {reel.creatorHandle || '@explorer'}
          </Text>
          <View style={styles.tierTagWrap}>
            <Tag label={reel.creatorTier || 'Gold Creator'} variant="primary" />
          </View>
          <TouchableOpacity
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={() => setFollowing((v) => !v)}
            activeOpacity={0.7}
          >
            <Text style={[styles.followText, following && styles.followingText]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={styles.caption} numberOfLines={2}>
          {reel.caption || 'Exploring majestic mountain views.'}
        </Text>
        <View style={styles.musicRow}>
          <Music2 size={13} color="rgba(255,255,255,0.75)" />
          <Text style={styles.musicTitle} numberOfLines={1}>
            {reel.musicTitle || 'Original Travel Sound'}
          </Text>
        </View>

        {reel.agency && (
          <TouchableOpacity
            style={styles.agencyBadge}
            onPress={() => onAgencyPress && onAgencyPress(reel.agency)}
            activeOpacity={0.7}
          >
            <BadgeCheck size={13} color={COLORS.white} />
            <Text style={styles.agencyText}>
              Verified Agency: {reel.agency.name || 'Himalayan Treks'} →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Bottom Sheet */}
      <Modal
        visible={commentsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentsVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={() => setCommentsVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.commentsSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Comments · {comments.length}</Text>
              <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsList} keyboardShouldPersistTaps="handled">
              {comments.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <View style={styles.commentAvatar}>
                    <User size={14} color={COLORS.ink} />
                  </View>
                  <View style={styles.commentBody}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.commentInputRow, { paddingBottom: SPACING.sm + insets.bottom }]}>
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor={COLORS.textMuted}
                returnKeyType="send"
                onSubmitEditing={handlePostComment}
              />
              <TouchableOpacity
                style={styles.commentPostBtn}
                onPress={handlePostComment}
                disabled={!commentText.trim()}
                activeOpacity={0.7}
              >
                <Send size={18} color={commentText.trim() ? COLORS.ink : COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  visualContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripeWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    top: -100,
    width: 26,
    height: '140%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '20deg' }],
  },
  mediaTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.6)',
    marginTop: SPACING.md,
  },
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
  actionsOverlay: {
    position: 'absolute',
    right: SPACING.md,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCount: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 2,
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 80,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  creatorName: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.white,
    marginRight: SPACING.xs,
    flexShrink: 1,
  },
  tierTagWrap: {
    marginRight: SPACING.xs,
  },
  followBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  followingBtn: {
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  followText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    color: COLORS.white,
  },
  followingText: {
    color: 'rgba(255,255,255,0.8)',
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  musicTitle: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  agencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  agencyText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  commentsSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '70%',
    paddingTop: SPACING.sm,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sheetTitle: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.ink,
  },
  commentsList: {
    paddingHorizontal: SPACING.lg,
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.ink,
    marginBottom: 2,
  },
  commentText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.ink,
  },
  commentPostBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
