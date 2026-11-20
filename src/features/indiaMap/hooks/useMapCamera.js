/**
 * useMapCamera — pan / pinch / double-tap / tap gestures and camera animations.
 *
 * Camera = three Reanimated shared values: `scale` (screen px per map unit),
 * `tx`, `ty` (screen offset). screen = map * scale + t. All gesture math runs
 * on the UI thread.
 *
 * Stability rules (each one fixed a real crash/bug):
 *  - Uses the long-stable Gesture.Pan()/Pinch()/Tap() builder API with a flat
 *    Gesture.Simultaneous(...) — no nested composed gestures.
 *  - Only plain-number shared values (no objects).
 *  - JS is notified only when a gesture/animation ENDS, never mid-pinch.
 *  - The initial camera is computed from the measured view size directly
 *    (never by reading a shared value right after writing it — that returned
 *    a stale 1×1 size and left the map blank until you pressed ⤢).
 *  - Every value is checked for NaN/Infinity before it reaches Skia.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSharedValue, withDecay, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture } from 'react-native-gesture-handler';
import { MAP_W, MAP_H, project } from '../geo/mapGeometry';
import { MAP_CONFIG } from '../config/mapTheme';

// Gentle ease-in-out: starts softly, glides, lands softly.
const EASE = Easing.bezier(0.45, 0, 0.2, 1);

/** Scale at which all of India fits the view (= zoom 1). */
function baseScaleFor(vw, vh) {
  'worklet';
  const p = MAP_CONFIG.fitPadding;
  return Math.max(0.0001, Math.min((vw - p * 2) / MAP_W, (vh - p * 2) / MAP_H));
}

/** Allowed range for one axis' offset so India can't be dragged off screen. */
function axisLo(s, mapSize, viewSize) {
  'worklet';
  const content = mapSize * s;
  const slack = MAP_CONFIG.panSlack;
  return content <= viewSize ? (viewSize - content) / 2 - slack : viewSize - content - slack;
}
function axisHi(s, mapSize, viewSize) {
  'worklet';
  const content = mapSize * s;
  const slack = MAP_CONFIG.panSlack;
  return content <= viewSize ? (viewSize - content) / 2 + slack : slack;
}
function clampAxis(t, s, mapSize, viewSize) {
  'worklet';
  return Math.min(Math.max(t, axisLo(s, mapSize, viewSize)), axisHi(s, mapSize, viewSize));
}
function clampScale(s, vw, vh) {
  'worklet';
  const base = baseScaleFor(vw, vh);
  return Math.min(Math.max(s, base * MAP_CONFIG.minZoom), base * MAP_CONFIG.maxZoom);
}
function ok(n) {
  'worklet';
  return typeof n === 'number' && n === n && n !== Infinity && n !== -Infinity;
}

/** Plain-JS: the camera that fits a lng/lat box in a view of vw×vh (used for the opening view). */
function cameraForLngLatBox(box, vw, vh) {
  const nw = project(box.west, box.north);
  const se = project(box.east, box.south);
  const pad = MAP_CONFIG.fitPadding;
  const s = clampScale(Math.min((vw - pad * 2) / (se.x - nw.x), (vh - pad * 2) / (se.y - nw.y)), vw, vh);
  return {
    s,
    x: clampAxis(vw / 2 - ((nw.x + se.x) / 2) * s, s, MAP_W, vw),
    y: clampAxis(vh / 2 - ((nw.y + se.y) / 2) * s, s, MAP_H, vh),
  };
}

