import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as tokenStore from '../api/tokenStore';
import { useAuth } from '../hooks/useAuth';
import { getConversations, postMessage, markConversationRead } from '../api/chat';
import { createChatSocket, emitWithAck } from '../features/chat/socket';

/**
 * Chat session for the signed-in user: one Socket.IO connection, the inbox
 * list (kept live from `message:new`), unread totals, typing and presence.
 * Thread screens subscribe to per-conversation events via `subscribe`.
 *
 * Sending goes over the socket when connected and falls back to REST
 * otherwise; a client-generated id makes both paths idempotent.
 */
export const ChatContext = createContext(null);

const newClientId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isGuest && user._id);
  const userId = signedIn ? String(user._id) : null;

  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState({}); // conversationId -> bool
  const [online, setOnline] = useState({}); // userId -> bool
  const typingTimers = useRef({});

  const emit = useCallback((event) => {
    listenersRef.current.forEach((fn) => fn(event));
  }, []);

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  const upsertConversation = useCallback((conv) => {
    setConversations((prev) => {
      const rest = prev.filter((c) => String(c._id) !== String(conv._id));
      return [conv, ...rest].sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || b.updatedAt) -
          new Date(a.lastMessage?.createdAt || a.updatedAt)
      );
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!signedIn) return;
    setLoading(true);
    try {
      setConversations(await getConversations());
      setError(null);
    } catch (e) {
      setError('Could not load chats');
    } finally {
      setLoading(false);
    }
  }, [signedIn]);

  // Connect / disconnect with the session.
  useEffect(() => {
    if (!signedIn) {
      setConversations([]);
      return undefined;
    }
    let cancelled = false;
    let socket;

    (async () => {
      const token = await tokenStore.getAccessToken();
      if (cancelled || !token) return;
      socket = createChatSocket(tokenStore.getAccessToken);
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        // Catch up on anything missed while disconnected.
        refresh();
        emit({ type: 'reconnect' });
      });
      socket.on('disconnect', () => setConnected(false));
      socket.on('connect_error', () => {
        setConnected(false);
        // Auth rejections aren't retried by socket.io itself; retry with a fresh token.
        if (!socket.active) setTimeout(() => !cancelled && socket.connect(), 5000);
      });

      socket.on('message:new', ({ message, conversation }) => {
        upsertConversation(conversation);
        emit({ type: 'message', message, conversation });
        if (String(message.sender) !== userId) {
          setTyping((t) => ({ ...t, [conversation._id]: false }));
        }
      });
      socket.on('conversation:read', (evt) => {
        if (evt.userId === userId) {
          setConversations((prev) =>
            prev.map((c) => (String(c._id) === evt.conversationId ? { ...c, unread: 0 } : c))
          );
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              String(c._id) === evt.conversationId ? { ...c, otherLastReadAt: evt.at } : c
            )
          );
        }
        emit({ type: 'read', ...evt });
      });
      socket.on('typing', ({ conversationId, isTyping }) => {
        clearTimeout(typingTimers.current[conversationId]);
        setTyping((t) => ({ ...t, [conversationId]: isTyping }));
        // Auto-clear in case the "stopped typing" event is lost.
        if (isTyping) {
          typingTimers.current[conversationId] = setTimeout(
            () => setTyping((t) => ({ ...t, [conversationId]: false })),
            5000
          );
        }
      });
      socket.on('presence', ({ userId: id, online: isOnline }) =>
        setOnline((o) => ({ ...o, [id]: isOnline }))
      );
    })();

    refresh();

    return () => {
      cancelled = true;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socketRef.current = null;
      setConnected(false);
    };
  }, [signedIn, userId, refresh, emit, upsertConversation]);

  // Reconnect promptly when the app returns to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const s = socketRef.current;
      if (state === 'active' && s && !s.connected) s.connect();
    });
    return () => sub.remove();
  }, []);

  const sendMessage = useCallback(
    async (conversationId, text, clientId = newClientId()) => {
      const socket = socketRef.current;
      let message;
      try {
        ({ message } = await emitWithAck(socket, 'message:send', { conversationId, text, clientId }));
      } catch (e) {
        if (e.message !== 'offline' && e.message !== 'timeout') throw e;
        // Socket unavailable: same clientId over REST, so no duplicate if the
        // socket attempt actually landed.
        message = await postMessage(conversationId, { text, clientId });
      }
      return message;
    },
    []
  );

  const markRead = useCallback(async (conversationId) => {
    setConversations((prev) =>
      prev.map((c) => (String(c._id) === String(conversationId) ? { ...c, unread: 0 } : c))
    );
    try {
      await emitWithAck(socketRef.current, 'conversation:read', { conversationId });
    } catch {
      markConversationRead(conversationId).catch(() => {});
    }
  }, []);

  const sendTyping = useCallback((conversationId, isTyping) => {
    const s = socketRef.current;
    if (s?.connected) s.emit('typing', { conversationId, isTyping });
  }, []);

  const queryPresence = useCallback(async (ids) => {
    try {
      const res = await emitWithAck(socketRef.current, 'presence:query', { userIds: ids });
      setOnline((o) => {
        const next = { ...o };
        ids.forEach((id) => (next[id] = res.online.includes(id)));
        return next;
      });
    } catch {
      /* offline: leave presence unknown */
    }
  }, []);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  );

  const value = useMemo(
    () => ({
      userId,
      connected,
      conversations,
      loading,
      error,
      unreadTotal,
      typing,
      online,
      refresh,
      subscribe,
      sendMessage,
      markRead,
      sendTyping,
      queryPresence,
      upsertConversation,
      newClientId,
    }),
    [userId, connected, conversations, loading, error, unreadTotal, typing, online, refresh,
      subscribe, sendMessage, markRead, sendTyping, queryPresence, upsertConversation]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
