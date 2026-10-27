import { useState, useEffect, useCallback, useMemo } from 'react';
import { getExploreTrips, getRegions } from '../../../api';
import {
  buildDestinations,
  findDestinationByName,
  findParentRegion,
  getSuggestions,
  tripMatchesText,
} from '../utils/exploreSearch';
import {
  DEFAULT_FILTERS,
  applyFilters,
  sortTrips,
  countActiveFilters,
  availableWhenOptions,
  agencyOptions as buildAgencyOptions,
} from '../utils/exploreFilters';
import { useRecentDestinations } from './useRecentDestinations';

export const CATEGORIES = ['All', 'Mountains', 'Beaches', 'Deserts', 'Treks', 'Luxury'];

// How each chip matches a trip: landscape chips match the trip's imageType,
// activity/style chips match the categories of the agency running it.
const CATEGORY_MATCHERS = {
  Mountains: { imageTypes: ['mountain', 'snow', 'valley'] },
  Beaches: { imageTypes: ['beach'] },
  Deserts: { imageTypes: ['desert'] },
  Treks: { agencyCategory: 'Treks' },
  Luxury: { agencyCategory: 'Luxury' },
};

function matchesCategory(trip, category) {
  const matcher = CATEGORY_MATCHERS[category];
  if (!matcher) return true;
  if (matcher.imageTypes) return matcher.imageTypes.includes(trip.imageType);
  return trip.agency?.categories?.includes(matcher.agencyCategory) ?? false;
}

// Refine chips (When / Budget / Filters) only appear once there's enough to
// narrow down — a place with two packages doesn't need five filters.
const FILTERS_MIN_TRIPS = 6;

/**
 * Owns Explore's state: the trip + region catalogue (fetched once), free-text
 * search, category chip, selected destination (a region like Ladakh or a
 * place inside it like Zanskar) and the refine filters. All filtering is
 * client-side so every change is instant.
 */
export function useExploreTrips() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [destinationKey, setDestinationKey] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [trips, setTrips] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { recents, addRecent } = useRecentDestinations();

  const fetchExploreData = useCallback(async ({ isRefresh = false } = {}) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [tripData, regionData] = await Promise.all([
        getExploreTrips(),
        // Destinations are a nice-to-have; trips still list without them.
        getRegions().catch(() => []),
      ]);
      setTrips(tripData.trips || []);
      setRegions(regionData || []);
    } catch (error) {
      console.warn('[useExploreTrips] Error fetching trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExploreData();
  }, [fetchExploreData]);

  const refresh = useCallback(() => fetchExploreData({ isRefresh: true }), [fetchExploreData]);

  const destinations = useMemo(() => buildDestinations(regions, trips), [regions, trips]);
  const destination = destinations.find((d) => d.key === destinationKey) || null;
  const parentRegion = findParentRegion(destinations, destination);

  const scopedTrips = trips.filter(
    (t) =>
      (destination ? destination.tripIds.has(t._id) : matchesCategory(t, selectedCategory)) &&
      tripMatchesText(t, search)
  );
  const sortKey = filters.sort || (destination ? 'soonest' : 'recommended');
  const filteredTrips = sortTrips(applyFilters(scopedTrips, filters), sortKey);
  const activeFilterCount = countActiveFilters(filters);
  const showFilters = scopedTrips.length > FILTERS_MIN_TRIPS || activeFilterCount > 0;
  const whenOptions = availableWhenOptions(scopedTrips);
  const agencyOptions = buildAgencyOptions(scopedTrips);

  const suggestions = useMemo(
    () => getSuggestions(search, destinations, trips),
    [search, destinations, trips]
  );
  const popularDestinations = useMemo(
    () =>
      destinations
        .filter((d) => d.type === 'region' && d.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    [destinations]
  );
  const recentDestinations = recents
    .map((r) => destinations.find((d) => d.key === r.key))
    .filter(Boolean);

  const selectDestination = useCallback(
    (dest) => {
      setDestinationKey(dest.key);
      setSearch('');
      setSelectedCategory('All');
      setFilters(DEFAULT_FILTERS);
      addRecent(dest);
    },
    [addRecent]
  );

  // Returns true when `name` was an exact destination and got selected.
  const selectDestinationByName = useCallback(
    (name) => {
      const dest = findDestinationByName(destinations, name);
      if (dest) selectDestination(dest);
      return Boolean(dest);
    },
    [destinations, selectDestination]
  );

  const clearDestination = useCallback(() => {
    setDestinationKey(null);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleAgency = useCallback((id) => {
    setFilters((prev) => ({
      ...prev,
      agencies: prev.agencies.includes(id)
        ? prev.agencies.filter((a) => a !== id)
        : [...prev.agencies, id],
    }));
  }, []);

  // From search suggestions: show every trip by this one agency.
  const selectAgency = useCallback((agency) => {
    setSearch('');
    setSelectedCategory('All');
    setDestinationKey(null);
    setFilters({ ...DEFAULT_FILTERS, agencies: [agency._id || agency.name] });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
  }, []);

  const resetAll = useCallback(() => {
    setSearch('');
    setSelectedCategory('All');
    setDestinationKey(null);
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    loading,
    refreshing,
    refresh,
    filteredTrips,
    // destination search
    destination,
    parentRegion,
    suggestions,
    popularDestinations,
    recentDestinations,
    selectDestination,
    selectDestinationByName,
    clearDestination,
    // refine
    filters,
    sortKey,
    whenOptions,
    agencyOptions,
    setFilter,
    toggleAgency,
    selectAgency,
    clearFilters,
    activeFilterCount,
    showFilters,
    resetAll,
  };
}

export default useExploreTrips;
