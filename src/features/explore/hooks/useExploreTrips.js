import { useState, useEffect, useCallback } from 'react';
import { getExploreTrips } from '../../../api';

export const CATEGORIES = ['All', 'Mountains', 'Beaches', 'Deserts', 'Treks', 'Luxury'];

/**
 * Owns Explore's search/category filter state and the trip list fetch +
 * category filtering (server-independent — filtering happens client-side
 * over whatever the category fetch already returned).
 */
export function useExploreTrips() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExploreTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExploreTrips();
      const allTrips = data.trips || [];
      if (selectedCategory === 'All') {
        setTrips(allTrips);
      } else {
        setTrips(
          allTrips.filter(
            (t) =>
              t.tags?.includes(selectedCategory) ||
              t.imageType === selectedCategory.toLowerCase().slice(0, -1)
          )
        );
      }
    } catch (error) {
      console.warn('[useExploreTrips] Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchExploreTrips();
  }, [fetchExploreTrips]);

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    loading,
    filteredTrips,
  };
}

export default useExploreTrips;
