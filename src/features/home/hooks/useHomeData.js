import { useEffect, useState, useCallback } from 'react';
import { getFeaturedRegions, getExploreTrips } from '../../../api';
import { pickFeaturedRegions } from '../../../data/featuredRegions';

/**
 * Fetches the Home screen's dashboard data — curated featured regions and
 * trending trips — in parallel. Each request fails independently (falls
 * back to an empty list) so a slow/broken endpoint doesn't blank the whole
 * screen.
 */
export function useHomeData() {
  const [regions, setRegions] = useState([]);
  const [trendingTrips, setTrendingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    try {
      const [regionsData, exploreData] = await Promise.all([
        // Dedicated endpoint that the backend already restricts to the
        // curated two regions with their imageUrl + tagline attached.
        getFeaturedRegions().catch(() => []),
        getExploreTrips().catch(() => ({ trips: [] })),
      ]);
      setRegions(pickFeaturedRegions(regionsData));
      setTrendingTrips(exploreData.trips || []);
    } catch (error) {
      console.warn('[useHomeData] Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return { regions, trendingTrips, loading, refetch: fetchHomeData };
}

export default useHomeData;
