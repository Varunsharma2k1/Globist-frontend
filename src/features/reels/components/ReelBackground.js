import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mountain, Waves, Sun } from 'lucide-react-native';
import { SPACING, FONTS } from '../../../theme';

const CATEGORY_ICON = { desert: Sun, beach: Waves, mountain: Mountain };

function categoryKey(imageType) {
  if (imageType === 'desert') return 'desert';
  if (imageType === 'beach') return 'beach';
  return 'mountain';
}

function StripePattern() {
  const stripes = new Array(8).fill(0);
  return (
    <View style={styles.stripeWrap} pointerEvents="none">
      {stripes.map((_, i) => (
        <View key={i} style={[styles.stripe, { left: -200 + i * 90 }]} />
      ))}
    </View>
  );
}

/**
 * Background Visual Card — also serves as the poster shown behind the video
 * while it buffers (or in place of it entirely for reels with no media yet).
 */
export default function ReelBackground({ imageType, location }) {
  const category = categoryKey(imageType);
  const CategoryIcon = CATEGORY_ICON[category];
  const region = location || 'Himalayan Pass';

  return (
    <View style={styles.visualContainer}>
      <StripePattern />
      <CategoryIcon size={72} color="rgba(255,255,255,0.35)" strokeWidth={1.25} />
      <Text style={styles.mediaTitle}>VIDEO REEL — {region.toUpperCase()}</Text>
    </View>
  );
}

export { categoryKey };

const styles = StyleSheet.create({
  visualContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripeWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    top: -100,
    width: 26,
    height: '140%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '20deg' }],
  },
  mediaTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.6)',
    marginTop: SPACING.md,
  },
});
