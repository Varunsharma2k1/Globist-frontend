import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Pressable, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { MapPin, Film } from 'lucide-react-native';
import { SPACING, FONTS } from '../../../theme';

const ZOOM_TO = 1.08; // how far the photo zooms in
const ZOOM_MS = 5000; // a touch longer than the auto-advance, so it never settles

/**
 * One framed card in the Home carousel. Scales up, lifts and brightens as it
 * nears the centre of the list (driven by the list's scroll position).
 */
export default function CarouselCard({
  item,
  index,
  scrollX,
  cardWidth,
  cardHeight,
  itemWidth,
  gap,
  onPress,
  isActive,
}) {
  // Subtle Ken Burns: the centred card's photo slowly zooms in, then eases back.
  const zoom = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animation = Animated.timing(zoom, {
      toValue: isActive ? ZOOM_TO : 1,
      duration: isActive ? ZOOM_MS : 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [isActive, zoom]);

  const center = index * itemWidth;
  const range = [center - itemWidth, center, center + itemWidth];
  const scale = scrollX.interpolate({
    inputRange: range,
    outputRange: [0.86, 1, 0.86],
    extrapolate: 'clamp',
  });
  const lift = scrollX.interpolate({
    inputRange: range,
    outputRange: [18, 0, 18],
    extrapolate: 'clamp',
  });
  const dim = scrollX.interpolate({
    inputRange: range,
    outputRange: [0.72, 1, 0.72],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        width: cardWidth,
        height: cardHeight,
        marginRight: gap,
        opacity: dim,
        transform: [{ translateY: lift }, { scale }],
      }}
    >
      <Pressable
        style={styles.frame}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}`}
      >
        <View style={styles.photo}>
          <Animated.Image
            source={item.image}
            style={[styles.image, { transform: [{ scale: zoom }] }]}
            resizeMode="cover"
          />
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="cardScrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                <Stop offset="0.5" stopColor="#000000" stopOpacity="0.05" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.75" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#cardScrim)" />
          </Svg>
          <View style={styles.caption}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.location ? (
              <View style={styles.meta}>
                <MapPin size={15} color="#FFFFFF" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            ) : (
              <View style={styles.meta}>
                <Film size={15} color="#FFFFFF" />
                <Text style={styles.metaText}>{item.cta}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#1B2A18',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  photo: { flex: 1, borderRadius: 18, overflow: 'hidden', backgroundColor: '#1B2A18' },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  caption: {
    position: 'absolute',
    left: SPACING.md + 2,
    right: SPACING.md,
    bottom: SPACING.md + 2,
  },
  title: { fontFamily: FONTS.heading, fontSize: 24, lineHeight: 28, color: '#FFFFFF' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontFamily: FONTS.semibold, fontSize: 14, color: '#FFFFFF' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
});
