import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { getSharedInboxRowStyles } from './sharedInboxRowStyles';

export default function NotificationRow({ notification }) {
  const { colors } = useTheme();
  const styles = getSharedInboxRowStyles(colors);
  const Icon = notification.icon;

  return (
    <View style={styles.row}>
      <View style={[styles.iconTile, { backgroundColor: `${notification.tone}1A` }]}>
        <Icon size={18} color={notification.tone} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowText}>{notification.text}</Text>
        <Text style={styles.rowTime}>{notification.time} ago</Text>
      </View>
      {notification.unread && <View style={styles.unreadDot} />}
    </View>
  );
}
