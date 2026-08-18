import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { createReel, uploadReelMedia } from '../../../api';

/**
 * Owns the Post Reel form's state — media pick, caption/location, category,
 * affiliate toggle — and submission (upload media, then create the reel).
 */
export function usePostReelForm(navigation) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState(null); // { uri, type, name }
  const [imageType, setImageType] = useState('mountain');
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [agencyId, setAgencyId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Allow video access to upload a reel.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.8,
      videoMaxDuration: 90,
    });

    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    setMedia({
      uri: asset.uri,
      type: 'video/mp4',
      name: asset.fileName || 'reel-video.mp4',
    });
  };

  // Builds a reel-shaped object (no `_id`, so ReelItem treats it as an
  // unsaved preview — zero likes/comments, no network calls) for the
  // Instagram-style "Preview" modal.
  const previewReel = media && {
    mediaUrl: media.uri,
    caption,
    location,
    imageType,
    likes: 0,
    creatorHandle: `@${(user?.name || 'explorer').toLowerCase().replace(/\s+/g, '_')}`,
    creatorTier: `${user?.explorerTier || 'Gold'} Creator`,
    user,
  };

  const handleSubmit = async () => {
    if (!caption || !location) {
      Alert.alert('Required Fields', 'Please add a caption and destination location.');
      return;
    }
    if (!media) {
      Alert.alert('Video Required', 'Please upload a video to post a reel.');
      return;
    }

    setLoading(true);
    try {
      const mediaUrl = await uploadReelMedia(media);

      await createReel({
        caption,
        location,
        mediaUrl,
        imageType,
        agencyId: isAffiliate ? agencyId.trim() || undefined : undefined,
        isAffiliate,
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

  return {
    caption,
    setCaption,
    location,
    setLocation,
    media,
    handlePickMedia,
    imageType,
    setImageType,
    isAffiliate,
    setIsAffiliate,
    agencyId,
    setAgencyId,
    loading,
    previewReel,
    handleSubmit,
  };
}

export default usePostReelForm;
