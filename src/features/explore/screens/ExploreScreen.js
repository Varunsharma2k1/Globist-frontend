import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useExploreTrips } from '../hooks/useExploreTrips';
import ExploreSearchHeader from '../components/ExploreSearchHeader';
import ExploreTripCard from '../components/ExploreTripCard';

/**
 * ExploreScreen Component
 *
 * Allows users to search and filter travel experiences by category. Search
 * state, category filter, and trip fetching live in useExploreTrips; the
 * search/category bar and each trip card are their own components (see
 * ../components) — this file is just the layout.
 */
export default function ExploreScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { search, setSearch, selectedCategory, setSelectedCategory, loading, filteredTrips } =
    useExploreTrips();

  return (
    <View style={styles.container}>
      <ExploreSearchHeader
        search={search}
        onChangeSearch={setSearch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          <Text style={[typography.caption, { marginBottom: SPACING.md }]}>
            Showing {filteredTrips.length} Handcrafted Travel Experiences
          </Text>

          {filteredTrips.map((trip) => (
            <ExploreTripCard
              key={trip._id || trip.title}
              trip={trip}
              onPress={() =>
                navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
