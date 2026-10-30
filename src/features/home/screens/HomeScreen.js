import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useHomeData } from '../hooks/useHomeData';
import HomeHeader from '../components/HomeHeader';
import HomeCarousel from '../components/HomeCarousel';
import FeaturedRegionsSection from '../components/FeaturedRegionsSection';
import TrendingPackagesSection from '../components/TrendingPackagesSection';
import CommunitiesSection from '../components/CommunitiesSection';

/**
 * HomeScreen Component
 *
 * Renders the auto-rotating carousel, featured travel regions, and trending travel
 * packages. Data fetching lives in useHomeData; each visual section is its
 * own component (see ../components) — this file is just the layout.
 */
export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { regions, trendingTrips, loading } = useHomeData();

  return (
    <View style={styles.container}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Breathing room between the app header and the carousel. */}
        <View style={styles.carouselWrap}>
          <HomeCarousel
            onSlidePress={(slide) =>
              navigation.navigate(
                slide.target,
                slide.destination ? { destination: slide.destination } : undefined
              )
            }
          />
        </View>

        <View style={styles.content}>
          <FeaturedRegionsSection regions={regions} loading={loading} navigation={navigation} />

          <TrendingPackagesSection trips={trendingTrips} navigation={navigation} />

          <CommunitiesSection navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    carouselWrap: {
      paddingTop: SPACING.md,
    },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
