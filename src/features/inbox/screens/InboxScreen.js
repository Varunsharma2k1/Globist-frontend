import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { getNotifications, CHATS, getCommunities } from '../data/inboxData';
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
export default function InboxScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const notifications = getNotifications(colors);
  const communities = getCommunities(colors);
  const [tab, setTab] = useState('notifications');

  const unreadCountFor = (key) => {
    if (key === 'notifications') return notifications.filter((n) => n.unread).length;
    if (key === 'chat') return CHATS.filter((c) => c.unread).length;
    return 0;
  };

  return (
    <View style={styles.container}>
      <InboxHeader activeTab={tab} onChangeTab={setTab} unreadCountFor={unreadCountFor} />

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'notifications' &&
          notifications.map((n) => <NotificationRow key={n.id} notification={n} />)}

        {tab === 'chat' && CHATS.map((c) => <ChatRow key={c.id} chat={c} />)}

        {tab === 'communities' &&
          communities.map((g) => <CommunityRow key={g.id} community={g} />)}
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
    content: {
      padding: SPACING.md,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
      gap: SPACING.sm,
    },
  });
}
