/**
 * usePlaces — the ONE place pin data comes from.
 *
 * Today it returns the bundled mock file. To use your backend, set
 * PLACES_API_URL to your endpoint; it must return the same JSON shape:
 *   [{ id, name, state, lat, lng, count }]
 *
 * The last successful API response is cached in AsyncStorage, so the map shows
 * pins instantly on the next launch (and offline) while fresh data loads.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MOCK_PLACES from '../data/mockPlaces.json';

// 👉 Switch to your API here, e.g. 'https://api.triptape.app/api/places'. null = use mock data.
export const PLACES_API_URL = null;

const CACHE_KEY = 'triptape.indiaMap.places.v1';
const TIMEOUT_MS = 10000;

function isValidPlace(p) {
  return p && typeof p.id === 'string' && typeof p.lat === 'number' && typeof p.lng === 'number' && typeof p.state === 'string';
}

async function fetchPlaces() {
  if (!PLACES_API_URL) return MOCK_PLACES;
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
  const [places, setPlaces] = useState(PLACES_API_URL ? [] : MOCK_PLACES);
  const [loading, setLoading] = useState(!!PLACES_API_URL);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await fetchPlaces();
      if (!mounted.current) return;
      setPlaces(fresh);
      setError(null);
      if (PLACES_API_URL) AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(() => {});
    } catch (e) {
      if (mounted.current) setError(e.message || 'Could not load places');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    // Show cached pins first (instant), then refresh from the network.
    if (PLACES_API_URL) {
      AsyncStorage.getItem(CACHE_KEY)
        .then((raw) => {
          const cached = raw && JSON.parse(raw);
          if (mounted.current && Array.isArray(cached) && cached.length) setPlaces(cached);
        })
        .catch(() => {})
        .finally(refresh);
    }
    return () => { mounted.current = false; };
  }, [refresh]);

  return { places, loading, error, refresh };
}
