import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { getAgencyTrips } from '../../../api';
import { buildReferral } from '../utils/reelFormat';

/**
 * Drives the reel "Book Trip" button: resolves the trip the reel's agency
 * runs, then opens TripDetail for that exact trip with the creator's
 * referral context attached (carried on to Booking from there).
 *
 * Reels posted in the app after a trip link that exact trip (`reel.trip`).
 * Older reels only reference an agency, so the trip is looked up via
 * GET /agencies/:id. Every seeded agency runs a single trip; when one runs
 * several, the first is used.
 *
 * @param {Object} navigation
 * @param {string} [currentUserId]
 */
export function useReelBooking(navigation, currentUserId) {
  const [pendingReelId, setPendingReelId] = useState(null);
  const pendingRef = useRef(false);
  const tripCacheRef = useRef({});

  const bookReel = useCallback(
    async (reel) => {
      if (reel.trip?._id) {
        navigation.navigate('TripDetail', {
          tripId: reel.trip._id,
          title: reel.trip.title,
          referral: buildReferral(reel, currentUserId),
        });
        return;
      }
      const agencyId = reel.agency?._id;
      if (!agencyId) {
        // No agency on this reel — nothing specific to book, so fall back to
        // browsing trips directly (an unattributed, independent booking).
        navigation.navigate('ExploreTab');
        return;
      }
      if (pendingRef.current) return;
      pendingRef.current = true;
      setPendingReelId(reel._id);

      try {
        let trip = tripCacheRef.current[agencyId];
        if (!trip) {
          const { trips } = await getAgencyTrips(agencyId);
          trip = trips[0];
          if (trip) tripCacheRef.current[agencyId] = trip;
        }

        if (!trip) {
          Alert.alert(
            'No trips listed yet',
            `${reel.agency.name || 'This agency'} hasn't published a bookable trip yet.`
          );
          return;
        }

        navigation.navigate('TripDetail', {
          tripId: trip._id,
          title: trip.title,
          referral: buildReferral(reel, currentUserId),
        });
      } catch (error) {
        console.warn('[useReelBooking] Error resolving trip:', error);
        Alert.alert("Couldn't open this trip", 'Check your connection and try again.');
      } finally {
        pendingRef.current = false;
        setPendingReelId(null);
      }
    },
    [navigation, currentUserId]
  );

  return { bookReel, pendingReelId };
}

export default useReelBooking;
