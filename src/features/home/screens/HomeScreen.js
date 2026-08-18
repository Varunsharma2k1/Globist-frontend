import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useHomeData } from '../hooks/useHomeData';
import HomeHeader from '../components/HomeHeader';
import TrendingReelsBanner from '../components/TrendingReelsBanner';
import FeaturedRegionsSection from '../components/FeaturedRegionsSection';
import TrendingPackagesSection from '../components/TrendingPackagesSection';

/**
 * HomeScreen Component
 *
 * Renders the top banner, featured travel regions, and trending travel
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrendingReelsBanner onPress={() => navigation.navigate('ReelsTab')} />

        <FeaturedRegionsSection regions={regions} loading={loading} navigation={navigation} />

        <TrendingPackagesSection trips={trendingTrips} navigation={navigation} />
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
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
