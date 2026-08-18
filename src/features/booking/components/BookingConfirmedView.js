import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

export default function BookingConfirmedView({ trip, onBack, onGoHome }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header title="Confirm Booking" onBack={onBack} />
      <View style={[styles.confirmedBody, { paddingBottom: SPACING.xl + insets.bottom }]}>
        <View style={styles.confirmedIcon}>
          <CheckCircle2 size={40} color={colors.success} strokeWidth={1.5} />
        </View>
        <Text style={styles.confirmedTitle}>Booking Confirmed</Text>
        <Text style={styles.confirmedTrip}>{trip?.title || 'Spiti Expedition'}</Text>
        <Button
          title="Back to Home"
          onPress={onGoHome}
          style={{ marginTop: SPACING.xl, width: '100%', maxWidth: LAYOUT.contentMaxWidth }}
        />
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    confirmedBody: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xl,
    },
    confirmedIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.successBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    confirmedTitle: {
      fontFamily: FONTS.heading,
      fontSize: 22,
      color: colors.ink,
    },
    confirmedTrip: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      marginTop: SPACING.xs,
    },
  });
}
