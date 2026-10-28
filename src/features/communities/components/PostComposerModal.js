import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { POST_FLAIRS } from '../../../data/communities';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/** Bottom sheet for writing a new post in a community. */
export default function PostComposerModal({ visible, community, onClose, onSubmit }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [flair, setFlair] = useState(POST_FLAIRS[0]);

  const close = () => {
    setTitle('');
    setBody('');
    setFlair(POST_FLAIRS[0]);
    onClose();
  };

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), body: body.trim(), flair });
    close();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.headRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heading}>New post</Text>
              <Text style={styles.sub}>in c/{community.handle}</Text>
            </View>
            <Pressable onPress={close} hitSlop={10} accessibilityLabel="Close">
              <X size={22} color={colors.ink} />
            </Pressable>
          </View>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your post a title"
            placeholderTextColor={colors.textMuted}
            maxLength={120}
          />
          <TextInput
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="Share your thoughts, a question or a trip update…"
            placeholderTextColor={colors.textMuted}
            multiline
          />

          <Text style={styles.label}>Flair</Text>
          <View style={styles.flairRow}>
            {POST_FLAIRS.map((f) => {
              const active = f === flair;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFlair(f)}
                  style={[
                    styles.chip,
                    { backgroundColor: active ? colors.ink : colors.surfaceMuted },
                  ]}
                >
                  <Text
                    style={[styles.chipText, { color: active ? colors.inkContrast : colors.text }]}
                  >
                    {f}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            title="Post"
            onPress={submit}
            style={[{ marginTop: SPACING.lg }, !title.trim() && { opacity: 0.4 }]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: RADIUS.lg,
      borderTopRightRadius: RADIUS.lg,
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    heading: { fontFamily: FONTS.heading, fontSize: 20, color: colors.ink },
    sub: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
    titleInput: {
      fontFamily: FONTS.heading,
      fontSize: 17,
      color: colors.ink,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
    },
    bodyInput: {
      fontFamily: FONTS.body,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      minHeight: 110,
      textAlignVertical: 'top',
      marginTop: SPACING.sm,
    },
    label: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
      marginTop: SPACING.md,
      marginBottom: SPACING.xs,
    },
    flairRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.pill },
    chipText: { fontFamily: FONTS.semibold, fontSize: 13 },
  });
}
