/**
 * Small dark bottom card for a tapped place: placeholder image, name, state, tapes.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mountain, X } from 'lucide-react-native';
import { FONTS, RADIUS, SPACING } from '../../../theme';
import { STATE_BY_ID } from '../geo/mapGeometry';
import { formatCount } from '../utils/bubbles';
import { MAP_THEME } from '../config/mapTheme';
import { placeImage } from '../data/placeImages';

export const PLACE_SHEET_HEIGHT = 210;

export default function PlaceSheet({ place, onClose }) {
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(PLACE_SHEET_HEIGHT + 60)).current;
  const last = useRef(place);
  if (place) last.current = place; // keep content while sliding out
  const p = last.current;

  useEffect(() => {
    Animated.spring(y, { toValue: place ? 0 : PLACE_SHEET_HEIGHT + 60, useNativeDriver: true, damping: 18, stiffness: 180 }).start();
  }, [place, y]);

  return (
    <Animated.View
      pointerEvents={place ? 'auto' : 'none'}
      style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.md, transform: [{ translateY: y }] }]}
    >
      {p ? (
        <View style={styles.row}>
          <View style={styles.image}>
            {placeImage(p) ? (
              <Image source={placeImage(p)} style={styles.photo} resizeMode="cover" />
            ) : (
              <Mountain size={34} color={MAP_THEME.stateStrokeActive} strokeWidth={1.5} />
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
            <Text style={styles.state}>{STATE_BY_ID[p.state]?.name || p.state}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{formatCount(p.count)} tapes</Text>
            </View>
          </View>
          <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
            <X size={18} color={MAP_THEME.sheetText} />
          </Pressable>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute', left: SPACING.md, right: SPACING.md, bottom: 0,
    backgroundColor: MAP_THEME.sheetBackground, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg,
    borderWidth: 1, borderBottomWidth: 0, borderColor: MAP_THEME.bubble.border,
    padding: SPACING.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: {
    width: 96, height: 96, borderRadius: RADIUS.sm, backgroundColor: '#25304A',
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md, overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  info: { flex: 1 },
  name: { fontFamily: FONTS.heading, fontSize: 18, color: MAP_THEME.sheetText },
  state: { fontFamily: FONTS.body, fontSize: 14, color: MAP_THEME.sheetMuted, marginTop: 2 },
  countPill: { alignSelf: 'flex-start', marginTop: SPACING.sm, backgroundColor: MAP_THEME.bubble.badgeBackground, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontFamily: FONTS.heading, fontSize: 12, color: MAP_THEME.bubble.badgeText },
  close: { position: 'absolute', top: 0, right: 0, padding: 4 },
});
