import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Compass } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Empty trip list. `actions` is a list of { label, onPress } — the first is
 * rendered as the primary (filled) button.
 */
export default function ExploreEmptyState({
  title = 'Nothing here yet',
  subtitle = 'Try another category or a different search.',
  actions = [],
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconTile}>
        <Compass size={28} strokeWidth={1.5} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actions.map((action, i) => (
        <TouchableOpacity
          key={action.label}
          style={[styles.button, i === 0 && styles.buttonPrimary]}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, i === 0 && styles.buttonTextPrimary]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: SPACING.xl * 2,
      paddingHorizontal: SPACING.lg,
    },
    iconTile: {
      width: 64,
      height: 64,
      borderRadius: RADIUS.lg,
      backgroundColor: colors.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    title: {
      fontFamily: FONTS.bold,
      fontSize: 17,
      color: colors.ink,
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: SPACING.lg,
    },
    button: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm + 2,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: colors.divider,
      marginBottom: SPACING.sm,
    },
    buttonPrimary: {
      backgroundColor: colors.ink,
      borderColor: colors.ink,
    },
    buttonText: {
      fontFamily: FONTS.semibold,
      fontSize: 14,
      color: colors.ink,
    },
    buttonTextPrimary: {
      color: colors.inkContrast,
    },
  });
}
