import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BadgeCheck } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONTS } from '../../../theme';
import { getSharedInboxRowStyles } from './sharedInboxRowStyles';
import { relativeTime, initialOf } from '../../chat/utils/format';

/** One inbox row for a conversation from ChatContext. */
export default function ChatRow({ chat, myId, typing, online, onPress }) {
  const { colors } = useTheme();
  const sharedStyles = getSharedInboxRowStyles(colors);
  const styles = getStyles(colors);
  const name = chat.other?.name || 'Traveler';
  const last = chat.lastMessage;
  const mine = last && String(last.sender) === String(myId);
  const preview = typing
    ? 'typing…'
    : last
      ? `${mine ? 'You: ' : ''}${last.text}`
      : 'No messages yet';

  return (
    <TouchableOpacity style={sharedStyles.row} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{initialOf(name)}</Text>
        {online && <View style={[styles.onlineDot, { borderColor: colors.surface }]} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={sharedStyles.chatName} numberOfLines={1}>
            {name}
          </Text>
          {chat.other?.isVerified && <BadgeCheck size={13} color={colors.verified} />}
        </View>
        <Text
          style={[sharedStyles.rowText, chat.unread > 0 && { fontFamily: FONTS.semibold }]}
          numberOfLines={1}
        >
          {preview}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={sharedStyles.rowTime}>{relativeTime(last?.createdAt || chat.updatedAt)}</Text>
        {chat.unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.unread > 99 ? '99+' : chat.unread}</Text>
          </View>
        )}
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
    onlineDot: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 11,
      height: 11,
      borderRadius: 6,
      borderWidth: 2,
      backgroundColor: colors.success,
    },
    badge: {
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      borderRadius: 9,
      backgroundColor: colors.ink,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { fontFamily: FONTS.bold, fontSize: 12, color: colors.inkContrast },
  });
}
