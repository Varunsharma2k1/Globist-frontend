import React from 'react';
import { View, Text, Image, Pressable, Share, StyleSheet } from 'react-native';
import { ArrowLeft, Share2, Flame, Clock, Trophy } from 'lucide-react-native';
import JoinButton from './JoinButton';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';
import { compact } from '../utils/format';
import haptics from '../../../utils/haptics';
import { useTopInset } from '../../../hooks/useTopInset';

const SORTS = [
  { key: 'hot', label: 'Hot', Icon: Flame, hint: 'Popular right now' },
  { key: 'new', label: 'New', Icon: Clock, hint: 'Newest first' },
  { key: 'top', label: 'Top', Icon: Trophy, hint: 'Most upvoted of all time' },
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
  const topInset = useTopInset();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View>
      <View>
        <Image source={community.cover} style={styles.banner} resizeMode="cover" />
        <View style={styles.bannerShade} />
        <View style={[styles.topBar, { top: topInset + 8 }]}>
          <Pressable style={styles.roundBtn} onPress={onBack} accessibilityLabel="Back">
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={styles.roundBtn}
            onPress={() =>
              Share.share({
                message: `Join c/${community.handle} on TripTape: ${community.tagline}`,
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
        <Text style={styles.stats}>
          c/{community.handle} · <Text style={styles.statsStrong}>{compact(members)}</Text> members
          · <Text style={styles.statsStrong}>{community.online}</Text> online
        </Text>
        <Text style={styles.about} numberOfLines={3}>
          {community.about}
        </Text>
      </View>

      {/* iOS-style segmented control; the hint says what the order means. */}
      <View style={styles.sortWrap}>
        <View style={styles.segment} accessibilityRole="tablist">
          {SORTS.map(({ key, label, Icon }) => {
            const active = key === sort;
            return (
              <Pressable
                key={key}
                onPress={() => {
                  if (!active) haptics.select();
                  onSort(key);
                }}
                style={[styles.segmentItem, active && styles.segmentActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Icon size={14} color={active ? colors.ink : colors.textMuted} />
                <Text style={[styles.sortText, { color: active ? colors.ink : colors.textMuted }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.sortHint}>{SORTS.find((x) => x.key === sort)?.hint}</Text>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    banner: { width: '100%', height: 170, backgroundColor: colors.surfaceMuted },
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
      marginTop: -32,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 18,
      borderWidth: 3,
      borderColor: colors.background,
      backgroundColor: colors.surfaceMuted,
    },
    joinWrap: { paddingBottom: 4 },
    name: {
      fontFamily: FONTS.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5,
      color: colors.ink,
      marginTop: SPACING.md,
    },
    stats: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
    statsStrong: { fontFamily: FONTS.semibold, color: colors.text },
    about: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginTop: SPACING.md,
    },
    sortWrap: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.sm,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    segment: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
    },
    segmentItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.pill,
    },
    segmentActive: {
      backgroundColor: colors.surface,
      shadowColor: '#17271E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 1,
    },
    sortText: { fontFamily: FONTS.semibold, fontSize: 14 },
    sortHint: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: SPACING.sm,
      textAlign: 'center',
    },
  });
}
