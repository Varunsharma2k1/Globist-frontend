import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { createReel, uploadReelMedia } from '../../../api';

/**
 * Owns the Post Reel form's state — media pick, caption/location, category,
 * linked trip — and submission.
 *
 * Linking a completed trip tags the reel with that trip's agency and credits
 * the traveller's wallet (see features/wallet/utils/ledger). The reel is
 * saved to the on-device ledger, which drives the feed / agency page /
 * wallet for now; uploading the video and mirroring the reel to the backend
 * are best-effort, so posting works offline or with a mock session too.
 *
 * @param {Object} navigation
 * @param {string} [initialBookingId] - preselected trip when opened from My Trips
 */
export function usePostReelForm(navigation, initialBookingId) {
  const { user } = useAuth();
  const { myBookings, postReel } = useTripLedger();
  const initialBooking = myBookings.find((b) => b._id === initialBookingId);

  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState(initialBooking?.trip?.location || '');
  const [media, setMedia] = useState(null); // { uri, type, name }
  const [imageType, setImageType] = useState('mountain');
  const [linkedBookingId, setLinkedBookingId] = useState(initialBooking?._id || null);
  const [loading, setLoading] = useState(false);

  const linkedBooking = myBookings.find((b) => b._id === linkedBookingId) || null;

  const linkBooking = (bookingId) => {
    setLinkedBookingId(bookingId);
    const booking = myBookings.find((b) => b._id === bookingId);
    if (booking?.trip?.location && !location) setLocation(booking.trip.location);
  };

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
    agency: linkedBooking?.agency,
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
      const mediaUrl = await uploadReelMedia(media).catch(() => media.uri);
      const agencyId = linkedBooking?.agency?._id;
      const backendReel = await createReel({
        caption,
        location,
        mediaUrl,
        imageType,
        agencyId,
        isAffiliate: Boolean(agencyId),
      }).catch(() => null);

      const { reward } = postReel({
        user,
        bookingId: linkedBooking?._id,
        caption,
        location,
        mediaUrl,
        imageType,
        backendId: backendReel?._id || null,
      });

      Alert.alert(
        'Reel published!',
        reward
          ? `Thanks for tagging ${linkedBooking.agency?.name || 'the agency'}. ₹${reward.toLocaleString('en-IN')} has been added to your wallet.`
          : 'Your reel is live in the feed.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Couldn't post reel", error.message || 'Please try again.');
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
    bookings: myBookings,
    linkedBookingId,
    linkBooking,
    loading,
    previewReel,
    handleSubmit,
  };
}

export default usePostReelForm;
