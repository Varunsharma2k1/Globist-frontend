import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Music2, BadgeCheck } from 'lucide-react-native';
import Tag from '../../../components/Tag';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Bottom-left overlay: creator row (avatar, handle, tier, follow), caption,
 * music attribution, and an optional "verified agency" badge.
 */
export default function ReelInfoOverlay({ reel, onCreatorPress, onAgencyPress }) {
  const [following, setFollowing] = useState(false);

  return (
    <View style={styles.infoOverlay}>
      <TouchableOpacity
        style={styles.creatorRow}
        onPress={() => onCreatorPress && onCreatorPress(reel)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <User size={16} color="#FFFFFF" />
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
          <BadgeCheck size={13} color="#FFFFFF" />
          <Text style={styles.agencyText}>
            Verified Agency: {reel.agency.name || 'Himalayan Treks'} →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 80,
    bottom: SPACING.md,
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
    color: '#FFFFFF',
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
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
