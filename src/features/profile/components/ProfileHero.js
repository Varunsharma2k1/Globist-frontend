import React from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Briefcase, Clapperboard, Camera } from 'lucide-react-native';
import { absoluteMediaUrl } from '../../../utils/mediaUrl';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Soft green greeting card: avatar, "Hi, <first name> 👋", the user's bio
 * (or a default line) and two white stat cards with real counts.
 */
export default function ProfileHero({
  user,
  trips,
  tapes,
  onPressTrips,
  onPressTapes,
  onPressAvatar,
  avatarUploading,
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
            Hi, {first} 👋
          </Text>
          <Text style={styles.tagline} numberOfLines={2}>
            {user?.bio || 'Travel more, scroll less.'}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <StatCard
          Icon={Briefcase}
          value={trips}
          label={trips === 1 ? 'Trip' : 'Trips'}
          onPress={onPressTrips}
          styles={styles}
          colors={colors}
        />
        <StatCard
          Icon={Clapperboard}
          value={tapes}
          label={tapes === 1 ? 'Tape' : 'Tapes'}
          onPress={onPressTapes}
          styles={styles}
          colors={colors}
        />
      </View>
    </View>
  );
}

function StatCard({ Icon, value, label, onPress, styles, colors }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.stat}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
    >
      <View style={styles.statIcon}>
        <Icon size={18} color={colors.pastel.mountain.fg} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

function getStyles(colors) {
  const dark = colors.mode === 'dark';
  return StyleSheet.create({
    card: {
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      backgroundColor: dark ? colors.surfaceMuted : colors.pastel.mountain.bg,
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.xs },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: colors.surface,
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
      borderColor: dark ? colors.surfaceMuted : colors.pastel.mountain.bg,
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
    stats: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
    stat: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm + 4,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.sm + 4,
      paddingHorizontal: SPACING.md,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: dark ? colors.surfaceMuted : colors.pastel.mountain.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
    statLabel: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
  });
}
