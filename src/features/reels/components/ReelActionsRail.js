import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react-native';
import { SPACING, FONTS } from '../../../theme';
import { formatCount } from '../utils/reelFormat';

export const LIKE_COLOR = '#FF3B5C';

/**
 * Right-side actions rail — like, comment, share, more. Laid out in normal
 * flow (not absolutely positioned) next to the caption, so on short screens
 * the two can never overlap each other or the booking bar.
 */
export default function ReelActionsRail({
  liked,
  likes,
  commentCount,
  shares,
  onLike,
  onOpenComments,
  onShare,
  onMore,
}) {
  const heartScale = useRef(new Animated.Value(1)).current;
  const wasLiked = useRef(liked);

  // Little "pop" whenever the reel becomes liked (tap or double-tap).
  useEffect(() => {
    if (liked && !wasLiked.current) {
      heartScale.setValue(0.6);
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 160,
        useNativeDriver: true,
      }).start();
    }
    wasLiked.current = liked;
  }, [liked, heartScale]);

  return (
    <View style={styles.rail}>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onLike}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={liked ? 'Unlike reel' : 'Like reel'}
        accessibilityState={{ selected: liked }}
      >
        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
          <Heart
            size={30}
            color={liked ? LIKE_COLOR : '#FFFFFF'}
            fill={liked ? LIKE_COLOR : 'transparent'}
            strokeWidth={liked ? 0 : 2}
          />
        </Animated.View>
        <Text style={styles.actionCount}>{formatCount(likes)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onOpenComments}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Open comments"
      >
        <MessageCircle size={28} color="#FFFFFF" />
        <Text style={styles.actionCount}>{formatCount(commentCount)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onShare}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="Share reel"
      >
        <Send size={26} color="#FFFFFF" />
        <Text style={styles.actionCount}>{shares ? formatCount(shares) : 'Share'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onMore}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="More options"
      >
        <MoreHorizontal size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const HIT_SLOP = { top: 6, bottom: 6, left: 8, right: 8 };

const styles = StyleSheet.create({
  rail: {
    alignItems: 'center',
    gap: SPACING.md + 2,
    paddingRight: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  actionBtn: {
    alignItems: 'center',
    minWidth: 48,
  },
  actionCount: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
