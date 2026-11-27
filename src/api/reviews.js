import client from './client';

/**
 * Agency reviews (the "Reviews" tab), stored in MongoDB.
 * Review: { _id, text, createdAt, verifiedTraveller, user: { _id, name, avatar } }
 */

/** @returns {Promise<{reviews: Array, total: number, hasMore: boolean}>} */
export const getAgencyReviews = async (agencyId, { before } = {}) =>
  (await client.get(`/reviews/agency/${agencyId}`, { params: { before } })).data;

export const postAgencyReview = async (agencyId, text) =>
  (await client.post(`/reviews/agency/${agencyId}`, { text })).data;

export const deleteReview = (reviewId) => client.delete(`/reviews/${reviewId}`);
