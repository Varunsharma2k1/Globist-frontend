/**
 * Map bubbles (Snap-Map style).
 *   place : rounded photo thumbnail with an orange border, a count badge on its
 *           bottom edge ("121") and the place name underneath; sits above its pin.
 *   state : dark glass pill "Himachal  [540]", centred on the state.
 *
 * Positioned every frame on the UI thread from the camera shared values, so it
 * follows the map at a constant on-screen size. No enter/exit layout animations
 * (they crashed when many bubbles changed at once). Touches pass through
 * (pointerEvents="none"); taps are hit-tested by the screen.
 */
import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Mountain } from 'lucide-react-native';
import { FONTS } from '../../../theme';
import { MAP_THEME } from '../config/mapTheme';
import { formatCount } from '../utils/bubbles';
import { placeImage } from '../data/placeImages';

const B = MAP_THEME.bubble;

function PlaceThumb({ place }) {
  const src = placeImage(place);
  return (
    <View style={styles.thumb}>
      {src ? (
        <Image source={src} style={styles.thumbImg} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbImg, styles.placeholder]}>
          <Mountain size={22} color="#FFFFFF" strokeWidth={1.6} />
        </View>
      )}
    </View>
  );
}

function CountBubble({ bubble, camera }) {
  const { scale, tx, ty } = camera;
  const { x, y, kind } = bubble;
  const count = formatCount(bubble.count);

  const pos = useAnimatedStyle(() => ({
    transform: [{ translateX: x * scale.value + tx.value }, { translateY: y * scale.value + ty.value }],
  }));

  return (
    <Animated.View style={[styles.anchor, pos]} pointerEvents="none">
      {kind === 'state' ? (
        <View style={styles.statePill}>
          <Text style={styles.stateLabel} numberOfLines={1}>{bubble.label}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeWrap}>
          <PlaceThumb place={bubble.place} />
          <View style={[styles.badge, styles.thumbBadge]}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{bubble.label}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Zero-size view sitting exactly on the anchor point.
  anchor: { position: 'absolute', left: 0, top: 0, width: 0, height: 0, alignItems: 'center' },

  // place: thumbnail + badge + name, bottom sits just above the pin
  placeWrap: { position: 'absolute', bottom: B.gapAbovePin, alignItems: 'center', width: 140 },
  thumb: {
    width: B.thumbW, height: B.thumbH, borderRadius: B.thumbRadius,
    borderWidth: B.thumbBorderWidth, borderColor: B.thumbBorder,
    backgroundColor: '#1B2638', overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#2F6B6E' },
  thumbBadge: { marginTop: -10, borderWidth: 2, borderColor: '#FFFFFF' },
  name: {
    marginTop: 2, fontFamily: FONTS.heading, fontSize: B.nameSize, color: B.nameColor,
    textShadowColor: 'rgba(0,0,0,0.85)', textShadowRadius: 3, textShadowOffset: { width: 0, height: 1 },
  },

  // count badge (used by both bubble kinds)
  badge: {
    minWidth: 22, height: 20, paddingHorizontal: 6, borderRadius: 10,
    backgroundColor: B.badgeBackground, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: FONTS.heading, fontSize: 11, color: B.badgeText },

  // state: dark glass pill centred on the state
  statePill: {
    position: 'absolute', top: -B.height / 2, height: B.height, borderRadius: B.radius,
    paddingLeft: B.paddingH, paddingRight: 4, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: B.stateBackground, borderWidth: 1, borderColor: B.border,
  },
  stateLabel: { fontFamily: FONTS.heading, fontSize: B.fontSize, color: B.stateText },
});

// Re-renders only if this bubble's label/count/position changes.
export default memo(CountBubble, (a, b) =>
  a.bubble.key === b.bubble.key && a.bubble.count === b.bubble.count && a.bubble.label === b.bubble.label &&
  a.bubble.x === b.bubble.x && a.bubble.y === b.bubble.y && a.camera === b.camera);
