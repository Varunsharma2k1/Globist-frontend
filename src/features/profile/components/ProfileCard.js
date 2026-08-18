import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { TIER_EMOJI } from '../data/menuItems';

export default function ProfileCard({ user }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const initial = (user?.name || 'E').charAt(0).toUpperCase();
  const tier = user?.explorerTier || 'Gold';
  const tierEmoji = TIER_EMOJI[tier.toLowerCase()] || '🏆';

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarCircle}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarInitial}>{initial}</Text>
        )}
      </View>
      <Text style={styles.name}>{user?.name || 'Explorer User'}</Text>
      <View style={styles.tagRow}>
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>
            {tierEmoji} {tier.toUpperCase()} EXPLORER
          </Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{(user?.role || 'traveller').toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    profileCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      shadowColor: colors.ink,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.pastel.peach.bg,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: SPACING.sm,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarInitial: {
      fontFamily: FONTS.heading,
      fontSize: 32,
      color: colors.pastel.peach.fg,
    },
    name: {
      fontFamily: FONTS.heading,
      fontSize: 22,
      color: colors.ink,
    },
    tagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.sm + 2,
    },
    tierBadge: {
      backgroundColor: colors.pastel.peach.bg,
      paddingHorizontal: SPACING.sm + 4,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.pill,
    },
    tierBadgeText: {
      fontFamily: FONTS.heading,
      fontSize: 13,
      color: colors.pastel.peach.fg,
      letterSpacing: 0.3,
    },
    roleBadge: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: SPACING.sm + 4,
      paddingVertical: SPACING.xs + 2,
      borderRadius: RADIUS.pill,
    },
    roleBadgeText: {
      fontFamily: FONTS.heading,
      fontSize: 13,
      color: colors.text,
      letterSpacing: 0.3,
    },
  });
}
