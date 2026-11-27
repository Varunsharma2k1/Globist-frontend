import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getExploreTrips,
  getAgencyTrips,
  getAgencyReviews,
  postAgencyReview,
  deleteReview,
} from '../../../api';
import { STORAGE_KEYS } from '../../../config';
import { useAuth } from '../../../hooks/useAuth';
import { agencyKey, sameAgency } from '../utils/agencyProfile';

const isServerId = (id) => /^[a-f0-9]{24}$/.test(String(id || ''));

/**
 * Everything the agency profile screen shows.
 *
 * Real agencies (MongoDB id) — all from the server:
 *   - agency details + its trips: GET /agencies/:id
 *   - reviews: GET/POST /reviews/agency/:id (with "Verified traveller" badges)
 * App-only demo agencies (no server id) keep the old fallbacks: trips from
 * the Explore catalogue by name, nothing to review.
 *
 * Profile edits by the agency owner are still kept on this device until the
 * agency dashboard has server endpoints.
 *
 * @param {Object} baseAgency - the agency object carried from the tapped card/reel
 */
export function useAgencyProfile(baseAgency) {
  const { user } = useAuth();
  const key = agencyKey(baseAgency);
  const agencyId = isServerId(baseAgency?._id) ? baseAgency._id : null;

  const [serverAgency, setServerAgency] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [edits, setEdits] = useState({});

  // Agency + trips.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const load = agencyId
      ? getAgencyTrips(agencyId).then(({ agency, trips: list }) => {
          if (!alive) return;
          setServerAgency(agency);
          setTrips(list);
        })
      : getExploreTrips().then((data) => {
          if (alive) setTrips((data.trips || []).filter((t) => sameAgency(t.agency, baseAgency)));
        });
    load
      .catch((error) => console.warn('[useAgencyProfile] trips:', error?.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [agencyId, baseAgency]);

  // Reviews.
  const loadReviews = useCallback(async () => {
    if (!agencyId) return;
    try {
      const data = await getAgencyReviews(agencyId);
      setReviews(data.reviews || []);
      setReviewTotal(data.total || 0);
    } catch (error) {
      console.warn('[useAgencyProfile] reviews:', error?.message);
    }
  }, [agencyId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  /** Posts a review; throws with a user-readable message on failure. */
  const addComment = useCallback(
    async (text) => {
      if (!agencyId) throw new Error('Reviews are not available for this agency yet.');
      try {
        const review = await postAgencyReview(agencyId, text);
        setReviews((list) => [review, ...list]);
        setReviewTotal((t) => t + 1);
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not post. Check your connection.');
      }
    },
    [agencyId]
  );

  const removeComment = useCallback(async (reviewId) => {
    await deleteReview(reviewId);
    setReviews((list) => list.filter((r) => r._id !== reviewId));
    setReviewTotal((t) => Math.max(0, t - 1));
  }, []);

  // Owner edits (device-only for now).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.AGENCY_PROFILES)
      .then((raw) => setEdits((raw ? JSON.parse(raw) : {})[key]?.edits || {}))
      .catch(() => {});
  }, [key]);

  const saveProfile = useCallback(
    (next) => {
      const merged = { ...edits, ...next };
      setEdits(merged);
      AsyncStorage.getItem(STORAGE_KEYS.AGENCY_PROFILES)
        .then((raw) => {
          const all = raw ? JSON.parse(raw) : {};
          return AsyncStorage.setItem(
            STORAGE_KEYS.AGENCY_PROFILES,
            JSON.stringify({ ...all, [key]: { ...(all[key] || {}), edits: merged } })
          );
        })
        .catch((error) => console.warn('[useAgencyProfile] save:', error));
    },
    [edits, key]
  );

  const agency = useMemo(
    () => ({ ...baseAgency, ...(serverAgency || {}), ...edits }),
    [baseAgency, serverAgency, edits]
  );

  // Only this agency's own account can edit it (not any agency account).
  const ownerId = agency.owner?._id || agency.owner;
  const canEdit = Boolean(user?._id && ownerId && String(ownerId) === String(user._id));

  return {
    agency,
    trips,
    loading,
    comments: reviews,
    commentsTotal: reviewTotal,
    canReview: Boolean(agencyId),
    canEdit,
    saveProfile,
    addComment,
    removeComment,
  };
}

export default useAgencyProfile;
