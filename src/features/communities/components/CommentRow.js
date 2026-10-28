import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import { timeAgo } from '../utils/format';

/** One comment in a post's thread. */
export default function CommentRow({ comment }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{comment.handle[0].toUpperCase()}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.meta}>
          <Text style={styles.metaStrong}>u/{comment.handle}</Text> · {timeAgo(comment.hoursAgo)}
          {comment.isMine ? ' · you' : ''}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
        {comment.likes > 0 ? (
          <View style={styles.likes}>
            <Heart size={12} color={colors.textMuted} />
            <Text style={styles.likesText}>{comment.likes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', gap: SPACING.md - 2, paddingVertical: SPACING.md },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontFamily: FONTS.heading, fontSize: 12, color: colors.text },
    main: { flex: 1 },
    meta: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    metaStrong: { fontFamily: FONTS.semibold, color: colors.text },
    text: {
      fontFamily: FONTS.body,
      fontSize: 14.5,
      lineHeight: 22,
      color: colors.text,
      marginTop: 4,
    },
    likes: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    likesText: { fontFamily: FONTS.semibold, fontSize: 12, color: colors.textMuted },
  });
}
