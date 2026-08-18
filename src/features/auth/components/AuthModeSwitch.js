import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function AuthModeSwitch({ isLogin, onToggle }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.switchContainer} onPress={onToggle}>
      <Text style={styles.switchText}>
        {isLogin ? "Don't have an account? " : 'Already registered? '}
        <Text style={styles.switchHighlight}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
      </Text>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    switchContainer: {
      marginTop: SPACING.xl,
      alignItems: 'center',
    },
    switchText: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
    },
    switchHighlight: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.ink,
    },
  });
}
