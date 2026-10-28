import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/Button';
import { useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT, FONTS } from '../../../theme';
import { getNotifications, CHATS } from '../data/inboxData';
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
  const navigation = useNavigation();
  const { joinedCommunities } = useCommunityData();
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

        {tab === 'communities' && (
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
