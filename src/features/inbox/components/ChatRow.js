import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';
import { getSharedInboxRowStyles } from './sharedInboxRowStyles';

export default function ChatRow({ chat }) {
  const { colors } = useTheme();
  const sharedStyles = getSharedInboxRowStyles(colors);
  const styles = getStyles(colors);
  const initial = chat.name.charAt(chat.name.startsWith('@') ? 1 : 0).toUpperCase();

  return (
    <TouchableOpacity style={sharedStyles.row} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={sharedStyles.chatName}>{chat.name}</Text>
        <Text style={sharedStyles.rowText} numberOfLines={1}>
          {chat.preview}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={sharedStyles.rowTime}>{chat.time}</Text>
        {chat.unread && <View style={sharedStyles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.pastel.peach.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.pastel.peach.fg,
    },
  });
}
