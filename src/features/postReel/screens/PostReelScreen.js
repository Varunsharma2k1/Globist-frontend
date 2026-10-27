import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { usePostReelForm } from '../hooks/usePostReelForm';
import MediaUploadCard from '../components/MediaUploadCard';
import AffiliateToggleRow from '../components/AffiliateToggleRow';
import CategoryPicker from '../components/CategoryPicker';
import ReelPreviewModal from '../components/ReelPreviewModal';

/**
 * PostReelScreen Component
 *
 * Form for travellers and agencies to post new travel clips. Only video is
 * accepted (no photos), picked from the device library, with an inline
 * Instagram-style preview once selected. Form state/submission lives in
 * usePostReelForm; each visual section is its own component (see
 * ../components) — this file is just the layout.
 */
export default function PostReelScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const insets = useSafeAreaInsets();
  const [previewVisible, setPreviewVisible] = useState(false);
  const form = usePostReelForm(navigation);

  return (
    <View style={styles.container}>
      <Header title="Post Travel Reel" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={typography.h2}>Share Your Journey</Text>
          <Text style={styles.subtitle}>Post short travel videos and inspire fellow explorers.</Text>

          <MediaUploadCard
            media={form.media}
            onPick={form.handlePickMedia}
            onOpenPreview={() => setPreviewVisible(true)}
          />

          <Input
            label="Caption"
            value={form.caption}
            onChangeText={form.setCaption}
            placeholder="e.g. Sunset view from Triund Top"
            multiline
          />

          <Input
            label="Destination / Location"
            value={form.location}
            onChangeText={form.setLocation}
            placeholder="e.g. Dharamshala, Himachal Pradesh"
          />

          <AffiliateToggleRow
            isAffiliate={form.isAffiliate}
            onToggle={form.setIsAffiliate}
            agencyId={form.agencyId}
            onChangeAgencyId={form.setAgencyId}
          />

          <CategoryPicker value={form.imageType} onChange={form.setImageType} />

          <Button
            title="Publish Reel"
            onPress={form.handleSubmit}
            loading={form.loading}
            style={{ marginTop: SPACING.sm }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ReelPreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        reel={form.previewReel}
      />
    </View>
  );
}

function getStyles(colors, typography) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    subtitle: {
      ...typography.body,
      marginTop: SPACING.xs,
      marginBottom: SPACING.lg,
    },
  });
}
