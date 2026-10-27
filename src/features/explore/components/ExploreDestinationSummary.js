import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { optionFor } from '../utils/exploreFilters';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * List header inside a destination: "Zanskar · Ladakh",
 * "1 package · from ₹35,000 · Soonest departure first".
 */
export default function ExploreDestinationSummary({ destination, count, sortKey }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const meta = [
    plural(count, 'package'),
    Number.isFinite(destination.minPrice) ? `from ₹${destination.minPrice.toLocaleString()}` : null,
    `${optionFor('sort', sortKey).label} first`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.summary}>
      <Text style={styles.title}>
        {destination.name}
        {destination.parentName ? (
          <Text style={styles.parent}>{`  ${destination.parentName}`}</Text>
        ) : null}
      </Text>
      <Text style={styles.meta}>{meta}</Text>
    </View>
  );
}

/**
 * List footer when a place has only a trip or two: points to the rest of
 * its region ("1 trip in Zanskar · See 4 more in Ladakh →").
 */
export function ExploreSeeMore({ destination, parentRegion, count, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const more = parentRegion.count - count;
  if (more <= 0) return null;

  return (
    <TouchableOpacity style={styles.seeMore} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.seeMoreText}>
        <Text style={styles.seeMoreTitle}>
          {plural(count, 'trip')} in {destination.name}
        </Text>
        <Text style={styles.seeMoreSubtitle}>
          See {more} more in {parentRegion.name}
        </Text>
      </View>
      <ArrowRight size={18} color={colors.ink} />
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    summary: {
      marginBottom: SPACING.md,
    },
    title: {
      fontFamily: FONTS.heading,
      fontSize: 22,
      letterSpacing: -0.3,
      color: colors.ink,
    },
    parent: {
      fontFamily: FONTS.body,
      fontSize: 15,
      letterSpacing: 0,
      color: colors.textMuted,
    },
    meta: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 4,
    },
    seeMore: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      backgroundColor: colors.surfaceMuted,
      marginBottom: SPACING.md,
    },
    seeMoreText: {
      flex: 1,
    },
    seeMoreTitle: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    seeMoreSubtitle: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: colors.ink,
      marginTop: 2,
    },
  });
}