export function useMapCamera({ viewW, viewH, onTap, onCameraChange }) {
  // Create the camera with the opening view already applied, so the very first
  // frame is correct (shared values written after mount can be read stale by Skia).
  const [init] = useState(() =>
    viewW && viewH ? cameraForLngLatBox(MAP_CONFIG.initialView, viewW, viewH) : { s: 1, x: 0, y: 0 }
  );
  const scale = useSharedValue(init.s);
  const tx = useSharedValue(init.x);
  const ty = useSharedValue(init.y);
  const vw = useSharedValue(viewW || 1);
  const vh = useSharedValue(viewH || 1);
  const [ready, setReady] = useState(false);

  // gesture bookkeeping (plain numbers only)
  const pinching = useSharedValue(0);
  const lastPanX = useSharedValue(0);
  const lastPanY = useSharedValue(0);
  const panSkip = useSharedValue(1);
  const pS = useSharedValue(1);
  const pTx = useSharedValue(0);
  const pTy = useSharedValue(0);
  const pFx = useSharedValue(0);
  const pFy = useSharedValue(0);

  // Stable JS callbacks (worklets capture these once).
  const tapRef = useRef(onTap);
  const camRef = useRef(onCameraChange);
  tapRef.current = onTap;
  camRef.current = onCameraChange;
  const emitTap = useCallback((x, y, s, ox, oy) => tapRef.current?.(x, y, { scale: s, tx: ox, ty: oy }), []);
  const emitCamera = useCallback((s, ox, oy) => camRef.current?.({ scale: s, tx: ox, ty: oy }), []);

  // Apply the opening view (Himachal) once the view is measured.
  useEffect(() => {
    if (!viewW || !viewH) return;
    const c = cameraForLngLatBox(MAP_CONFIG.initialView, viewW, viewH);
    vw.value = viewW;
    vh.value = viewH;
    scale.value = c.s;
    tx.value = c.x;
    ty.value = c.y;
    emitCamera(c.s, c.x, c.y); // the computed numbers, NOT shared-value reads
    setReady(true);
  }, [viewW, viewH]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Animated camera moves (called from JS; uses the measured size, not shared reads) ----
  const flyTo = useCallback((s, x, y) => {
    const W = viewW, H = viewH;
    if (!W || !H || !ok(s) || !ok(x) || !ok(y)) return;
    const cs = clampScale(s, W, H);
    const cx = clampAxis(x, cs, MAP_W, W);
    const cy = clampAxis(y, cs, MAP_H, H);
    const cfg = { duration: MAP_CONFIG.flyDuration, easing: EASE };
    scale.value = withTiming(cs, cfg);
    tx.value = withTiming(cx, cfg);
    ty.value = withTiming(cy, cfg);
    // lay bubbles out for the destination once the flight lands
    setTimeout(() => emitCamera(cs, cx, cy), MAP_CONFIG.flyDuration);
  }, [viewW, viewH]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Fly back to the whole-India view. */
  const reset = useCallback(() => {
    if (!viewW || !viewH) return;
    const s = baseScaleFor(viewW, viewH);
    flyTo(s, (viewW - MAP_W * s) / 2, (viewH - MAP_H * s) / 2);
  }, [viewW, viewH, flyTo]);

  /**
   * Fly so a map-space bbox [x0,y0,x1,y1] fits the view, with `center` (map
   * space, e.g. the state's visual centre) landing in the middle of the area
   * below the header (`topInset` px).
   */
  const flyToBBox = useCallback((bbox, { center, topInset = 0, maxZoom = MAP_CONFIG.stateZoomMax } = {}) => {
    if (!viewW || !viewH) return;
    const [x0, y0, x1, y1] = bbox;
    const pad = MAP_CONFIG.stateZoomPadding;
    const availH = viewH - topInset;
    const base = baseScaleFor(viewW, viewH);
    const s = Math.min((viewW - pad * 2) / (x1 - x0), (availH - pad * 2) / (y1 - y0), base * maxZoom);
    const [cx, cy] = center || [(x0 + x1) / 2, (y0 + y1) / 2];
    flyTo(s, viewW / 2 - cx * s, topInset + availH / 2 - cy * s);
  }, [viewW, viewH, flyTo]);

  // ---- Gestures (UI thread) --------------------------------------------------
  const gesture = useMemo(() => {
    const notify = () => {
      'worklet';
      scheduleOnRN(emitCamera, scale.value, tx.value, ty.value);
    };

    const pan = Gesture.Pan()
      .minDistance(4)
      .averageTouches(true)
      .onBegin(() => {
        cancelAnimation(scale); cancelAnimation(tx); cancelAnimation(ty);
        panSkip.value = 1;
      })
      .onUpdate((e) => {
        // incremental movement; skip frames where finger count changes or a pinch is running
        if (panSkip.value === 1 || pinching.value === 1) {
          lastPanX.value = e.translationX; lastPanY.value = e.translationY;
          panSkip.value = pinching.value;
          return;
        }
        const dx = e.translationX - lastPanX.value;
        const dy = e.translationY - lastPanY.value;
        lastPanX.value = e.translationX; lastPanY.value = e.translationY;
        if (!ok(dx) || !ok(dy)) return;
        const s = scale.value;
        tx.value = clampAxis(tx.value + dx, s, MAP_W, vw.value);
        ty.value = clampAxis(ty.value + dy, s, MAP_H, vh.value);
      })
      .onEnd((e) => {
        if (pinching.value === 1) return;
        const s = scale.value;
        const d = MAP_CONFIG.decayDeceleration;
        const vx = ok(e.velocityX) ? e.velocityX : 0;
        const vy = ok(e.velocityY) ? e.velocityY : 0;
        tx.value = withDecay({ velocity: vx, deceleration: d, clamp: [axisLo(s, MAP_W, vw.value), axisHi(s, MAP_W, vw.value)] });
        ty.value = withDecay({ velocity: vy, deceleration: d, clamp: [axisLo(s, MAP_H, vh.value), axisHi(s, MAP_H, vh.value)] }, (finished) => {
          if (finished) notify();
        });
      });

    const pinch = Gesture.Pinch()
      .onStart((e) => {
        pinching.value = 1;
        cancelAnimation(scale); cancelAnimation(tx); cancelAnimation(ty);
        pS.value = scale.value; pTx.value = tx.value; pTy.value = ty.value;
        pFx.value = ok(e.focalX) ? e.focalX : vw.value / 2;
        pFy.value = ok(e.focalY) ? e.focalY : vh.value / 2;
      })
      .onUpdate((e) => {
        if (pinching.value !== 1 || !ok(e.scale) || e.scale <= 0 || !ok(e.focalX) || !ok(e.focalY)) return;
        // the map point that was under the fingers stays under the (moving) fingers
        const mx = (pFx.value - pTx.value) / pS.value;
        const my = (pFy.value - pTy.value) / pS.value;
        const s = clampScale(pS.value * e.scale, vw.value, vh.value);
        const nx = e.focalX - mx * s;
        const ny = e.focalY - my * s;
        if (!ok(s) || !ok(nx) || !ok(ny)) return;
        scale.value = s;
        tx.value = clampAxis(nx, s, MAP_W, vw.value);
        ty.value = clampAxis(ny, s, MAP_H, vh.value);
      })
      .onFinalize(() => {
        if (pinching.value === 1) {
          pinching.value = 0;
          panSkip.value = 1;
          notify();
        }
      });

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((e, success) => {
        if (!success) return;
        const W = vw.value, H = vh.value;
        const base = baseScaleFor(W, H);
        const atMax = scale.value >= base * MAP_CONFIG.maxZoom * 0.98;
        const s = atMax ? base : clampScale(scale.value * MAP_CONFIG.doubleTapZoomFactor, W, H);
        const x = atMax ? (W - MAP_W * s) / 2 : e.x - ((e.x - tx.value) / scale.value) * s;
        const y = atMax ? (H - MAP_H * s) / 2 : e.y - ((e.y - ty.value) / scale.value) * s;
        if (!ok(s) || !ok(x) || !ok(y)) return;
        const cfg = { duration: MAP_CONFIG.flyDuration, easing: EASE };
        scale.value = withTiming(s, cfg);
        tx.value = withTiming(clampAxis(x, s, MAP_W, W), cfg);
        ty.value = withTiming(clampAxis(y, s, MAP_H, H), cfg, (finished) => {
          if (finished) notify();
        });
      });

    const singleTap = Gesture.Tap()
      .numberOfTaps(1)
      .requireExternalGestureToFail(doubleTap)
      .onEnd((e, success) => {
        if (success) scheduleOnRN(emitTap, e.x, e.y, scale.value, tx.value, ty.value);
      });

    return Gesture.Simultaneous(pan, pinch, doubleTap, singleTap);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { scale, tx, ty, gesture, reset, flyToBBox, ready };
}
