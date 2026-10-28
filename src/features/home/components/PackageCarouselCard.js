import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { getCoverImage } from '../../../data/coverImages';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/** A compact trending package: photo, name, place and duration, price and rating. */
export default function PackageCarouselCard({ trip, onPress, width }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const place = [trip.duration, trip.region?.name].filter(Boolean).join(' · ');

  return (
    <Pressable
      style={[styles.card, { width }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={trip.title}
    >
      <Image source={{ uri: getCoverImage(trip) }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {trip.title}
        </Text>
        {place ? (
          <Text style={styles.place} numberOfLines={1}>
            {place}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.price}>
            {Number.isFinite(trip.price) ? `₹${trip.price.toLocaleString('en-IN')}` : 'View'}
            <Text style={styles.priceUnit}> / person</Text>
          </Text>
          {Number.isFinite(trip.rating) ? (
            <View style={styles.rating}>
              <Star size={12} color={colors.ink} fill={colors.ink} />
              <Text style={styles.ratingText}>{trip.rating}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    image: { width: '100%', height: 170, backgroundColor: colors.surfaceMuted },
    body: { padding: SPACING.md - 2 },
    title: { fontFamily: FONTS.heading, fontSize: 15, lineHeight: 19, color: colors.ink },
    place: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 4 },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: SPACING.sm + 2,
    },
    price: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink },
    priceUnit: { fontFamily: FONTS.body, fontSize: 11, color: colors.textMuted },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      borderRadius: RADIUS.pill,
    },
    ratingText: { fontFamily: FONTS.semibold, fontSize: 12, color: colors.ink },
  });
}
