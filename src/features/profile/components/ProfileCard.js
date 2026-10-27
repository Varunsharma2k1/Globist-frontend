import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Medal } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

// Explorer tier → medal colour.
const TIER_COLOR = { bronze: '#CD7F32', silver: '#A8A9AD', gold: '#E0A800', elite: '#7C5CFF' };

// Account type → label shown on the profile (stored values stay 'traveler' etc.).
const ROLE_LABEL = { traveler: 'Traveller', creator: 'Creator', agency: 'Agency' };

export default function ProfileCard({ user }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const tier = (user?.explorerTier || 'bronze').toLowerCase();
  const initial = (user?.name || 'E').charAt(0).toUpperCase();

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
      {user?.role !== 'agency' && (
        <View style={styles.tagRow}>
          <View style={styles.tierIcon} accessibilityLabel={`${tier} explorer`}>
            <Medal size={18} color={TIER_COLOR[tier] || TIER_COLOR.bronze} strokeWidth={2.2} />
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {(ROLE_LABEL[user?.role] || 'Traveller').toUpperCase()}
            </Text>
          </View>
        </View>
      )}
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
    tierIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
