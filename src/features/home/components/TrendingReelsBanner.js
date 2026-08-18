import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Film } from 'lucide-react-native';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function TrendingReelsBanner({ onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Card style={styles.bannerCard} onPress={onPress}>
      <View style={styles.bannerBadge}>
        <Film size={12} color={colors.pastel.peach.fg} />
        <Text style={styles.bannerBadgeText}>TRENDING REELS</Text>
      </View>
      <Text style={styles.bannerTitle}>Explore Destinations via Reels</Text>
      <Text style={styles.bannerDesc}>
        Watch short vertical clips posted by verified creators & agencies.
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.bannerAction}>Watch Reels Now →</Text>
      </TouchableOpacity>
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    bannerCard: {
      backgroundColor: colors.pastel.peach.bg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderRadius: RADIUS.lg,
    },
    bannerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.6)',
      alignSelf: 'flex-start',
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
      marginBottom: SPACING.sm,
    },
    bannerBadgeText: {
      fontFamily: FONTS.heading,
      fontSize: 10,
      color: colors.pastel.peach.fg,
      letterSpacing: 0.5,
    },
    bannerTitle: {
      fontFamily: FONTS.heading,
      fontSize: 19,
      color: colors.pastel.peach.fg,
      marginBottom: 4,
    },
    bannerDesc: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.pastel.peach.fg,
      marginBottom: SPACING.md,
    },
    bannerAction: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.pastel.peach.fg,
    },
  });
}
