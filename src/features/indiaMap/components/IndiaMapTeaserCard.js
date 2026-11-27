/**
 * Home block (below the carousel): a static preview of the India map with
 * pins. Tapping opens the full interactive IndiaMap screen.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../../theme';
import { MAP_THEME } from '../config/mapTheme';
import { MAP_W, MAP_H } from '../geo/mapGeometry';
import { usePlaces } from '../hooks/usePlaces';
import { formatCount } from '../utils/bubbles';
import IndiaMapCanvas from './IndiaMapCanvas';
import { getTapeStats } from '../../../api/reels';

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
  // Map takes at most the right half of the card; the text gets exactly the
  // space to its left, so the two never overlap on any screen width.
  const s0 = Math.min((CARD_HEIGHT - 16) / MAP_H, (w * 0.5) / MAP_W);
  const mapLeft = w - MAP_W * s0 - 8;
  const textWidth = Math.max(120, mapLeft - SPACING.md - SPACING.sm);
  const scale = useSharedValue(s0);
  const tx = useSharedValue(mapLeft);
  const ty = useSharedValue(8);
  const camera = useMemo(() => ({ scale, tx, ty }), [scale, tx, ty]);

  const statesWithPlaces = useMemo(() => new Set(places.map((p) => p.state)), [places]);
  // Real numbers from MongoDB (playable tapes + distinct tagged locations).
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let alive = true;
    getTapeStats()
      .then((data) => alive && setStats(data))
      .catch(() => {}); // offline: the line just stays hidden
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => navigation.navigate('IndiaMap')}
        style={[styles.card, shadow]}
      >
        <IndiaMapCanvas camera={camera} statesWithPlaces={statesWithPlaces} places={NO_PINS} pinKey="" borderScale={s0} />
        <View style={[styles.text, { width: textWidth }]} pointerEvents="none">
          <Text style={styles.kicker}>LIVE MAP</Text>
          <Text style={styles.title}>What's happening across India</Text>
          {stats ? (
            <Text style={styles.stat}>
              {formatCount(stats.spots)} {stats.spots === 1 ? 'spot' : 'spots'} ·{' '}
              {formatCount(stats.tapes)} {stats.tapes === 1 ? 'tape' : 'tapes'}
            </Text>
          ) : null}
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
  text: { position: 'absolute', left: SPACING.md, top: SPACING.md, bottom: SPACING.md, justifyContent: 'center' },
  kicker: { fontFamily: FONTS.semibold, fontSize: 12, letterSpacing: 1.2, color: '#EE8A65' },
  title: { fontFamily: FONTS.heading, fontSize: 18, color: MAP_THEME.sheetText, marginTop: 4 },
  stat: { fontFamily: FONTS.body, fontSize: 14, color: MAP_THEME.sheetMuted, marginTop: 6 },
  cta: { alignSelf: 'flex-start', marginTop: SPACING.md, backgroundColor: MAP_THEME.bubble.badgeBackground, borderRadius: RADIUS.pill, paddingHorizontal: 14, paddingVertical: 8 },
  ctaText: { fontFamily: FONTS.heading, fontSize: 14, color: MAP_THEME.bubble.badgeText },
});
