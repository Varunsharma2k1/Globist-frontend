/**
 * Faint sea names ("Arabian Sea", "Bay of Bengal", "Indian Ocean"). They follow
 * the map on the UI thread and fade out as you zoom in, so they never clutter
 * the state view. Cheap: three plain text views, no map data.
 */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { project } from '../geo/mapGeometry';
import { MAP_THEME } from '../config/mapTheme';
import { FONTS } from '../../../theme';

const SEAS = [
  { name: 'Arabian Sea', lng: 70.6, lat: 14.5 },
  { name: 'Bay of Bengal', lng: 87.6, lat: 14.5 },
  { name: 'Indian Ocean', lng: 82.5, lat: 7.4 },
].map((s) => ({ ...s, ...project(s.lng, s.lat) }));

function SeaLabel({ sea, camera }) {
  const { scale, tx, ty } = camera;
  const style = useAnimatedStyle(() => ({
    // fully visible when zoomed out, gone by ~1.6 px per map unit
    opacity: Math.max(0, Math.min(1, (1.6 - scale.value) / 0.7)),
    transform: [{ translateX: sea.x * scale.value + tx.value }, { translateY: sea.y * scale.value + ty.value }],
  }));
  return (
    <Animated.View style={[styles.anchor, style]} pointerEvents="none">
      <Text style={styles.text}>{sea.name}</Text>
    </Animated.View>
  );
}

export default function OceanLabels({ camera }) {
  return SEAS.map((s) => <SeaLabel key={s.name} sea={s} camera={camera} />);
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', left: 0, top: 0, width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  text: {
    position: 'absolute', width: 160, textAlign: 'center',
    fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
    color: MAP_THEME.oceanLabel,
  },
});
