import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, Smartphone, Store } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

const PAYMENT_METHODS = [
  { key: 'card', icon: CreditCard, label: 'Card' },
  { key: 'upi', icon: Smartphone, label: 'UPI' },
  { key: 'agency', icon: Store, label: 'Pay at Agency' },
];

export default function PaymentMethodPicker({ value, onChange }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.paymentRow}>
      {PAYMENT_METHODS.map((pm) => {
        const Icon = pm.icon;
        const active = value === pm.key;
        return (
          <TouchableOpacity
            key={pm.key}
            style={[styles.paymentCard, active && styles.paymentCardActive]}
            onPress={() => onChange(pm.key)}
          >
            <Icon size={20} color={active ? colors.inkContrast : colors.ink} strokeWidth={1.75} />
            <Text style={[styles.paymentText, active && styles.paymentTextActive]}>{pm.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    paymentRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    paymentCard: {
      flex: 1,
      paddingVertical: SPACING.md,
      backgroundColor: colors.surfaceMuted,
      borderRadius: RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
    },
    paymentCardActive: {
      backgroundColor: colors.ink,
    },
    paymentText: {
      fontFamily: FONTS.bold,
      fontSize: 11,
      color: colors.ink,
      textAlign: 'center',
    },
    paymentTextActive: {
      color: colors.inkContrast,
    },
  });
}
