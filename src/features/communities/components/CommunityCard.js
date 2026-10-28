import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import JoinButton from './JoinButton';
import { useCommunities, useCommunityData } from '../../../hooks/useCommunities';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { compact } from '../utils/format';

/** A row in the discover list: cover thumbnail, name, tagline, stats, Join. */
export default function CommunityCard({ community, onPress }) {
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
      <Image source={community.cover} style={styles.thumb} resizeMode="cover" />
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={2}>
          {community.name}
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {community.tagline}
        </Text>
        <Text style={styles.stats}>
          {compact(memberCount(community))} members · {community.online} online
        </Text>
      </View>
      <JoinButton
        compact
        joined={isJoined(community.id)}
        onPress={() => toggleJoin(community.id)}
      />
    </Pressable>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.sm + 2,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    thumb: { width: 72, height: 72, borderRadius: RADIUS.sm, backgroundColor: colors.surfaceMuted },
    main: { flex: 1 },
    name: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink },
    tagline: {
      fontFamily: FONTS.body,
      fontSize: 12,
      lineHeight: 16,
      color: colors.textMuted,
      marginTop: 2,
    },
    stats: { fontFamily: FONTS.semibold, fontSize: 11, color: colors.textMuted, marginTop: 5 },
  });
}
