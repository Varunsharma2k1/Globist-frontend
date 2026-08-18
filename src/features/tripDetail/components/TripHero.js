import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Mountain, Waves, Sun } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const CATEGORY_ICON = { desert: Sun, sun: Sun, beach: Waves, waves: Waves, mountain: Mountain };

export default function TripHero({ item }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const CategoryIcon = CATEGORY_ICON[item.icon] || Mountain;
  const pastelKey = item.icon === 'waves' ? 'beach' : item.icon === 'sun' ? 'desert' : 'mountain';
  const pastel = colors.pastel[pastelKey];

  return (
    <View style={styles.heroSection}>
      <View style={[styles.heroIconTile, { backgroundColor: pastel.bg }]}>
        <CategoryIcon size={36} color={pastel.fg} strokeWidth={1.5} />
      </View>
      <Text style={styles.heroTitle}>{item.title}</Text>
      <View style={styles.locationRow}>
        <MapPin size={13} color={colors.textMuted} />
        <Text style={styles.locationText}>{item.location || 'Himalayas'}</Text>
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    heroSection: {
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    heroIconTile: {
      width: 76,
      height: 76,
      borderRadius: RADIUS.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    heroTitle: {
      fontFamily: FONTS.heading,
      fontSize: 21,
      color: colors.ink,
      textAlign: 'center',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: SPACING.xs,
    },
    locationText: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
    },
  });
}
