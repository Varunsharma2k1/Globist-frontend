import client from './client';

export const getNotifications = async () => (await client.get('/notifications')).data;
export const getUnreadNotificationCount = async () =>
  (await client.get('/notifications/unread-count')).data.count;
export const markNotificationsRead = () => client.post('/notifications/read');
