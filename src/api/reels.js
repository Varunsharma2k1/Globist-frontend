import client from './client';
import { CONFIG } from '../config';

/**
 * Travel Reels API Service
 *
 * Provides methods to fetch community/creator travel reels and publish new video content.
 */

/**
 * Fetches feed of travel reels. Backend defaults to a small page size (5) meant
 * for cursor-based infinite scroll; since the app doesn't paginate yet, request
 * a larger page so the full seeded feed comes back in one call.
 *
 * For now, only reels with an actual video attached are shown — most seeded
 * reels have no mediaUrl yet and would just render the placeholder screen.
 * Remove this filter once every reel has real media.
 * @returns {Promise<Array>}
 */
export const getReels = async () => {
  const response = await client.get('/reels', { params: { limit: 30 } });
  const reels = response.data.reels || response.data || [];
  return reels.filter((r) => Boolean(r.mediaUrl));
};

/**
 * Submits a new travel reel.
 * @param {Object} reelData - ({ caption, location, mediaUrl, imageType, tags, agencyId, isAffiliate })
 * @returns {Promise<Object>}
 */
export const createReel = async (reelData) => {
  const payload = {
    ...reelData,
    mediaUrl: reelData.mediaUrl || CONFIG.DEFAULT_DEMO_VIDEO,
    tags: reelData.tags?.length ? reelData.tags : ['Travel', 'Exploration'],
  };
  const response = await client.post('/reels', payload);
  return response.data;
};

/**
 * Uploads a picked video/photo file for a reel and returns its absolute URL.
 * @param {{ uri: string, name: string, type: string }} file
 * @returns {Promise<string>} absolute mediaUrl
 */
export const uploadReelMedia = async (file) => {
  const form = new FormData();
  form.append('file', file);

  const response = await client.post('/reels/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Server returns a relative path (e.g. /uploads/reels/xyz.mp4); resolve it
  // against the API's origin so the video player gets a playable absolute URL.
  const origin = CONFIG.API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${response.data.url}`;
};

/**
 * Toggles like on a travel reel.
 * @param {string} reelId
 * @returns {Promise<Object>}
 */
export const likeReel = async (reelId) => {
  const response = await client.post(`/reels/${reelId}/like`);
  return response.data;
};
