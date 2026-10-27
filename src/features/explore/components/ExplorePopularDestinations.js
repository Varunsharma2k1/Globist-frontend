import React from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { getCoverImage } from '../../../data/coverImages';

/**
 * Horizontal row of photo tiles on the Explore landing — one tap takes the
 * user straight into that destination's packages.
 */
export default function ExplorePopularDestinations({ destinations, onSelect }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  if (!destinations.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>POPULAR DESTINATIONS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {destinations.map((d) => (
          <Pressable
            key={d.key}
            onPress={() => onSelect(d)}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            accessibilityRole="button"
            accessibilityLabel={`${d.name}, ${d.count} trips`}
          >
            <Image
              source={{ uri: getCoverImage(d.region) }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View style={styles.scrim} />
            <Text style={styles.name} numberOfLines={1}>
              {d.name}
            </Text>
            <Text style={styles.count}>
              {d.count} trip{d.count === 1 ? '' : 's'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: {
      marginBottom: SPACING.lg,
    },
    label: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      letterSpacing: 1.4,
      color: colors.textMuted,
      marginBottom: SPACING.sm + 4,
    },
    scroll: {
      marginHorizontal: -SPACING.lg,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      gap: SPACING.sm + 2,
    },
    tile: {
      width: 128,
      height: 160,
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      padding: SPACING.sm + 4,
      backgroundColor: colors.surfaceMuted,
    },
    tilePressed: {
      transform: [{ scale: 0.97 }],
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.28)',
    },
    name: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: '#FFFFFF',
    },
    count: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: 2,
    },
  });
}
