import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import Header from '../../../components/Header';
import PostCard from '../components/PostCard';
import CommentRow from '../components/CommentRow';
import JoinButton from '../components/JoinButton';
import { useCommunities, useCommunityData } from '../../../hooks/useCommunities';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { getCommunity } from '../../../data/communities';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

/** A single post with its full text and comment thread, plus a comment box. */
export default function PostDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { toggleJoin, addComment } = useCommunities();
  const { getPostById, isJoined } = useCommunityData();
  const [text, setText] = useState('');
  const styles = getStyles(colors);

  const post = getPostById(route.params?.postId);
  const community = post && getCommunity(post.communityId);
  if (!post || !community) return <View style={styles.container} />;

  const joined = isJoined(community.id);
  const send = () => {
    if (!text.trim()) return;
    addComment(post.id, text.trim(), user);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title={`c/${community.handle}`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PostCard post={post} community={community} full />

        <Text style={styles.commentsTitle}>
          Comments <Text style={styles.count}>{post.commentCount}</Text>
        </Text>
        {post.comments.map((comment) => (
          <CommentRow key={comment.id} comment={comment} />
        ))}
        {post.commentCount > post.comments.length && (
          <Text style={styles.more}>
            + {post.commentCount - post.comments.length} more comments in the full thread
          </Text>
        )}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: SPACING.sm + insets.bottom }]}>
        {joined ? (
          <>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Add a comment"
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.send, !text.trim() && { opacity: 0.4 }]}
              onPress={send}
              accessibilityLabel="Send comment"
            >
              <Send size={18} color={colors.inkContrast} />
            </Pressable>
          </>
        ) : (
          <View style={styles.joinPrompt}>
            <Text style={styles.joinText}>Join c/{community.handle} to comment</Text>
            <JoinButton compact joined={false} onPress={() => toggleJoin(community.id)} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.md + 4,
      paddingBottom: SPACING.xl,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    commentsTitle: {
      fontFamily: FONTS.bold,
      fontSize: 17,
      color: colors.ink,
      marginTop: SPACING.xl,
      marginBottom: SPACING.sm,
    },
    count: { color: colors.textMuted },
    more: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: SPACING.md,
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      fontFamily: FONTS.body,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.pill,
      paddingHorizontal: SPACING.md,
      paddingVertical: 11,
    },
    send: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.ink,
      alignItems: 'center',
      justifyContent: 'center',
    },
    joinPrompt: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    joinText: { fontFamily: FONTS.semibold, fontSize: 14, color: colors.text },
  });
}
