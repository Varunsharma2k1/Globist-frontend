import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tokenStore from '../../../api/tokenStore';
import { useAuth } from '../../../hooks/useAuth';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { createReel, uploadReelMedia, publishReel } from '../../../api';

const STAGE_LABEL = { uploading: 'Uploading video…', processing: 'Processing video…', ready: 'Publishing…' };

// The R2 upload needs a server session; without one fall back to the legacy path.
async function hasRealSession() {
  await tokenStore.load();
  return tokenStore.hasSession();
}

/**
 * Owns the Post Reel form's state — media pick, caption/location, category
 * — and submission.
 *
 * Two ways in:
 * - the + button: a plain tape, never tagged to an agency;
 * - "Post tape" on a booked trip (My Trips / invoice): the tape is tied to
 *   that booking. The server checks the booking is the user's own and takes
 *   the agency from it, so tagging can't be faked. It also credits the
 *   traveller's wallet (see features/wallet/utils/ledger). The reel is
 * saved to the on-device ledger, which drives the feed / agency page /
 * wallet for now; uploading the video and mirroring the reel to the backend
 * are best-effort, so posting works offline or with a mock session too.
 *
 * @param {Object} navigation
 * @param {string} [initialBookingId] - the booked trip this tape is for (fixed, not changeable)
 */
export function usePostReelForm(navigation, initialBookingId) {
  const { user } = useAuth();
  const { myBookings, postReel } = useTripLedger();
  const initialBooking = myBookings.find((b) => b._id === initialBookingId);

  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState(initialBooking?.trip?.location || '');
  const [media, setMedia] = useState(null); // { uri, type, name }
  const [imageType, setImageType] = useState('mountain');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(null); // uploading | processing | ready

  // Only set when opened from a booked trip; the + button never links one.
  const linkedBooking = initialBooking || null;

  const handlePickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Allow video access to upload a tape.');
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
      mimeType: asset.mimeType,
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
      Alert.alert('Video Required', 'Please upload a video to post a tape.');
      return;
    }

    if (linkedBooking?.reelId) {
      Alert.alert('Already posted', 'You have already posted a tape for this trip.');
      return;
    }

    setLoading(true);
    try {
      // The server derives the agency from this booking (its own id: backendId).
      const details = { caption, location, imageType, bookingId: linkedBooking?.backendId || undefined };
      let mediaUrl;
      let backendReel = null;

      if (await hasRealSession()) {
        // R2 pipeline: direct upload -> transcode -> HLS on the CDN.
        backendReel = await publishReel(media, details, setStage);
        mediaUrl = backendReel.mediaUrl || media.uri;
      } else {
        mediaUrl = await uploadReelMedia(media).catch(() => media.uri);
        backendReel = await createReel({ ...details, mediaUrl }).catch(() => null);
      }

      const { reward } = postReel({
        user,
        bookingId: linkedBooking?._id,
        caption,
        location,
        mediaUrl,
        imageType,
        backendId: backendReel?._id || null,
      });

      const stillProcessing = backendReel?.status === 'processing';
      Alert.alert(
        stillProcessing ? 'Tape uploaded!' : 'Tape published!',
        stillProcessing
          ? "It's still processing and will show up in the feed in a minute."
          : reward
          ? `Thanks for tagging ${linkedBooking.agency?.name || 'the agency'}. ₹${reward.toLocaleString('en-IN')} has been added to your wallet.`
          : 'Your tape is live in the feed.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Couldn't post tape", error.message || 'Please try again.');
    } finally {
      setLoading(false);
      setStage(null);
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
    linkedBooking,
    loading,
    loadingLabel: stage ? STAGE_LABEL[stage] : null,
    previewReel,
    handleSubmit,
  };
}

export default usePostReelForm;
