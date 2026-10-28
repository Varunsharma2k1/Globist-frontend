import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { getSharedInboxRowStyles } from './sharedInboxRowStyles';
import { compact } from '../../communities/utils/format';

/** A joined community in the Inbox; opens its page. */
export default function CommunityRow({ community, onPress }) {
  const { colors } = useTheme();
  const { memberCount } = useCommunityData();
  const styles = getSharedInboxRowStyles(colors);

  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <Image
        source={community.cover}
        style={[local.cover, { backgroundColor: colors.surfaceMuted }]}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.chatName}>{community.name}</Text>
        <Text style={styles.rowText}>{compact(memberCount(community))} members</Text>
      </View>
    </TouchableOpacity>
  );
}

const local = StyleSheet.create({ cover: { width: 44, height: 44, borderRadius: 14 } });
