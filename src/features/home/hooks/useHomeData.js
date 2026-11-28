import { useEffect, useState, useCallback } from 'react';
import * as catalog from '../../../cache/catalog';
import { pickFeaturedRegions } from '../../../data/featuredRegions';

/**
 * Fetches the Home screen's dashboard data — curated featured regions and
 * trending trips — in parallel. Each request fails independently (falls
 * back to an empty list) so a slow/broken endpoint doesn't blank the whole
 * screen.
 */
export function useHomeData() {
  const [regions, setRegions] = useState(() => pickFeaturedRegions(catalog.peek('featured') || []));
  const [trendingTrips, setTrendingTrips] = useState(() => catalog.peek('trips') || []);
  const [loading, setLoading] = useState(() => !catalog.peek('featured'));

  const fetchHomeData = useCallback(async () => {
    try {
      const [regionsData, exploreData] = await Promise.all([
        // Dedicated endpoint that the backend already restricts to the
        // curated two regions with their imageUrl + tagline attached.
        catalog.load('featured').catch(() => []),
        catalog.load('trips').catch(() => []),
      ]);
      setRegions(pickFeaturedRegions(regionsData || []));
      setTrendingTrips(exploreData || []);
    } catch (error) {
      console.warn('[useHomeData] Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
    return catalog.subscribe((key) => {
      if (key === 'featured') setRegions(pickFeaturedRegions(catalog.peek('featured') || []));
      if (key === 'trips') setTrendingTrips(catalog.peek('trips') || []);
    });
  }, [fetchHomeData]);

  return { regions, trendingTrips, loading, refetch: fetchHomeData };
}

export default useHomeData;
