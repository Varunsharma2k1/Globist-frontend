import client from './client';
import { normalizeTrip } from './normalize';

/**
 * Agencies API Service
 *
 * Used for the Post Reel "collaborate with an agency" picker.
 */

/**
 * Fetches agencies for the collaborator picker.
 * @returns {Promise<Array>}
 */
export const getAgencies = async () => {
  const response = await client.get('/agencies', { params: { limit: 30 } });
  return response.data || [];
};

/**
 * Fetches a single agency along with the trips it runs. Reels link to an
 * agency (not a specific trip), so the reel "Book Trip" flow resolves the
 * bookable trip through this.
 * @param {string} agencyId
 * @returns {Promise<{agency: Object, trips: Array}>}
 */
export const getAgencyTrips = async (agencyId) => {
  const response = await client.get(`/agencies/${agencyId}`);
  return {
    agency: response.data.agency,
    trips: (response.data.trips || []).map(normalizeTrip),
  };
};
