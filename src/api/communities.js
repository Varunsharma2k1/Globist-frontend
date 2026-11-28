import client from './client';

/** { slug: { members, online } } — real counts from the server. */
export const getCommunityStats = async () => (await client.get('/communities/stats')).data;
export const getJoinedCommunities = async () => (await client.get('/communities/mine')).data;
export const joinCommunity = (slug) => client.put(`/communities/${slug}/join`);
export const leaveCommunity = (slug) => client.delete(`/communities/${slug}/join`);
export const getCommunityPosts = async (slug) => (await client.get(`/communities/${slug}/posts`)).data;
export const createCommunityPost = async (slug, post) =>
  (await client.post(`/communities/${slug}/posts`, post)).data;
export const getCommunityPost = async (id) => (await client.get(`/communities/posts/${id}`)).data;
export const addCommunityComment = async (id, text) =>
  (await client.post(`/communities/posts/${id}/comments`, { text })).data;
export const voteCommunityPost = async (id, value) =>
  (await client.put(`/communities/posts/${id}/vote`, { value })).data;
