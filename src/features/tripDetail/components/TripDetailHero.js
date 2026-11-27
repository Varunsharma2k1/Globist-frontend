import React, { useRef, useState } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS } from '../../../theme';
import { getCoverImage } from '../../../data/coverImages';
import { useTopInset } from '../../../hooks/useTopInset';

const HERO_HEIGHT = 300;

// imageType → pastel token, used behind the photo while it loads.
const PASTEL_FOR = { beach: 'beach', snow: 'beach', desert: 'desert' };

/**
 * Full-bleed cover photo at the top of the trip page — the same photo the
 * trip's Explore card shows — with a floating back button.
 */
export default function TripDetailHero({ trip, onBack, saved, onToggleSave }) {
  const { colors } = useTheme();
  const topInset = useTopInset();
  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const pastel = colors.pastel[PASTEL_FOR[trip.imageType] || 'mountain'];
  const uri = getCoverImage(trip);

  return (
    <View style={[styles.hero, { height: HERO_HEIGHT + topInset, backgroundColor: pastel.bg }]}>
      {uri && !failed ? (
        <Animated.Image
          source={{ uri }}
          style={[StyleSheet.absoluteFill, { opacity: fade }]}
          resizeMode="cover"
          onLoad={() =>
            Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start()
          }
          onError={() => setFailed(true)}
        />
      ) : null}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backWrap, { top: topInset + SPACING.sm }]}
      >
        <BlurView intensity={40} tint="dark" style={styles.back}>
          <ArrowLeft size={20} color={colors.white} />
        </BlurView>
      </TouchableOpacity>
      {onToggleSave ? (
        <TouchableOpacity
          onPress={onToggleSave}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved trips' : 'Save trip'}
          accessibilityState={{ selected: Boolean(saved) }}
          style={[styles.saveWrap, { top: topInset + SPACING.sm }]}
        >
          <BlurView intensity={40} tint="dark" style={styles.back}>
            <Heart
              size={20}
              color={saved ? '#FF5A5F' : colors.white}
              fill={saved ? '#FF5A5F' : 'transparent'}
            />
          </BlurView>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    overflow: 'hidden',
  },
  backWrap: {
    position: 'absolute',
    left: SPACING.md,
  },
  saveWrap: {
    position: 'absolute',
    right: SPACING.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // Fallback tint where native blur isn't available.
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
});
