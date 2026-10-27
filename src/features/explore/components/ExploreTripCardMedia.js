import React, { useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Clock, Mountain, Waves, Sun, Trees, Snowflake, Compass } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { getCoverImage } from '../../../data/coverImages';

// imageType → pastel token + icon, shown as the placeholder while the cover
// photo loads (and kept if it fails), so the card never looks blank.
const TRIP_VISUAL = {
  mountain: { Icon: Mountain, pastel: 'mountain' },
  valley: { Icon: Mountain, pastel: 'mountain' },
  jungle: { Icon: Trees, pastel: 'mountain' },
  snow: { Icon: Snowflake, pastel: 'beach' },
  beach: { Icon: Waves, pastel: 'beach' },
  desert: { Icon: Sun, pastel: 'desert' },
};
const DEFAULT_VISUAL = { Icon: Compass, pastel: 'luxury' };

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function GlassPill({ children }) {
  return (
    <BlurView intensity={40} tint="dark" style={styles.pill}>
      {children}
    </BlurView>
  );
}

export default function ExploreTripCardMedia({ trip }) {
  const { colors } = useTheme();
  const { Icon, pastel: pastelKey } = TRIP_VISUAL[trip.imageType] || DEFAULT_VISUAL;
  const pastel = colors.pastel[pastelKey];
  const meta = [trip.duration, capitalize(trip.difficulty)].filter(Boolean).join(' · ');
  const imageUri = getCoverImage(trip);

  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const onLoad = () =>
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();

  return (
    <View style={[styles.media, { backgroundColor: pastel.bg }]}>
      <Icon size={88} strokeWidth={1} color={pastel.fg} style={styles.placeholderIcon} />
      {imageUri && !failed ? (
        <Animated.Image
          source={{ uri: imageUri }}
          style={[StyleSheet.absoluteFill, { opacity: fade }]}
          resizeMode="cover"
          onLoad={onLoad}
          onError={() => setFailed(true)}
        />
      ) : null}

      <View style={styles.pills}>
        {meta ? (
          <GlassPill>
            <Clock size={11} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.pillText}>{meta}</Text>
          </GlassPill>
        ) : null}
        {trip.isFeatured ? (
          <GlassPill>
            <Text style={styles.pillText}>Featured</Text>
          </GlassPill>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  media: {
    height: 190,
    overflow: 'hidden',
  },
  placeholderIcon: {
    position: 'absolute',
    right: SPACING.md,
    bottom: -SPACING.md,
    opacity: 0.35,
  },
  pills: {
    position: 'absolute',
    top: SPACING.sm + 4,
    left: SPACING.sm + 4,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    // Fallback tint where native blur isn't available (e.g. older Android).
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  pillText: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});
