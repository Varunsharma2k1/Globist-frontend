import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { SPACING, LAYOUT } from '../../../theme';
import { usePostReelForm } from '../hooks/usePostReelForm';
import MediaUploadCard from '../components/MediaUploadCard';
import TaggedTripCard from '../components/TaggedTripCard';
import CategoryPicker from '../components/CategoryPicker';
import ReelPreviewModal from '../components/ReelPreviewModal';

/**
 * PostReelScreen Component
 *
 * Form for travellers and agencies to post new travel clips. Only video is
 * accepted (no photos), picked from the device library, with an inline
 * Instagram-style preview once selected. From the + button it's a plain
 * tape; opened from a booked trip it's tied to that trip's agency (one tape
 * per trip, earns wallet credit) — see TaggedTripCard. Form state/submission lives in
 * usePostReelForm; each visual section is its own component (see
 * ../components) — this file is just the layout.
 */
export default function PostReelScreen({ navigation, route }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const insets = useSafeAreaInsets();
  const [previewVisible, setPreviewVisible] = useState(false);
  const form = usePostReelForm(navigation, route.params?.bookingId);

  return (
    <View style={styles.container}>
      <Header title="Post Travel Tape" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Text style={typography.h2}>Share Your Journey</Text>
        <Text style={styles.subtitle}>
          {form.linkedBooking
            ? 'Share a tape from your trip. It will appear on the agency’s profile too.'
            : 'Post short travel videos and inspire fellow explorers.'}
        </Text>

        {form.linkedBooking ? <TaggedTripCard booking={form.linkedBooking} /> : null}

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


        <CategoryPicker value={form.imageType} onChange={form.setImageType} />

        <Button
          title="Publish Tape"
          loadingTitle={form.loadingLabel}
          onPress={form.handleSubmit}
          loading={form.loading}
          style={{ marginTop: SPACING.sm }}
        />
      </KeyboardAwareScrollView>

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
