/**
 * Home block (below the carousel): a static preview of the India map with
 * pins. Tapping opens the full interactive IndiaMap screen.
 */
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../../theme';
import { MAP_THEME } from '../config/mapTheme';
import { MAP_W, MAP_H } from '../geo/mapGeometry';
import { usePlaces } from '../hooks/usePlaces';
import { formatCount } from '../utils/bubbles';
import IndiaMapCanvas from './IndiaMapCanvas';

const CARD_HEIGHT = 230;
const NO_PINS = [];

export default function IndiaMapTeaserCard({ navigation }) {
  const { shadow } = useTheme();
  const { places } = usePlaces();
  // Card width is known up front (screen width minus the card's side padding), so the
  // camera values are created with the RIGHT numbers. Setting them after mount left
  // Skia drawing a stale camera (an empty patch of ocean) until something moved.
  const { width: winW } = useWindowDimensions();
  const w = winW - SPACING.lg * 2;
  const s0 = (CARD_HEIGHT - 16) / MAP_H;
  const scale = useSharedValue(s0);
  const tx = useSharedValue(w - MAP_W * s0 - 8);
  const ty = useSharedValue(8);
  const camera = useMemo(() => ({ scale, tx, ty }), [scale, tx, ty]);

  const statesWithPlaces = useMemo(() => new Set(places.map((p) => p.state)), [places]);
  const total = places.reduce((n, p) => n + p.count, 0);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => navigation.navigate('IndiaMap')}
        style={[styles.card, shadow]}
      >
        <IndiaMapCanvas camera={camera} statesWithPlaces={statesWithPlaces} places={NO_PINS} pinKey="" borderScale={s0} />
        <View style={styles.text} pointerEvents="none">
          <Text style={styles.kicker}>LIVE MAP</Text>
          <Text style={styles.title}>What's happening across India</Text>
          <Text style={styles.stat}>
            {places.length} spots · {formatCount(total)} tapes
          </Text>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Explore map  ›</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  card: { height: CARD_HEIGHT, borderRadius: RADIUS.md, overflow: 'hidden' },
  text: { position: 'absolute', left: SPACING.md, top: SPACING.md, bottom: SPACING.md, width: '48%', justifyContent: 'center' },
  kicker: { fontFamily: FONTS.semibold, fontSize: 11, letterSpacing: 1.2, color: '#EE8A65' },
  title: { fontFamily: FONTS.heading, fontSize: 20, color: MAP_THEME.sheetText, marginTop: 4 },
  stat: { fontFamily: FONTS.body, fontSize: 13, color: MAP_THEME.sheetMuted, marginTop: 6 },
  cta: { alignSelf: 'flex-start', marginTop: SPACING.md, backgroundColor: MAP_THEME.bubble.badgeBackground, borderRadius: RADIUS.pill, paddingHorizontal: 14, paddingVertical: 8 },
  ctaText: { fontFamily: FONTS.heading, fontSize: 13, color: MAP_THEME.bubble.badgeText },
});
