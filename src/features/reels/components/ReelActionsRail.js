import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react-native';
import { SPACING, FONTS } from '../../../theme';

/**
 * Right-side overlay actions rail — like, comment, share, more.
 */
export default function ReelActionsRail({
  liked,
  likes,
  commentCount,
  onLike,
  onOpenComments,
  onShare,
  onMore,
}) {
  return (
    <View style={styles.actionsOverlay}>
      <TouchableOpacity style={styles.actionBtn} onPress={onLike} activeOpacity={0.7}>
        <Heart size={28} color="#FFFFFF" fill={liked ? '#FFFFFF' : 'transparent'} />
        <Text style={styles.actionCount}>{likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onOpenComments} activeOpacity={0.7}>
        <MessageCircle size={26} color="#FFFFFF" />
        <Text style={styles.actionCount}>{commentCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
        <Send size={24} color="#FFFFFF" />
        <Text style={styles.actionCount}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onMore} activeOpacity={0.7}>
        <MoreHorizontal size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsOverlay: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCount: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
});
