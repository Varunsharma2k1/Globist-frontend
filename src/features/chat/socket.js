import { io } from 'socket.io-client';
import { CONFIG } from '../../config';

/**
 * The Socket.IO server is mounted on the same host as the REST API, at the
 * root (`/socket.io`), so strip the `/api` path from the base URL.
 */
export function getSocketUrl() {
  const url = new URL(CONFIG.API_BASE_URL);
  return `${url.protocol}//${url.host}`;
}

/**
 * `getToken` is called on every (re)connect, so a reconnect after the
 * 15-minute access token expired still authenticates with a fresh one.
 */
export function createChatSocket(getToken) {
  return io(getSocketUrl(), {
    path: '/socket.io',
    auth: (cb) => {
      getToken().then((token) => cb({ token }), () => cb({}));
    },
    // Skip HTTP long-polling: RN supports WebSocket natively and it avoids
    // sticky-session needs behind a load balancer.
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });
}

/** emit with ack + timeout, resolves to the server's `{ ok, ... }` reply. */
export function emitWithAck(socket, event, payload, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) return reject(new Error('offline'));
    socket.timeout(timeoutMs).emit(event, payload, (err, res) => {
      if (err) return reject(new Error('timeout'));
      if (!res?.ok) return reject(new Error(res?.error || 'failed'));
      resolve(res);
    });
  });
}
