import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

// How often we let a new heading reading actually update state/camera.
// Sensor events can fire 20-60x/sec; throttling avoids re-rendering (and
// re-animating the map camera) far more often than the eye can perceive.
const THROTTLE_MS = 66; // ~15fps
// Smaller readings than this are treated as noise and ignored, so the map
// doesn't micro-jitter when the phone is basically still.
const MIN_DELTA_DEG = 0.5;
const SMOOTHING = 0.25;

const shortestAngleDelta = (from, to) => {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
};

/**
 * Smooth compass heading using the OS's own sensor-fused compass
 * (magnetometer + accelerometer + gyroscope), which is far steadier than
 * reading the magnetometer directly. Throttled and exponentially smoothed
 * for a "glide" feel when driving a rotating map camera.
 */
export default function useMapHeading() {
  const [heading, setHeading] = useState(0);
  const smoothedRef = useRef(0);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    let subscription;
    let cancelled = false;

    (async () => {
      try {
        subscription = await Location.watchHeadingAsync((reading) => {
          if (cancelled) return;
          const raw = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading;
          const delta = shortestAngleDelta(smoothedRef.current, raw);
          if (Math.abs(delta) < MIN_DELTA_DEG) return;

          smoothedRef.current = (smoothedRef.current + delta * SMOOTHING + 360) % 360;

          const now = Date.now();
          if (now - lastEmitRef.current >= THROTTLE_MS) {
            lastEmitRef.current = now;
            setHeading(smoothedRef.current);
          }
        });
      } catch (error) {
        console.warn('[useMapHeading] Error watching heading:', error);
      }
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  return heading;
}
