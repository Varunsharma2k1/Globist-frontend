import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Music2, MapPin } from 'lucide-react-native';
import Tag from '../../../components/Tag';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { formatCreatorTier, initialsOf } from '../utils/reelFormat';

/**
 * Bottom-left caption block: creator row (avatar, handle, tier, follow),
 * an expandable caption, location, and music attribution. Sits in normal
 * flow beside the actions rail; the agency/booking info lives in
 * ReelBookingBar underneath.
 */
export default function ReelInfoOverlay({ reel, onCreatorPress }) {
  const [following, setFollowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handle = reel.creatorHandle || '@explorer';
  const avatarUri = reel.user?.avatar;

  return (
    <View style={styles.info} pointerEvents="box-none">
      <View style={styles.creatorRow}>
        <TouchableOpacity
          style={styles.creatorTap}
          onPress={() => onCreatorPress && onCreatorPress(reel)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Open ${handle}'s profile`}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(handle)}</Text>
            </View>
          )}
          <Text style={styles.creatorName} numberOfLines={1}>
            {handle}
          </Text>
        </TouchableOpacity>
        <View style={styles.tierTagWrap}>
          <Tag label={formatCreatorTier(reel.creatorTier)} variant="primary" />
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
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.caption} numberOfLines={expanded ? 6 : 2}>
          {reel.caption || 'Exploring majestic mountain views.'}
        </Text>
      </TouchableOpacity>

      <View style={styles.metaRow}>
        {reel.location ? (
          <View style={styles.metaItem}>
            <MapPin size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText} numberOfLines={1}>
              {reel.location}
            </Text>
          </View>
        ) : null}
        <View style={[styles.metaItem, styles.musicItem]}>
          <Music2 size={12} color="rgba(255,255,255,0.75)" />
          <Text style={styles.metaText} numberOfLines={1}>
            {reel.musicTitle || 'Original Travel Sound'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const TEXT_SHADOW = {
  textShadowColor: 'rgba(0,0,0,0.45)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
};

const styles = StyleSheet.create({
  info: {
    flex: 1,
    minWidth: 0,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  creatorTap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: SPACING.xs,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  creatorName: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: '#FFFFFF',
    flexShrink: 1,
    ...TEXT_SHADOW,
  },
  tierTagWrap: {
    marginTop: SPACING.xs,
  },
  followBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  followingBtn: {
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  followText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    color: '#FFFFFF',
  },
  followingText: {
    color: 'rgba(255,255,255,0.8)',
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
    lineHeight: 20,
    ...TEXT_SHADOW,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  musicItem: {
    flex: 1,
  },
  metaText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flexShrink: 1,
    ...TEXT_SHADOW,
  },
});
