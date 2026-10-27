import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExploreTrips } from '../../../api';
import { STORAGE_KEYS } from '../../../config';
import { useAuth } from '../../../hooks/useAuth';
import { agencyKey, sameAgency } from '../utils/agencyProfile';

const EMPTY = { edits: {}, comments: [] };

/**
 * Everything the agency profile screen shows. Frontend-only: an agency's
 * edits and the visitors' comments are kept on this device (AsyncStorage,
 * one entry per agency) until the backend has endpoints for them. Trips come
 * from the same catalogue Explore uses, filtered to this agency.
 *
 * @param {Object} baseAgency - the agency object carried from the tapped card/reel
 */
export function useAgencyProfile(baseAgency) {
  const { user } = useAuth();
  const key = agencyKey(baseAgency);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stored, setStored] = useState(EMPTY);

  useEffect(() => {
    let alive = true;
    getExploreTrips()
      .then((data) => {
        if (alive) setTrips((data.trips || []).filter((t) => sameAgency(t.agency, baseAgency)));
      })
      .catch((error) => console.warn('[useAgencyProfile] trips:', error))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [baseAgency]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.AGENCY_PROFILES)
      .then((raw) => {
        const all = raw ? JSON.parse(raw) : {};
        setStored({ ...EMPTY, ...(all[key] || {}) });
      })
      .catch(() => {});
  }, [key]);

  const persist = useCallback(
    (next) => {
      setStored(next);
      AsyncStorage.getItem(STORAGE_KEYS.AGENCY_PROFILES)
        .then((raw) => {
          const all = raw ? JSON.parse(raw) : {};
          return AsyncStorage.setItem(
            STORAGE_KEYS.AGENCY_PROFILES,
            JSON.stringify({ ...all, [key]: next })
          );
        })
        .catch((error) => console.warn('[useAgencyProfile] save:', error));
    },
    [key]
  );

  const saveProfile = useCallback(
    (edits) => persist({ ...stored, edits: { ...stored.edits, ...edits } }),
    [persist, stored]
  );

  const addComment = useCallback(
    (text) => {
      const comment = {
        id: `c-${Date.now()}`,
        author: user?.name || 'Traveller',
        text: text.trim(),
        createdAt: Date.now(),
      };
      persist({ ...stored, comments: [comment, ...stored.comments] });
    },
    [persist, stored, user?.name]
  );

  const agency = useMemo(() => ({ ...baseAgency, ...stored.edits }), [baseAgency, stored.edits]);

  return {
    agency,
    trips,
    loading,
    comments: stored.comments,
    // Only agency accounts can edit a profile (stored on-device for now).
    canEdit: user?.role === 'agency',
    saveProfile,
    addComment,
  };
}

export default useAgencyProfile;
