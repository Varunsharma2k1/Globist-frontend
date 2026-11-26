import client from './client';

/** REST side of chat: history, inbox list, and a send fallback when the socket is down. */
export const getConversations = () =>
  client.get('/chat/conversations').then((r) => r.data.conversations);

export const startConversation = ({ userId, agencyId }) =>
  client.post('/chat/conversations', { userId, agencyId }).then((r) => r.data.conversation);

export const getMessages = (conversationId, { before, limit = 30 } = {}) =>
  client
    .get(`/chat/conversations/${conversationId}/messages`, { params: { before, limit } })
    .then((r) => r.data);

export const postMessage = (conversationId, { text, clientId }) =>
  client
    .post(`/chat/conversations/${conversationId}/messages`, { text, clientId })
    .then((r) => r.data.message);

export const markConversationRead = (conversationId) =>
  client.post(`/chat/conversations/${conversationId}/read`).then((r) => r.data);
