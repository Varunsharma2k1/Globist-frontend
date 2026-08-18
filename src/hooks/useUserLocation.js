import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

/**
 * One-shot foreground location fetch for the Explore radar. Returns the
 * coords once resolved, plus a status so the screen can render a permission
 * prompt or error state instead of a silently stuck radar.
 */
export default function useUserLocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | granted | denied | error

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status: permission } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (permission !== 'granted') {
          setStatus('denied');
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus('granted');
      } catch (error) {
        console.warn('[useUserLocation] Error resolving location:', error);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, status };
}
