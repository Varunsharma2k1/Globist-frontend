/**
 * IndiaMapScreen — "what's happening across India" (dark mode).
 *
 * Offline vector map (no map APIs) + pan/pinch/double-tap.
 *   - Nothing is pinned until you tap: you see one tape-count bubble per state.
 *   - Tap a state → smooth zoom into it; ONLY that state's trending places
 *     (top tape counts) are shown, every other state's bubbles/pins disappear.
 *   - Tap a place bubble → opens the Tapes feed for that place.
 *   - Tap the sea (or ⤢) → back out.
 *
 * Data flow:
 *   usePlaces()      → places (mock now, API later; `count` = number of tapes)
 *   useMapCamera()   → camera shared values + gestures (UI thread)
 *   onCameraChange   → (throttled) recompute which bubbles are visible
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Maximize2 } from 'lucide-react-native';
import { FONTS, RADIUS, SPACING } from '../../../theme';
import { MAP_THEME, MAP_CONFIG } from '../config/mapTheme';
import { hitTestState, STATE_BY_ID } from '../geo/mapGeometry';
import { usePlaces } from '../hooks/usePlaces';
import { useMapCamera } from '../hooks/useMapCamera';
import { placeBubbles, stateBubbles, layoutBubbles, hitTestBubble } from '../utils/bubbles';
import IndiaMapCanvas from '../components/IndiaMapCanvas';
import CountBubble from '../components/CountBubble';
import OceanLabels from '../components/OceanLabels';
import PlaceSheet from '../components/PlaceSheet';
import { useTopInset } from '../../../hooks/useTopInset';

export default function IndiaMapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const topInset = useTopInset();
  const insetsRef = useRef(insets);
  insetsRef.current = insets;
  const { places } = usePlaces();
  // The map fills the whole screen, so its size is the window size, known on the
  // first render. The camera is then created at the right spot from frame one.
  const { width: winW, height: winH } = useWindowDimensions();
  const size = useMemo(() => ({ w: winW, h: winH }), [winW, winH]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [visible, setVisible] = useState([]);
  // Border width is baked into the map picture; re-record only when zoom changed by >12%.
  const [borderScale, setBorderScale] = useState(1);
  const lastCam = useRef(null);

  // Bubble models in map space. Recomputed only when the data changes.
  const allPlaceModels = useMemo(() => placeBubbles(places), [places]);
  const stateModels = useMemo(() => stateBubbles(places), [places]);
  const statesWithPlaces = useMemo(() => new Set(places.map((p) => p.state)), [places]);

  // Only the tapped state's places get pins + bubbles (top N by tape count).
  const statePlaces = useMemo(
    () =>
      selectedState
        ? places
            .filter((p) => p.state === selectedState)
            .sort((a, b) => b.count - a.count)
            .slice(0, MAP_CONFIG.trendingLimit)
        : [],
    [places, selectedState]
  );
  const pinKey = useMemo(
    () => statePlaces.map((p) => `${p.id}@${p.lat},${p.lng}`).join('|'),
    [statePlaces]
  );

  // Refs so the (stable) camera callbacks always see the latest values.
  const live = useRef({});
  live.current = { selectedState, allPlaceModels, stateModels, visible };

  // Pick visible, non-overlapping bubbles for a camera position.
  const relayout = useCallback(
    (cam) => {
      lastCam.current = cam;
      setBorderScale((b) => (Math.abs(cam.scale - b) / b > 0.12 ? cam.scale : b));
      if (!size.w) return;
      const { selectedState: sel, allPlaceModels: pm, stateModels: sm } = live.current;
      const candidates = sel
        ? pm
            .filter((b) => b.place.state === sel)
            .sort((a, b) => b.count - a.count)
            .slice(0, MAP_CONFIG.trendingLimit)
        : sm;
      setVisible(layoutBubbles(candidates, cam, size.w, size.h));
    },
    [size.w, size.h]
  );

  // Tapping a place bubble opens the Tapes feed (bottom tab). The place is passed
  // along as a param so the feed can filter to it once it supports that.
  const navRef = useRef(navigation);
  navRef.current = navigation;
  const openTapes = (place) => {
    navRef.current.navigate('MainTabs', {
      screen: 'ReelsTab',
      params: { placeId: place.id, placeName: place.name, state: place.state },
    });
  };

  // Always use the LATEST camera/insets. (The tap handler is created once; it
  // used to hold the first render's camera, whose flyToBBox saw a 0×0 screen and
  // silently did nothing — so tapping a state never moved the map.)
  const cameraRef = useRef(null);
  const zoomToState = (id) => {
    setSelectedState(id);
    setSelectedPlace(null);
    const camera = cameraRef.current;
    const insets = insetsRef.current;
    const st = STATE_BY_ID[id];
    if (!camera) return;
    // Centre the whole state (its outline box) in the area below the header, fitted with padding.
    if (st) camera.flyToBBox(st.bbox, { topInset: topInset + 60 });
  };

  const onTap = useCallback((x, y, cam) => {
    // 1. Bubbles first (they're drawn on top).
    const b = hitTestBubble(live.current.visible, cam, x, y);
    if (b?.kind === 'place') {
      openTapes(b.place);
      return;
    }
    if (b?.kind === 'state') {
      zoomToState(b.id);
      return;
    }
    // 2. Then the state under the finger.
    const s = hitTestState((x - cam.tx) / cam.scale, (y - cam.ty) / cam.scale);
    setSelectedPlace(null);
    if (s) zoomToState(s.id);
    else setSelectedState(null); // tapped the sea: clear the selection
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const camera = useMapCamera({ viewW: size.w, viewH: size.h, onTap, onCameraChange: relayout });
  cameraRef.current = camera;
  // Stable object: the canvas and bubbles are memoised on it, so they don't
  // re-render every time bubble visibility changes (that was causing pan jank).
  const sharedCam = useMemo(
    () => ({ scale: camera.scale, tx: camera.tx, ty: camera.ty }),
    [camera.scale, camera.tx, camera.ty]
  );

  const reset = () => {
    setSelectedState(null);
    setSelectedPlace(null);
    camera.reset();
  };

  // Re-run layout when the data or the selected state changes.
  useEffect(() => {
    if (lastCam.current) relayout(lastCam.current);
  }, [allPlaceModels, stateModels, selectedState, relayout]);

  return (
    <View style={styles.root}>
      {/* With iOS "Reduce Motion" on, Reanimated skips fling momentum and camera flights.
          The map's pan/zoom IS the interaction, so always run it at full motion here. */}
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <GestureDetector gesture={camera.gesture}>
        <View style={StyleSheet.absoluteFill}>
          {size.w && camera.ready ? (
            <IndiaMapCanvas
              camera={sharedCam}
              selectedStateId={selectedState}
              statesWithPlaces={statesWithPlaces}
              places={statePlaces}
              pinKey={pinKey}
              borderScale={borderScale}
            />
          ) : null}
          {camera.ready ? <OceanLabels camera={sharedCam} /> : null}
          {camera.ready &&
            visible.map((b) => <CountBubble key={b.key} bubble={b} camera={sharedCam} />)}
        </View>
      </GestureDetector>

      {/* Header */}
      <View style={[styles.header, { top: topInset + SPACING.sm }]} pointerEvents="box-none">
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={20} color={MAP_THEME.buttonText} />
        </Pressable>
        <View style={styles.titlePill}>
          <Text style={styles.title}>
            {selectedState ? STATE_BY_ID[selectedState]?.name : 'Across India'}
          </Text>
          <Text style={styles.subtitle}>
            {selectedState ? 'Trending places · tapes' : 'Tap a state to see trending places'}
          </Text>
        </View>
        <Pressable
          style={styles.iconBtn}
          onPress={reset}
          hitSlop={8}
          accessibilityLabel="Reset map"
        >
          <Maximize2 size={18} color={MAP_THEME.buttonText} />
        </Pressable>
      </View>

      <PlaceSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: MAP_THEME.background },
  header: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: MAP_THEME.buttonBackground,
    borderWidth: 1,
    borderColor: MAP_THEME.bubble.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    backgroundColor: MAP_THEME.buttonBackground,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: MAP_THEME.bubble.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    alignItems: 'center',
  },
  title: { fontFamily: FONTS.heading, fontSize: 14, color: MAP_THEME.buttonText },
  subtitle: { fontFamily: FONTS.body, fontSize: 12, color: MAP_THEME.sheetMuted },
});
