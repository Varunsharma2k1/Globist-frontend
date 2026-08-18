import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Send, X } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Comments bottom sheet — a real Modal (not part of the reel's own overlay
 * stack) since it needs to sit on the app's normal light/dark surface, not
 * the reel's always-dark video backdrop.
 */
export default function ReelCommentsSheet({
  visible,
  comments,
  commentText,
  onChangeText,
  onPostComment,
  onClose,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.commentsSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Comments · {comments.length}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsList} keyboardShouldPersistTaps="handled">
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <User size={14} color={colors.ink} />
                </View>
                <View style={styles.commentBody}>
                  <Text style={styles.commentAuthor}>{c.author}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.commentInputRow, { paddingBottom: SPACING.sm + insets.bottom }]}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={onChangeText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="send"
              onSubmitEditing={onPostComment}
            />
            <TouchableOpacity
              style={styles.commentPostBtn}
              onPress={onPostComment}
              disabled={!commentText.trim()}
              activeOpacity={0.7}
            >
              <Send size={18} color={commentText.trim() ? colors.ink : colors.textMuted} />
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
      maxHeight: '70%',
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
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    sheetTitle: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
    },
    commentsList: {
      paddingHorizontal: SPACING.lg,
    },
    commentRow: {
      flexDirection: 'row',
      paddingVertical: SPACING.sm,
      gap: SPACING.sm,
    },
    commentAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commentBody: {
      flex: 1,
    },
    commentAuthor: {
      fontFamily: FONTS.heading,
      fontSize: 12,
      color: colors.ink,
      marginBottom: 2,
    },
    commentText: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
    },
    commentInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
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
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
