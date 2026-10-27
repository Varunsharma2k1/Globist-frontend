import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';
import { CommentAvatar } from '../../reels/components/ReelCommentRow';
import { formatRelativeTime } from '../../reels/utils/reelFormat';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/** Comments from visitors, with a composer at the top. */
export default function AgencyComments({ comments, onPost }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const [text, setText] = useState('');
  const canPost = text.trim().length > 0;

  const submit = () => {
    if (!canPost) return;
    onPost(text);
    setText('');
  };

  return (
    <View style={styles.section}>
      <Text style={typography.h3}>{`Comments (${comments.length})`}</Text>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Share your experience with this agency…"
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <TouchableOpacity
          onPress={submit}
          disabled={!canPost}
          style={[styles.send, !canPost && styles.sendOff]}
          accessibilityRole="button"
          accessibilityLabel="Post comment"
        >
          <Send size={16} color={colors.inkContrast} />
        </TouchableOpacity>
      </View>

      {comments.length === 0 ? (
        <Text style={styles.empty}>No comments yet — be the first.</Text>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={styles.row}>
            <CommentAvatar name={c.author} />
            <View style={styles.body}>
              <Text style={styles.author}>
                {c.author} <Text style={styles.time}>{formatRelativeTime(c.createdAt)}</Text>
              </Text>
              <Text style={styles.text}>{c.text}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.lg },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: SPACING.sm,
      marginVertical: SPACING.md,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 110,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
      color: colors.text,
      fontFamily: FONTS.body,
      fontSize: 14,
    },
    send: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.ink,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendOff: { opacity: 0.35 },
    empty: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted },
    row: { flexDirection: 'row', gap: SPACING.sm + 2, marginBottom: SPACING.md },
    body: { flex: 1 },
    author: { fontFamily: FONTS.semibold, fontSize: 13, color: colors.ink },
    time: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    text: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginTop: 2,
    },
  });
}
