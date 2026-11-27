import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Send, BadgeCheck } from 'lucide-react-native';
import { CommentAvatar } from '../../reels/components/ReelCommentRow';
import { formatRelativeTime } from '../../reels/utils/reelFormat';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import haptics from '../../../utils/haptics';

const MAX_LEN = 1000;

/**
 * Reviews tab: composer on top, then reviews from MongoDB, newest first.
 * "Verified traveller" marks authors who really booked with the agency
 * (decided by the server). Authors can delete their own review.
 *
 * @param {Array} comments - [{ _id, text, createdAt, verifiedTraveller, user: { _id, name } }]
 * @param {(text: string) => Promise<void>} onPost - throws with a readable message
 * @param {() => boolean} [ensureSignedIn] - opens sign-in for guests, returns false
 */
export default function AgencyComments({
  comments,
  total,
  canReview = true,
  currentUserId,
  onPost,
  onDelete,
  ensureSignedIn,
}) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const canPost = text.trim().length > 0 && !posting;

  const submit = async () => {
    if (!canPost) return;
    if (ensureSignedIn && !ensureSignedIn()) return;
    setPosting(true);
    try {
      await onPost(text);
      haptics.success();
      setText('');
    } catch (error) {
      haptics.error();
      Alert.alert("Couldn't post", error.message);
    } finally {
      setPosting(false);
    }
  };

  const confirmDelete = (review) =>
    Alert.alert('Delete your review?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          onDelete(review._id).catch(() => Alert.alert('Could not delete. Try again.')),
      },
    ]);

  if (!canReview) {
    return <Text style={styles.empty}>Reviews open once this agency is listed on TripTape.</Text>;
  }

  return (
    <View style={styles.section}>
      <Text style={typography.h3}>{`Reviews${total ? ` (${total})` : ''}`}</Text>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Share your experience with this agency…"
          placeholderTextColor={colors.textMuted}
          maxLength={MAX_LEN}
          multiline
        />
        <TouchableOpacity
          onPress={submit}
          disabled={!canPost}
          style={[styles.send, !canPost && styles.sendOff]}
          accessibilityRole="button"
          accessibilityLabel="Post review"
        >
          {posting ? (
            <ActivityIndicator size="small" color={colors.inkContrast} />
          ) : (
            <Send size={16} color={colors.inkContrast} />
          )}
        </TouchableOpacity>
      </View>

      {comments.length === 0 ? (
        <Text style={styles.empty}>No reviews yet. Be the first.</Text>
      ) : (
        comments.map((c) => {
          const name = c.user?.name || 'Traveller';
          const mine = currentUserId && String(c.user?._id) === String(currentUserId);
          return (
            <View key={c._id} style={styles.row}>
              <CommentAvatar name={name} />
              <View style={styles.body}>
                <View style={styles.headRow}>
                  <Text style={styles.author}>{name}</Text>
                  {c.verifiedTraveller ? (
                    <View style={styles.badge}>
                      <BadgeCheck size={12} color={colors.success} />
                      <Text style={styles.badgeText}>Verified traveller</Text>
                    </View>
                  ) : null}
                  <Text style={styles.time}>
                    {formatRelativeTime(new Date(c.createdAt).getTime())}
                  </Text>
                </View>
                <Text style={styles.text}>{c.text}</Text>
                {mine ? (
                  <TouchableOpacity onPress={() => confirmDelete(c)} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        })
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
    headRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    author: { fontFamily: FONTS.semibold, fontSize: 14, color: colors.ink },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    badgeText: { fontFamily: FONTS.semibold, fontSize: 12, color: colors.success },
    time: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    text: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginTop: 2,
    },
    deleteBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
    deleteText: { fontFamily: FONTS.semibold, fontSize: 12, color: colors.textMuted },
  });
}
