import client from './client';
import { normalizeRegion, normalizeTrip } from './normalize';

/**
 * Regions API Service
 *
 * Handles fetching travel destinations and region-specific trip packages.
 */

/**
 * Fetches ALL regions. Used by Explore where we need the full
 * catalogue. For the curated two-region home feed, use getFeaturedRegions().
 * @returns {Promise<Array>}
 */
export const getRegions = async () => {
  const response = await client.get('/regions');
  return (response.data || []).map(normalizeRegion);
};

/**
 * Fetches the curated featured regions for the home screen. The backend
 * hard-caps this list to Himachal + Uttarakhand (see server/routes/regions.js)
 * and each entry now ships with its own `imageUrl` + `tagline`.
 * @returns {Promise<Array>}
 */
export const getFeaturedRegions = async () => {
  const response = await client.get('/regions/featured');
  return (response.data || []).map(normalizeRegion);
};

/**
 * Fetches details and trips for a specific region.
 * @param {string} regionId
 * @returns {Promise<Object>}
 */
export const getRegionById = async (regionId) => {
  const response = await client.get(`/regions/${regionId}`);
  return {
    ...response.data,
    region: normalizeRegion(response.data.region),
    trips: (response.data.trips || []).map(normalizeTrip),
  };
};
