import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Heart, MessageCircle, UserPlus, Plane } from 'lucide-react-native';
import { getNotifications, markNotificationsRead } from '../../../api/notifications';
import { refreshInboxBadge } from '../../../hooks/useInboxBadge';
import { formatRelativeTime } from '../../reels/utils/reelFormat';

const COPY = {
  like: { icon: Heart, tone: 'error', text: (n) => `${n.who} liked your tape${n.place}.` },
  comment: { icon: MessageCircle, tone: 'ink', text: (n) => `${n.who} commented: "${n.text}"` },
  follow: { icon: UserPlus, tone: 'success', text: (n) => `${n.who} started following you.` },
  booking: { icon: Plane, tone: 'verified', text: (n) => `Your trip is booked: ${n.text}.` },
};

/**
 * Inbox → Notifications from the server (likes, comments, follows,
 * bookings). Refreshes when the Inbox is opened; `markRead()` clears the
 * unread dots once you've looked.
 */
export function useNotifications(signedIn, colors) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!signedIn) {
        setRaw([]);
        return undefined;
      }
      let alive = true;
      setLoading(true);
      getNotifications()
        .then((list) => alive && setRaw(list))
        .catch(() => {})
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, [signedIn])
  );

  const markRead = useCallback(() => {
    if (!raw.some((n) => !n.read)) return;
    markNotificationsRead()
      .then(refreshInboxBadge)
      .catch(() => {});
    setRaw((list) => list.map((n) => ({ ...n, read: true })));
  }, [raw]);

  const notifications = raw
    .filter((n) => COPY[n.type])
    .map((n) => {
      const c = COPY[n.type];
      const place = n.reel?.location ? ` from ${n.reel.location.split(',')[0]}` : '';
      return {
        id: n._id,
        icon: c.icon,
        tone: colors[c.tone],
        text: c.text({ who: n.actor?.name || 'Someone', text: n.text, place }),
        time: formatRelativeTime(new Date(n.createdAt).getTime()),
        unread: !n.read,
        actor: n.actor,
      };
    });

  return { notifications, loading, markRead };
}

export default useNotifications;
