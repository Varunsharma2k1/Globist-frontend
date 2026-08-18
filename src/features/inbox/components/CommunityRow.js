import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { getSharedInboxRowStyles } from './sharedInboxRowStyles';

export default function CommunityRow({ community }) {
  const { colors } = useTheme();
  const styles = getSharedInboxRowStyles(colors);

  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
      <View style={[styles.iconTile, { backgroundColor: community.tone.bg }]}>
        <Users size={18} color={community.tone.fg} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.chatName}>{community.name}</Text>
        <Text style={styles.rowText}>{community.members} members</Text>
      </View>
    </TouchableOpacity>
  );
}
