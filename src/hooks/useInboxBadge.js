import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './useAuth';
import { useChat } from './useChat';
import { getUnreadNotificationCount } from '../api/notifications';

const POLL_MS = 30 * 1000;
const listeners = new Set();

/** Ask the badge to re-count now (e.g. after notifications are marked read). */
export const refreshInboxBadge = () => listeners.forEach((fn) => fn());

/**
 * Unread total for the Inbox tab dot: unread chat messages (live, over the
 * socket) + unread notifications (counted from the server every 30s while the
 * app is open, and again whenever the app returns to the foreground).
 */
export function useInboxBadge() {
  const { user } = useAuth();
  const { unreadTotal } = useChat();
  const signedIn = Boolean(user && !user.isGuest && user._id);
  const [notifCount, setNotifCount] = useState(0);

  const refresh = useCallback(() => {
    if (!signedIn) return setNotifCount(0);
    getUnreadNotificationCount()
      .then((n) => setNotifCount(Number(n) || 0))
      .catch(() => {});
  }, [signedIn]);

  useEffect(() => {
    refresh();
    listeners.add(refresh);
    const timer = setInterval(() => AppState.currentState === 'active' && refresh(), POLL_MS);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => {
      listeners.delete(refresh);
      clearInterval(timer);
      sub.remove();
    };
  }, [refresh]);

  return signedIn ? (unreadTotal || 0) + notifCount : 0;
}
