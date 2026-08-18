import client from './client';

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
