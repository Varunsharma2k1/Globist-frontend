import React from 'react';
import { View, Text, Image, Pressable, Share, StyleSheet } from 'react-native';
import { MessageCircle, Share2 } from 'lucide-react-native';
import VotePill from './VotePill';
import { useCommunities } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { compact, timeAgo } from '../utils/format';

const FLAIR_TONES = ['mountain', 'beach', 'desert', 'peach', 'luxury'];
const toneFor = (flair = '') =>
  FLAIR_TONES[[...flair].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % FLAIR_TONES.length];

/**
 * One community post: author, flair, title, text, photo, and the vote /
 * comment / share bar. `full` shows the whole text (post page); otherwise it
 * is trimmed and the card opens the post when pressed.
 */
export default function PostCard({ post, community, full, onPress, onComment }) {
  const { colors } = useTheme();
  const { vote } = useCommunities();
  const styles = getStyles(colors);
  const tone = colors.pastel[toneFor(post.flair)];

  const share = () =>
    Share.share({
      message: `${post.title}\n\nc/${community.handle} on TripTape, by u/${post.handle}`,
    });

  return (
    <Pressable onPress={onPress} disabled={full} style={styles.card}>
      <View style={styles.metaRow}>
        <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
          <Text style={[styles.avatarText, { color: tone.fg }]}>
            {post.handle[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          <Text style={styles.metaStrong}>u/{post.handle}</Text> · {timeAgo(post.hoursAgo)}
        </Text>
        {post.flair ? (
          <View style={[styles.flair, { backgroundColor: tone.bg }]}>
            <Text style={[styles.flairText, { color: tone.fg }]}>{post.flair}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{post.title}</Text>
      {post.body ? (
        <Text style={styles.body} numberOfLines={full ? undefined : 3}>
          {post.body}
        </Text>
      ) : null}
      {post.image ? <Image source={post.image} style={styles.image} resizeMode="cover" /> : null}

      <View style={styles.actions}>
        <VotePill score={post.score} vote={post.userVote} onVote={(d) => vote(post.id, d)} />
        <Pressable
          style={styles.action}
          onPress={onComment || onPress}
          hitSlop={6}
          accessibilityLabel="Comments"
        >
          <MessageCircle size={18} color={colors.textMuted} />
          <Text style={styles.actionText}>{compact(post.commentCount)}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={share} hitSlop={6} accessibilityLabel="Share">
          <Share2 size={17} color={colors.textMuted} />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// Flat, airy list item (no card/shadow): content separated by space and a
// hairline divider, like Threads / Apple News.
function getStyles(colors) {
  return StyleSheet.create({
    card: {
      paddingVertical: SPACING.lg,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.sm + 4,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontFamily: FONTS.heading, fontSize: 14 },
    meta: { flex: 1, fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    metaStrong: { fontFamily: FONTS.semibold, color: colors.text },
    flair: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
    flairText: { fontFamily: FONTS.semibold, fontSize: 12 },
    title: { fontFamily: FONTS.bold, fontSize: 18, lineHeight: 24, color: colors.ink },
    body: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      marginTop: SPACING.sm,
    },
    image: {
      width: '100%',
      height: 190,
      borderRadius: RADIUS.md,
      marginTop: SPACING.md,
      backgroundColor: colors.surfaceMuted,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.lg,
      marginTop: SPACING.md,
    },
    action: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
    actionText: { fontFamily: FONTS.semibold, fontSize: 14, color: colors.textMuted },
  });
}
