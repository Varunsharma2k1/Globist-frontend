import React, { useRef } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, X } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import ReelCommentRow, { CommentAvatar } from './ReelCommentRow';

/**
 * Comments bottom sheet — a real Modal (not part of the reel's own overlay
 * stack) since it needs to sit on the app's normal light/dark surface, not
 * the reel's always-dark video backdrop. Comments are demo data, local to
 * this session.
 */
export default function ReelCommentsSheet({
  visible,
  comments,
  commentText,
  onChangeText,
  onPostComment,
  onClose,
  currentUserName,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const canPost = commentText.trim().length > 0;

  const handlePost = () => {
    // New comments go on top, so bring the list back up to show it.
    if (onPostComment()) listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close comments">
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.commentsSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={{ width: 20 }} />
            <Text style={styles.sheetTitle}>Comments</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close comments"
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={comments}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <ReelCommentRow comment={item} />}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptyText}>Start the conversation.</Text>
              </View>
            }
          />

          <View style={[styles.commentInputRow, { paddingBottom: SPACING.sm + insets.bottom }]}>
            <CommentAvatar name={currentUserName || 'You'} />
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={onChangeText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="send"
              onSubmitEditing={handlePost}
              submitBehavior="submit"
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.commentPostBtn, canPost && { backgroundColor: colors.ink }]}
              onPress={handlePost}
              disabled={!canPost}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Post comment"
            >
              <Send size={16} color={canPost ? colors.inkContrast : colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    commentsSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      maxHeight: '75%',
      minHeight: '45%',
      paddingTop: SPACING.sm,
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.divider,
      alignSelf: 'center',
      marginBottom: SPACING.sm,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    sheetTitle: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
    },
    commentsList: {
      flexGrow: 1,
    },
    commentsContent: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    emptyTitle: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
    },
    emptyText: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    commentInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
      backgroundColor: colors.background,
    },
    commentInput: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.pill,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm + 2,
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.ink,
    },
    commentPostBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
