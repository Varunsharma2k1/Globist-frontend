import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import JoinButton from './JoinButton';
import { useCommunities, useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { compact } from '../utils/format';

export const MINI_CARD_WIDTH = 210;

/** Compact community card for the Home row: photo, name, members, Join. */
export default function CommunityMiniCard({ community, onPress }) {
  const { colors } = useTheme();
  const { toggleJoin } = useCommunities();
  const { isJoined, memberCount } = useCommunityData();
  const styles = getStyles(colors);

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={community.name}
    >
      <Image source={community.cover} style={styles.cover} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {community.name}
        </Text>
        <View style={styles.members}>
          <Users size={13} color={colors.textMuted} />
          <Text style={styles.membersText}>{compact(memberCount(community))} members</Text>
        </View>
        <View style={styles.join}>
          <JoinButton
            compact
            joined={isJoined(community.id)}
            onPress={() => toggleJoin(community.id)}
          />
        </View>
      </View>
    </Pressable>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      width: MINI_CARD_WIDTH,
      marginRight: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    cover: { width: '100%', height: 112, backgroundColor: colors.surfaceMuted },
    body: { padding: SPACING.md - 2 },
    name: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      lineHeight: 19,
      color: colors.ink,
      minHeight: 38,
    },
    members: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
    membersText: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
    join: { marginTop: SPACING.sm + 2, alignItems: 'flex-start' },
  });
}
