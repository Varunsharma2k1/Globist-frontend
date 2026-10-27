import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { formatRelativeTime, initialsOf } from '../utils/reelFormat';

// Avatar backgrounds for commenters without a photo, picked by name so the
// same person always gets the same color.
const AVATAR_TONES = ['mountain', 'beach', 'desert', 'luxury', 'peach'];

function toneFor(name, colors) {
  const sum = [...(name || '')].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return colors.pastel[AVATAR_TONES[sum % AVATAR_TONES.length]];
}

/** Initials avatar used for commenters (and the composer's own avatar). */
export function CommentAvatar({ name }) {
  const { colors } = useTheme();
  const tone = toneFor(name, colors);
  return (
    <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
      <Text style={[styles.avatarText, { color: tone.fg }]}>{initialsOf(name)}</Text>
    </View>
  );
}

/** One comment: avatar, author, relative time, and text. */
export default function ReelCommentRow({ comment }) {
  const { colors } = useTheme();
  const themed = getStyles(colors);

  return (
    <View style={styles.row}>
      <CommentAvatar name={comment.author} />
      <View style={styles.body}>
        <View style={styles.meta}>
          <Text style={themed.author} numberOfLines={1}>
            {comment.author}
          </Text>
          <Text style={themed.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
        <Text style={themed.text}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm + 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  body: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 2,
  },
});

function getStyles(colors) {
  return StyleSheet.create({
    author: {
      fontFamily: FONTS.bold,
      fontSize: 12,
      color: colors.ink,
      flexShrink: 1,
    },
    time: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
    },
    text: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.text,
      lineHeight: 19,
    },
  });
}
