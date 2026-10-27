import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ExplorePopularDestinations from './ExplorePopularDestinations';
import ExploreDestinationSummary from './ExploreDestinationSummary';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/**
 * Header above the trip list: the destination summary inside a place,
 * otherwise popular destinations (on the plain landing) and a trip count.
 */
export default function ExploreListHeader({
  destination,
  count,
  sortKey,
  browsing,
  showPopular,
  popularDestinations,
  onSelectDestination,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (destination) {
    return <ExploreDestinationSummary destination={destination} count={count} sortKey={sortKey} />;
  }
  return (
    <>
      {showPopular ? (
        <ExplorePopularDestinations
          destinations={popularDestinations}
          onSelect={onSelectDestination}
        />
      ) : null}
      {count ? (
        <Text style={styles.count}>
          {browsing ? 'ALL PACKAGES · ' : ''}
          {count} {count === 1 ? 'TRIP' : 'TRIPS'}
        </Text>
      ) : null}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    count: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      letterSpacing: 1.4,
      color: colors.textMuted,
      marginBottom: SPACING.sm + 4,
    },
  });
}
