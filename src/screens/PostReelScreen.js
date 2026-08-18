import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mountain, Waves, Sun } from 'lucide-react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { createReel } from '../api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

const CATEGORIES = [
  { key: 'mountain', icon: Mountain, label: 'Mountain' },
  { key: 'beach', icon: Waves, label: 'Beach' },
  { key: 'desert', icon: Sun, label: 'Desert' },
];

/**
 * PostReelScreen Component
 *
 * Form for travelers and agencies to post new travel clips.
 * Uses `createReel` API service module.
 */
export default function PostReelScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [imageType, setImageType] = useState('mountain');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!caption || !location) {
      Alert.alert('Required Fields', 'Please add a caption and destination location.');
      return;
    }

    setLoading(true);
    try {
      await createReel({
        caption,
        location,
        mediaUrl,
        imageType,
      });
      Alert.alert('Success', 'Your reel has been submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to post reel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Post Travel Reel" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}>
        <Text style={TYPOGRAPHY.h2}>Share Your Journey</Text>
        <Text style={[TYPOGRAPHY.body, { marginTop: SPACING.xs, marginBottom: SPACING.lg }]}>
          Post short travel videos and inspire fellow explorers.
        </Text>

        <Input
          label="Caption"
          value={caption}
          onChangeText={setCaption}
          placeholder="e.g. Sunset view from Triund Top"
          multiline
        />

        <Input
          label="Destination / Location"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Dharamshala, Himachal Pradesh"
        />

        <Input
          label="Media URL (Video / Photo link)"
          value={mediaUrl}
          onChangeText={setMediaUrl}
          placeholder="https://..."
        />

        <Text style={styles.typeLabel}>Category Vibe</Text>
        <View style={styles.typeRow}>
          {CATEGORIES.map((t) => {
            const Icon = t.icon;
            const active = imageType === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.typeCard, active && styles.typeCardActive]}
                onPress={() => setImageType(t.key)}
              >
                <Icon size={22} color={active ? COLORS.white : COLORS.ink} strokeWidth={1.75} />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title="Publish Reel"
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: SPACING.lg }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  typeLabel: {
    fontFamily: FONTS.body,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  typeCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  typeCardActive: {
    backgroundColor: COLORS.ink,
  },
  typeText: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.ink,
  },
  typeTextActive: {
    color: COLORS.white,
  },
});
