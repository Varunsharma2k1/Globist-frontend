import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, RefreshControl, Keyboard, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useExploreTrips } from '../hooks/useExploreTrips';
import ExploreSearchHeader from '../components/ExploreSearchHeader';
import ExploreFilterBar from '../components/ExploreFilterBar';
import ExploreFilterSheet from '../components/ExploreFilterSheet';
import ExploreSuggestions from '../components/ExploreSuggestions';
import ExploreListHeader from '../components/ExploreListHeader';
import { ExploreSeeMore } from '../components/ExploreDestinationSummary';
import ExploreTripCard from '../components/ExploreTripCard';
import ExploreTripCardSkeleton from '../components/ExploreTripCardSkeleton';
import ExploreEmptyState from '../components/ExploreEmptyState';
import { getEmptyState } from '../utils/exploreEmptyState';

const SKELETON_COUNT = 3;
// A place with this many trips or fewer also offers the rest of its region.
const SEE_MORE_MAX = 2;

/**
 * ExploreScreen Component
 *
 * Destination-first trip discovery: search suggests places / agencies /
 * packages, picking a place scopes the list to it, and browsing offers
 * popular destinations plus category chips. State lives in useExploreTrips;
 * this file is the layout and the search-focus choreography. Other screens
 * can open it scoped via navigate('ExploreTab', { destination: 'Ladakh' }).
 */
export default function ExploreScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const explore = useExploreTrips();
  const { search, setSearch, destination, parentRegion, filteredTrips, loading } = explore;
  const { selectDestination, selectDestinationByName } = explore;
  const [focused, setFocused] = useState(false);
  const [sheet, setSheet] = useState(null);
  const blurTimer = useRef(null);

  const requestedDestination = route?.params?.destination;
  useEffect(() => {
    if (!requestedDestination || loading) return;
    selectDestinationByName(requestedDestination);
    navigation.setParams({ destination: undefined });
  }, [requestedDestination, loading, selectDestinationByName, navigation]);

  useEffect(() => () => clearTimeout(blurTimer.current), []);

  const onFocus = () => {
    clearTimeout(blurTimer.current);
    setFocused(true);
  };
  // Delayed so a tap on a suggestion (which blurs the field first on web)
  // still lands before the suggestions disappear.
  const onBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 150);
  };
  const closeSearch = () => {
    clearTimeout(blurTimer.current);
    setFocused(false);
    Keyboard.dismiss();
  };

  const openTrip = (trip) =>
    navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title });

  const count = filteredTrips.length;
  const browsing = !destination && !search && explore.selectedCategory === 'All';

  const listHeader = (
    <ExploreListHeader
      destination={destination}
      count={count}
      sortKey={explore.sortKey}
      browsing={browsing}
      showPopular={browsing && !explore.activeFilterCount}
      popularDestinations={explore.popularDestinations}
      onSelectDestination={selectDestination}
    />
  );

  const showSeeMore =
    destination?.type === 'place' && parentRegion && count > 0 && count <= SEE_MORE_MAX;

  let body;
  if (focused) {
    body = (
      <ExploreSuggestions
        query={search}
        suggestions={explore.suggestions}
        recentDestinations={explore.recentDestinations}
        popularDestinations={explore.popularDestinations}
        onSelectDestination={(d) => {
          selectDestination(d);
          closeSearch();
        }}
        onSelectAgency={(agency) => {
          explore.selectAgency(agency);
          closeSearch();
        }}
        onSelectTrip={(trip) => {
          closeSearch();
          openTrip(trip);
        }}
      />
    );
  } else if (loading) {
    body = (
      <View style={styles.listContent}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ExploreTripCardSkeleton key={i} />
        ))}
      </View>
    );
  } else {
    body = (
      <FlatList
        // Remount when the scope changes so the cards' entrance stagger replays.
        key={destination?.key || explore.selectedCategory}
        data={filteredTrips}
        keyExtractor={(trip) => trip._id || trip.title}
        renderItem={({ item, index }) => (
          <ExploreTripCard trip={item} index={index} onPress={() => openTrip(item)} />
        )}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          showSeeMore ? (
            <ExploreSeeMore
              destination={destination}
              parentRegion={parentRegion}
              count={count}
              onPress={() => selectDestination(parentRegion)}
            />
          ) : null
        }
        ListEmptyComponent={<ExploreEmptyState {...getEmptyState(explore)} />}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={explore.refreshing}
            onRefresh={explore.refresh}
            tintColor={colors.ink}
          />
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <ExploreSearchHeader
        search={search}
        onChangeSearch={setSearch}
        onSubmitSearch={() => {
          selectDestinationByName(search);
          closeSearch();
        }}
        focused={focused}
        onFocus={onFocus}
        onBlur={onBlur}
        onCancel={() => {
          setSearch('');
          closeSearch();
        }}
      >
        <ExploreFilterBar
          destination={destination}
          onClearDestination={explore.clearDestination}
          selectedCategory={explore.selectedCategory}
          onSelectCategory={explore.setSelectedCategory}
          filters={explore.filters}
          showFilters={explore.showFilters}
          activeFilterCount={explore.activeFilterCount}
          agencyOptions={explore.agencyOptions}
          onOpenSheet={setSheet}
        />
      </ExploreSearchHeader>

      {body}

      <ExploreFilterSheet
        section={sheet}
        filters={explore.filters}
        sortKey={explore.sortKey}
        whenOptions={explore.whenOptions}
        agencyOptions={explore.agencyOptions}
        onChange={explore.setFilter}
        onToggleAgency={explore.toggleAgency}
        onClear={explore.clearFilters}
        onClose={() => setSheet(null)}
        resultCount={count}
      />
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
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xs,
      paddingBottom: SPACING.xl,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
