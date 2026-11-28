import React from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { absoluteMediaUrl } from '../../../utils/mediaUrl';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Greeting card (neutral, iOS grouped style): avatar, "Hi, <first name> 👋",
 * bio, and four real counts: Trips · Tapes · Followers · Following.
 */
export default function ProfileHero({
  user,
  trips,
  tapes,
  followers,
  following,
  onPressTrips,
  onPressTapes,
  onPressFollowers,
  onPressFollowing,
  onPressAvatar,
  avatarUploading,
  title, // overrides "Hi, <first> 👋" (e.g. someone else's name)
  tagline,
  items, // overrides the four stats: [{ label, value, onPress }]
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const first = (user?.name || 'Traveller').split(' ')[0];
  const initial = first.charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Pressable
          onPress={onPressAvatar}
          disabled={!onPressAvatar}
          style={styles.avatarWrap}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          <View style={styles.avatar}>
            {user?.avatar ? (
              <Image
                source={{ uri: absoluteMediaUrl(user.avatar) }}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <Text style={styles.initial}>{initial}</Text>
            )}
            {avatarUploading ? (
              <View style={styles.uploading}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
          {onPressAvatar ? (
            <View style={styles.cameraBadge}>
              <Camera size={13} color={colors.inkContrast} strokeWidth={2.4} />
            </View>
          ) : null}
        </Pressable>
        <View style={styles.greeting}>
          <Text style={styles.hi} numberOfLines={1}>
            {title || `Hi, ${first} 👋`}
          </Text>
          <Text style={styles.tagline} numberOfLines={2}>
            {tagline ?? (user?.bio || 'Travel more, scroll less.')}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        {(
          items || [
            { label: 'Trips', value: trips, onPress: onPressTrips },
            { label: 'Tapes', value: tapes, onPress: onPressTapes },
            { label: 'Followers', value: followers, onPress: onPressFollowers },
            { label: 'Following', value: following, onPress: onPressFollowing },
          ]
        ).map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={[styles.stat, i > 0 && styles.statDivider]}
            accessibilityRole="button"
            accessibilityLabel={`${item.value ?? 0} ${item.label}`}
          >
            <Text style={styles.statValue}>{item.value ?? '–'}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function getStyles(colors) {
  const dark = colors.mode === 'dark';
  // iOS layering. Light: grey card, white parts inside. Dark: black page ->
  // card one step up (#1C1C1E) -> parts inside one more step (#2C2C2E), so
  // each layer is lighter than the one under it.
  const cardBg = dark ? colors.surface : colors.surfaceMuted;
  const innerBg = dark ? colors.surfaceMuted : colors.surface;
  return StyleSheet.create({
    card: {
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      backgroundColor: cardBg,
      ...(dark ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.divider } : null),
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.xs },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: innerBg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    initial: { fontFamily: FONTS.heading, fontSize: 28, color: colors.ink },
    avatarWrap: { width: 76, height: 76 },
    uploading: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.ink,
      borderWidth: 2,
      borderColor: cardBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    greeting: { flex: 1 },
    hi: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
    tagline: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginTop: 2,
    },
    stats: {
      flexDirection: 'row',
      backgroundColor: innerBg,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.sm + 4,
      marginTop: SPACING.md,
    },
    stat: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
    statDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.divider },
    statValue: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
    statLabel: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  });
}
