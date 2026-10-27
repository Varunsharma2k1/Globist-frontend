import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function PriceBreakdownCard({ travelers, pricePerPerson, occupancyLabel, subtotal, serviceFee, totalPrice }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Card style={styles.breakdownCard}>
      <Text style={styles.breakdownTitle}>Price Summary</Text>
      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>
          {travelers} traveller{travelers > 1 ? 's' : ''} × ₹{pricePerPerson.toLocaleString()}
          {occupancyLabel ? ` (${occupancyLabel.toLowerCase()})` : ''}
        </Text>
        <Text style={styles.breakdownVal}>₹{subtotal.toLocaleString()}</Text>
      </View>
      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Service Fee (3%)</Text>
        <Text style={styles.breakdownVal}>₹{serviceFee.toLocaleString()}</Text>
      </View>
      <View style={[styles.breakdownRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalVal}>₹{totalPrice.toLocaleString()}</Text>
      </View>
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    breakdownCard: {
      marginTop: SPACING.sm,
    },
    breakdownTitle: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
      marginBottom: SPACING.md,
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xs,
    },
    breakdownLabel: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    breakdownVal: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: SPACING.sm,
      marginTop: SPACING.sm,
    },
    totalLabel: {
      fontFamily: FONTS.heading,
      fontSize: 16,
      color: colors.ink,
    },
    totalVal: {
      fontFamily: FONTS.heading,
      fontSize: 18,
      color: colors.ink,
    },
  });
}
