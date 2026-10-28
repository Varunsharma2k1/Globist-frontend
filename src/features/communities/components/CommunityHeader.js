import React from 'react';
import { View, Text, Image, Pressable, Share, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Flame, Clock, Trophy } from 'lucide-react-native';
import JoinButton from './JoinButton';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';
import { compact } from '../utils/format';

const SORTS = [
  { key: 'hot', label: 'Hot', Icon: Flame },
  { key: 'new', label: 'New', Icon: Clock },
  { key: 'top', label: 'Top', Icon: Trophy },
];

/** Top of a community page: banner, name, stats, Join, about and the Hot / New / Top tabs. */
export default function CommunityHeader({
  community,
  joined,
  members,
  sort,
  onSort,
  onBack,
  onToggleJoin,
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View>
      <View>
        <Image source={community.cover} style={styles.banner} resizeMode="cover" />
        <View style={styles.bannerShade} />
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <Pressable style={styles.roundBtn} onPress={onBack} accessibilityLabel="Back">
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={styles.roundBtn}
            onPress={() =>
              Share.share({
                message: `Join c/${community.handle} on Triptape: ${community.tagline}`,
              })
            }
            accessibilityLabel="Share community"
          >
            <Share2 size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Image source={community.cover} style={styles.avatar} />
          <View style={styles.joinWrap}>
            <JoinButton joined={joined} onPress={onToggleJoin} />
          </View>
        </View>
        <Text style={styles.name}>{community.name}</Text>
        <Text style={styles.handle}>c/{community.handle}</Text>
        <Text style={styles.stats}>
          <Text style={styles.statsStrong}>{compact(members)}</Text> members ·{' '}
          <Text style={styles.statsStrong}>{community.online}</Text> online
        </Text>
        <Text style={styles.about}>{community.about}</Text>
      </View>

      <View style={styles.sortRow}>
        {SORTS.map(({ key, label, Icon }) => {
          const active = key === sort;
          return (
            <Pressable
              key={key}
              onPress={() => onSort(key)}
              style={[
                styles.sortChip,
                { backgroundColor: active ? colors.ink : colors.surfaceMuted },
              ]}
            >
              <Icon size={14} color={active ? colors.inkContrast : colors.text} />
              <Text style={[styles.sortText, { color: active ? colors.inkContrast : colors.text }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    banner: { width: '100%', height: 190, backgroundColor: colors.surfaceMuted },
    bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
    topBar: {
      position: 'absolute',
      left: SPACING.md,
      right: SPACING.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    roundBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(0,0,0,0.42)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      paddingHorizontal: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: -34,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 22,
      borderWidth: 3,
      borderColor: colors.background,
      backgroundColor: colors.surfaceMuted,
    },
    joinWrap: { paddingBottom: 4 },
    name: {
      fontFamily: FONTS.bold,
      fontSize: 22,
      lineHeight: 28,
      color: colors.ink,
      marginTop: SPACING.md,
    },
    handle: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, marginTop: 4 },
    stats: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: SPACING.md - 2,
    },
    statsStrong: { fontFamily: FONTS.semibold, color: colors.ink },
    about: {
      fontFamily: FONTS.body,
      fontSize: 14.5,
      lineHeight: 22,
      color: colors.text,
      marginTop: SPACING.md,
      opacity: 0.8,
    },
    sortRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg - 2,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    sortChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: SPACING.md,
      paddingVertical: 8,
      borderRadius: RADIUS.pill,
    },
    sortText: { fontFamily: FONTS.semibold, fontSize: 13 },
  });
}
