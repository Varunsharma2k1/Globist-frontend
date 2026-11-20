/**
 * The India map, drawn with Skia (2D vector, GPU-accelerated, no WebGL/tiles).
 *
 * Light-weight by design:
 *  - State paths are parsed once (mapGeometry) and recorded into ONE Skia
 *    picture, replayed each frame (re-recorded only when a zoom ends).
 *  - No blurs or shadows anywhere: the ocean glow is a radial gradient, the
 *    selected state's halo is a wide translucent stroke.
 *  - Camera transform, border width and pin radius are Reanimated derived
 *    values, so pan/zoom never re-renders React; Skia redraws on the UI thread.
 *  - Pins are only drawn for the places passed in (the selected state's places).
 */
import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Group, Path, Circle, Fill, Rect, RadialGradient, vec, Picture, Skia, PaintStyle, StrokeJoin } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { getStatePaths, project, MAP_W, MAP_H } from '../geo/mapGeometry';
import { MAP_THEME, STATE_TERRAIN } from '../config/mapTheme';

const Pins = memo(function Pins({ points, radius, stroke }) {
  return points.map((p) => (
    <Group key={p.id}>
      <Circle cx={p.x} cy={p.y} r={radius} color={MAP_THEME.pinFill} />
      <Circle cx={p.x} cy={p.y} r={radius} color={MAP_THEME.pinStroke} style="stroke" strokeWidth={stroke} />
    </Group>
  ));
});

/**
 * All state fills + borders recorded ONCE into a Skia picture. Each frame then
 * just replays it under the camera transform (very cheap) instead of drawing
 * 72 separate paths. Re-recorded only when the data changes or a zoom ends
 * (`borderScale`), so borders stay a crisp, constant width.
 */
function recordStates(states, statesWithPlaces, borderScale) {
  const rec = Skia.PictureRecorder();
  const c = rec.beginRecording(Skia.XYWHRect(-50, -50, MAP_W + 100, MAP_H + 100));
  const fill = Skia.Paint();
  fill.setAntiAlias(true);
  states.forEach((st) => {
    fill.setColor(Skia.Color(STATE_TERRAIN[st.id] || MAP_THEME.stateFillDefault));
    c.drawPath(st.path, fill);
  });
  const stroke = Skia.Paint();
  stroke.setAntiAlias(true);
  stroke.setStyle(PaintStyle.Stroke);
  stroke.setStrokeJoin(StrokeJoin.Round);
  stroke.setColor(Skia.Color(MAP_THEME.stateStroke));
  stroke.setStrokeWidth(MAP_THEME.borderWidth / borderScale);
  states.forEach((st) => c.drawPath(st.path, stroke));
  return rec.finishRecordingAsPicture();
}

function IndiaMapCanvas({ camera, selectedStateId, statesWithPlaces, pinKey, places, showPins = true, borderScale = 1, style }) {
  const { scale, tx, ty } = camera;
  const states = getStatePaths();
  const statesPicture = useMemo(
    () => recordStates(states, statesWithPlaces, borderScale),
    [states, statesWithPlaces, borderScale]
  );

  // Camera: screen = map * scale + t
  const transform = useDerivedValue(() => [
    { translateX: tx.value }, { translateY: ty.value }, { scale: scale.value },
  ]);
  // Keep borders/pins a constant on-screen size while zooming.
  const activeBorder = useDerivedValue(() => MAP_THEME.activeBorderWidth / scale.value);
  const glowWidth = useDerivedValue(() => 9 / scale.value);
  const pinR = useDerivedValue(() => MAP_THEME.pinRadius / scale.value);
  const pinStroke = useDerivedValue(() => 1.5 / scale.value);

  // Highlight fades in each time a state is selected (dim others + glow), on the UI thread.
  const hl = useSharedValue(0);
  useEffect(() => {
    hl.value = 0;
    if (selectedStateId) {
      hl.value = withTiming(1, { duration: MAP_THEME.highlightDuration, easing: Easing.out(Easing.cubic) });
    }
  }, [selectedStateId, hl]);
  const raiseAnim = useDerivedValue(() => [{ translateY: (-MAP_THEME.activeRaise * hl.value) / scale.value }]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pinPoints = useMemo(() => places.map((p) => ({ id: p.id, ...project(p.lng, p.lat) })), [pinKey]);
  const selected = selectedStateId ? states.find((s) => s.id === selectedStateId) : null;

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={MAP_THEME.background} />
      <Group transform={transform}>
        {/* Ocean: a soft lighter glow behind the country (map space, so it moves with the map) */}
        <Circle cx={MAP_W / 2} cy={MAP_H * 0.52} r={MAP_W * 1.1}>
          <RadialGradient
            c={vec(MAP_W / 2, MAP_H * 0.52)}
            r={MAP_W * 1.1}
            colors={[MAP_THEME.oceanGlow, MAP_THEME.background]}
          />
        </Circle>

        {/* All states + borders: one pre-recorded picture */}
        <Picture picture={statesPicture} />

        {/* Selected state: everything else dims, the state lifts, brightens and glows orange */}
        {selected ? (
          <Group opacity={hl}>
            <Rect x={-MAP_W * 4} y={-MAP_H * 4} width={MAP_W * 9} height={MAP_H * 9} color={MAP_THEME.dimOthers} />
            <Group transform={raiseAnim}>
              <Path path={selected.path} color={MAP_THEME.activeGlow} style="stroke" strokeWidth={glowWidth} strokeJoin="round" />
              <Path path={selected.path} color={STATE_TERRAIN[selected.id] || MAP_THEME.stateFillDefault} />
              <Path path={selected.path} color={MAP_THEME.stateLighten} />
              <Path path={selected.path} color={MAP_THEME.stateStrokeActive} style="stroke" strokeWidth={activeBorder} strokeJoin="round" />
            </Group>
          </Group>
        ) : null}

        {showPins ? <Pins points={pinPoints} radius={pinR} stroke={pinStroke} /> : null}
      </Group>
    </Canvas>
  );
}

export default memo(IndiaMapCanvas);
