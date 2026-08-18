import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function GoogleSignInButton({ loading, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={styles.googleBtn}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View style={styles.googleBadge}>
        <Text style={styles.googleBadgeText}>G</Text>
      </View>
      <Text style={styles.googleBtnText}>{loading ? 'Signing in…' : 'Continue with Google'}</Text>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      borderWidth: 1.5,
      borderColor: colors.divider,
      borderRadius: RADIUS.pill,
      paddingVertical: SPACING.sm + 4,
      marginBottom: SPACING.lg,
    },
    googleBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#4285F4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleBadgeText: {
      fontFamily: FONTS.heading,
      fontSize: 12,
      color: '#FFFFFF',
    },
    googleBtnText: {
      fontFamily: FONTS.semibold,
      fontSize: 14,
      color: colors.ink,
    },
  });
}
