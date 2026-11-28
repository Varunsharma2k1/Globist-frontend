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
  return reels
    .filter((r) => Boolean(r.mediaUrl))
    .map((r) => ({ ...r, mediaUrl: resolveMediaUrl(r.mediaUrl) }));
};

/**
 * The server may return either a relative path (e.g. /uploads/reels/x.mp4)
 * or an already-absolute URL. The video player needs an absolute URL, so
 * relative paths are resolved against the API's own origin.
 * @param {string} mediaUrl
 * @returns {string}
 */
function resolveMediaUrl(mediaUrl) {
  if (!mediaUrl || !mediaUrl.startsWith('/')) return mediaUrl;
  const origin = CONFIG.API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${mediaUrl}`;
}

/** Like / unlike (both safe to repeat). @returns {Promise<{liked, likes}>} */
export const likeReel = async (reelId) => (await client.put(`/reels/${reelId}/like`)).data;
export const unlikeReel = async (reelId) => (await client.delete(`/reels/${reelId}/like`)).data;
/** Ids of tapes I liked. */
export const getLikedReelIds = async () => (await client.get('/reels/liked-ids')).data;

/** Comments on a tape, newest first. */
export const getReelComments = async (reelId) =>
  (await client.get(`/reels/${reelId}/comments`)).data;
export const postReelComment = async (reelId, text) =>
  (await client.post(`/reels/${reelId}/comments`, { text })).data;
export const deleteReelComment = (commentId) => client.delete(`/reels/comments/${commentId}`);
/**
 * Tapes tagged to an agency (verified bookings only), newest first.
 * @param {string} agencyId - backend agency _id
 */
export const getAgencyReels = async (agencyId) => {
  const response = await client.get(`/reels/agency/${agencyId}`);
  return (response.data || []).map((r) => ({ ...r, mediaUrl: resolveMediaUrl(r.mediaUrl) }));
};

/** Live map numbers from MongoDB: { tapes, spots } (spots = distinct tagged locations). */
export const getTapeStats = async () => (await client.get('/reels/stats')).data;

/** The signed-in user's own tapes, newest first (incl. still processing). */
export const getMyReels = async () =>
  ((await client.get('/reels/mine')).data || []).map((r) => ({
    ...r,
    mediaUrl: resolveMediaUrl(r.mediaUrl),
  }));

/** Someone's public tapes, newest first (their profile grid). */
export const getUserReels = async (userId) =>
  ((await client.get(`/reels/user/${userId}`)).data || []).map((r) => ({
    ...r,
    mediaUrl: resolveMediaUrl(r.mediaUrl),
  }));
