import React, { useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { updateProfile } from '../../../api/auth';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import haptics from '../../../utils/haptics';
import { absoluteMediaUrl } from '../../../utils/mediaUrl';
import { useAvatarPicker } from '../hooks/useAvatarPicker';
import { SPACING, LAYOUT, FONTS } from '../../../theme';

const BIO_MAX = 160;

/** Name, bio and home location, saved to MongoDB (PUT /users/profile). */
export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [saving, setSaving] = useState(false);
  const avatar = useAvatarPicker();

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
      });
      const { wishlist, ...rest } = updated;
      await updateUser(rest);
      haptics.success();
      navigation.goBack();
    } catch (error) {
      haptics.error();
      Alert.alert(
        "Couldn't save",
        error.response?.data?.message || 'Check your connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit profile" onBack={() => navigation.goBack()} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          maxLength={80}
        />
        <Input
          label="Bio"
          value={bio}
          onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
          placeholder="Mountains over beaches. Chasing sunrises."
          multiline
        />
        <Text style={styles.counter}>
          {bio.length}/{BIO_MAX}
        </Text>
        <Input
          label="Home city"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Pune, Maharashtra"
          maxLength={80}
        />
        <Button title="Save" loading={saving} onPress={save} style={{ marginTop: SPACING.md }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    photoWrap: { alignItems: 'center', marginBottom: SPACING.lg },
    photo: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    photoInitial: { fontFamily: FONTS.heading, fontSize: 28, color: colors.ink },
    photoBusy: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoLink: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.ink,
      marginTop: SPACING.sm,
    },
    counter: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      textAlign: 'right',
      marginTop: -SPACING.sm,
      marginBottom: SPACING.sm,
    },
  });
}
