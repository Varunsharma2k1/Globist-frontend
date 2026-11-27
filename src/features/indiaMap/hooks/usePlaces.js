/**
 * usePlaces — the ONE place pin data comes from: GET /api/places, i.e. real
 * tapes in MongoDB grouped by their tagged location
 *   [{ id, name, state, lat, lng, count }]   (count = tapes there)
 * Locations with 0 tapes aren't returned, so they never show on the map.
 *
 * The last response is cached in AsyncStorage, so pins appear instantly on
 * the next launch (and offline) while fresh data loads. The map screen
 * refreshes on focus, so a newly posted tape's pin shows up quickly.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CONFIG } from '../../../config';

export const PLACES_API_URL = `${CONFIG.API_BASE_URL}/places`;

const CACHE_KEY = 'triptape.indiaMap.places.v2'; // v2: real data (drop old mock cache)
const TIMEOUT_MS = 10000;

function isValidPlace(p) {
  return p && typeof p.id === 'string' && typeof p.lat === 'number' && typeof p.lng === 'number' && typeof p.state === 'string';
}

async function fetchPlaces() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(PLACES_API_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json) ? json : json.places || json.data;
    if (!Array.isArray(list)) throw new Error('Places API: expected an array');
    return list.filter(isValidPlace);
  } finally {
    clearTimeout(timer);
  }
}

export function usePlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await fetchPlaces();
      if (!mounted.current) return;
      setPlaces(fresh);
      setError(null);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(() => {});
    } catch (e) {
      if (mounted.current) setError(e.message || 'Could not load places');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    // Show cached pins first (instant), then refresh from the network.
    AsyncStorage.getItem(CACHE_KEY)
      .then((raw) => {
        const cached = raw && JSON.parse(raw);
        if (mounted.current && Array.isArray(cached) && cached.length) setPlaces(cached);
      })
      .catch(() => {});
    return () => { mounted.current = false; };
  }, []);

  // Fresh pins whenever the screen comes into view (new tapes show up).
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { places, loading, error, refresh };
}
