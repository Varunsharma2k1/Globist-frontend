import client from './client';

export const getPublicProfile = async (userId) =>
  (await client.get(`/users/${userId}/public`)).data;
export const getFollowingIds = async () => (await client.get('/users/me/following-ids')).data;
export const followUser = async (userId) => (await client.post(`/users/${userId}/follow`)).data;
export const unfollowUser = async (userId) => (await client.delete(`/users/${userId}/follow`)).data;
/** @param {'followers'|'following'} kind */
export const getFollowList = async (userId, kind) =>
  (await client.get(`/users/${userId}/${kind}`)).data;
