import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { FONTS } from '../theme';

// 124 → "124", 1240 → "1.2k", 12400 → "12k"
const compactCount = (n) => {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
};

/**
 * "★ 4.8 (670)" — rating plus review count. Shows "New" when there are no
 * reviews yet instead of a misleading "★ 0.0".
 */
export default function RatingSummary({ rating, reviewCount, size = 13 }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const reviews = Number.isFinite(reviewCount) ? reviewCount : null;

  if (reviews === 0) return <Text style={styles.newBadge}>New</Text>;
  if (!Number.isFinite(rating) || rating <= 0) return null;

  const value = rating.toFixed(1);
  const reviewsLabel = reviews ? ` from ${reviews} review${reviews === 1 ? '' : 's'}` : '';

  return (
    <View style={styles.rating} accessible accessibilityLabel={`Rated ${value}${reviewsLabel}`}>
      <Star size={size - 1} color={colors.ink} fill={colors.ink} />
      <Text style={[styles.ratingText, { fontSize: size }]}>
        {value}
        {reviews ? <Text style={styles.reviewCount}>{` (${compactCount(reviews)})`}</Text> : null}
      </Text>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingTop: 3,
    },
    ratingText: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.ink,
    },
    reviewCount: {
      fontFamily: FONTS.body,
      color: colors.textMuted,
    },
    newBadge: {
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: colors.textMuted,
      paddingTop: 3,
    },
  });
}
