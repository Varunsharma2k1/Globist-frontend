import { useState } from 'react';
import { Alert, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '../../../api/media';
import { updateProfile } from '../../../api/auth';
import { useAuth } from '../../../hooks/useAuth';
import haptics from '../../../utils/haptics';

/**
 * Change / remove the profile photo. Picks a photo (square crop), uploads it
 * to R2 and saves the URL on the profile (MongoDB). `uploading` drives a
 * spinner on the avatar.
 */
export function useAvatarPicker() {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const save = async (avatar) => {
    const updated = await updateProfile({ avatar });
    await updateUser({ avatar: updated.avatar || '' });
  };

  const choose = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos access needed', 'Allow access to your photos to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // keeps the file small even if the app can't resize it
    });
    if (result.canceled || !result.assets?.length) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(result.assets[0]);
      await save(url);
      haptics.success();
    } catch (error) {
      haptics.error();
      Alert.alert(
        "Couldn't update photo",
        error.response?.data?.message || error.message || 'Check your connection and try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    setUploading(true);
    try {
      await save('');
    } catch {
      Alert.alert("Couldn't remove photo", 'Try again.');
    } finally {
      setUploading(false);
    }
  };

  /** Opens the choose / remove menu. */
  const open = () => {
    if (uploading) return;
    const hasPhoto = Boolean(user?.avatar);
    if (Platform.OS === 'ios') {
      const options = hasPhoto
        ? ['Choose new photo', 'Remove photo', 'Cancel']
        : ['Choose photo', 'Cancel'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: hasPhoto ? 1 : undefined,
        },
        (i) => {
          if (i === 0) choose();
          else if (hasPhoto && i === 1) remove();
        }
      );
      return;
    }
    Alert.alert('Profile photo', undefined, [
      { text: hasPhoto ? 'Choose new photo' : 'Choose photo', onPress: choose },
      ...(hasPhoto ? [{ text: 'Remove photo', style: 'destructive', onPress: remove }] : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return { open, uploading };
}

export default useAvatarPicker;
