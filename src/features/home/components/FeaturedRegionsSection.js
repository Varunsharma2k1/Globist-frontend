import React from 'react';
import { Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';
import RegionCard from './RegionCard';
import SectionHeader from './SectionHeader';

export default function FeaturedRegionsSection({ regions, loading, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <>
      <SectionHeader title="Featured Regions">
        <TouchableOpacity onPress={() => navigation.navigate('ExploreTab')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </SectionHeader>

      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ marginVertical: SPACING.lg }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {regions.map((region) => (
            <RegionCard
              key={region._id || region.name}
              region={region}
              onPress={() =>
                navigation.navigate('RegionDetail', {
                  regionId: region._id,
                  title: region.name,
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    seeAll: {
      fontFamily: FONTS.heading,
      fontSize: 13,
      color: colors.ink,
    },
    horizontalScroll: {
      marginBottom: SPACING.lg,
      marginHorizontal: -SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
  });
}
