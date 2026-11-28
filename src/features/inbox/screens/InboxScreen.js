import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/Button';
import { useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT, FONTS } from '../../../theme';
import { useChat } from '../../../hooks/useChat';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useNotifications } from '../hooks/useNotifications';
import InboxHeader from '../components/InboxHeader';
import NotificationRow from '../components/NotificationRow';
import ChatRow from '../components/ChatRow';
import CommunityRow from '../components/CommunityRow';

/**
 * InboxScreen Component
 *
 * Reddit-style inbox with three switchable sections — Notifications, Chat,
 * and Communities. Replaces the My Trips tab (moved into Profile) so the tab
 * bar's 4th slot covers the app's social/messaging surface instead.
 */
// What guests see on each tab (nothing personal is shown until sign-in).
const GUEST_COPY = {
  notifications: {
    title: 'No notifications',
    body: 'Sign in to see likes, comments, new followers and booking updates.',
  },
  chat: {
    title: 'No chats',
    body: 'Sign in to chat with creators and agencies about your next trip.',
  },
  communities: {
    title: 'No communities',
    body: 'Sign in to join travel clubs and see their posts.',
  },
};

export default function InboxScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();
  const { joinedCommunities } = useCommunityData();
  const [tab, setTab] = useState('notifications');
  const chat = useChat();
  const { isSignedIn, requireAuth } = useRequireAuth(navigation);
  const { notifications, loading: notifLoading, markRead } = useNotifications(isSignedIn, colors);

  // Looking at the Notifications tab clears its unread dots.
  React.useEffect(() => {
    if (tab === 'notifications' && notifications.some((n) => n.unread)) {
      const t = setTimeout(markRead, 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [tab, notifications, markRead]);

  const unreadCountFor = (key) => {
    if (!isSignedIn) return 0;
    if (key === 'notifications') return notifications.filter((n) => n.unread).length;
    if (key === 'chat') return chat.unreadTotal;
    return 0;
  };

  return (
    <View style={styles.container}>
      <InboxHeader activeTab={tab} onChangeTab={setTab} unreadCountFor={unreadCountFor} />

      <ScrollView contentContainerStyle={styles.content}>
        {!isSignedIn && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{GUEST_COPY[tab].title}</Text>
            <Text style={styles.emptyBody}>{GUEST_COPY[tab].body}</Text>
            <Button
              title="Sign in"
              onPress={() => requireAuth({ name: 'MainTabs' })}
              style={{ marginTop: SPACING.md, alignSelf: 'stretch' }}
            />
          </View>
        )}

        {isSignedIn && tab === 'notifications' && notifications.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {notifLoading ? 'Loading…' : 'No notifications yet'}
            </Text>
            {!notifLoading && (
              <Text style={styles.emptyBody}>
                Likes, comments, new followers and booking updates show up here.
              </Text>
            )}
          </View>
        )}

        {isSignedIn &&
          tab === 'notifications' &&
          notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onPress={
                n.actor?._id
                  ? () => navigation.navigate('CreatorProfile', { creator: n.actor })
                  : undefined
              }
            />
          ))}

        {tab === 'chat' && isSignedIn && chat.conversations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {chat.loading ? 'Loading chats…' : chat.error || 'No chats yet'}
            </Text>
            {!chat.loading && (
              <Text style={styles.emptyBody}>
                Tap Message on a creator or agency profile to start a conversation.
              </Text>
            )}
          </View>
        )}

        {tab === 'chat' &&
          isSignedIn &&
          chat.conversations.map((c) => (
            <ChatRow
              key={c._id}
              chat={c}
              myId={chat.userId}
              typing={chat.typing[c._id]}
              online={c.other?._id && chat.online[String(c.other._id)]}
              onPress={() => navigation.navigate('ChatThread', { conversation: c })}
            />
          ))}

        {isSignedIn && tab === 'communities' && (
          <>
            {joinedCommunities.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No communities yet</Text>
                <Text style={styles.emptyBody}>
                  Join travel clubs to see their posts and chat with people heading where you are.
                </Text>
              </View>
            )}
            {joinedCommunities.map((g) => (
              <CommunityRow
                key={g.id}
                community={g}
                onPress={() => navigation.navigate('CommunityDetail', { communityId: g.id })}
              />
            ))}
            <Button
              title="Discover Communities"
              variant={joinedCommunities.length ? 'outline' : 'primary'}
              onPress={() => navigation.navigate('Communities')}
              style={{ marginTop: SPACING.sm }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    empty: { alignItems: 'center', paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg },
    emptyTitle: {
      fontSize: 18,
      color: colors.ink,
      marginBottom: SPACING.xs,
      fontFamily: FONTS.heading,
    },
    emptyBody: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      fontFamily: FONTS.body,
    },
    content: {
      padding: SPACING.md,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.sm,
    },
  });
}
