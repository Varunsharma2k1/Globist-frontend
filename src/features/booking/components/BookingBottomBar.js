import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

export default function BookingBottomBar({ totalPrice, loading, onConfirm }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { height: 84 + insets.bottom, paddingBottom: insets.bottom }]}>
      <View style={styles.bottomBarInner}>
        <View>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceVal}>₹{totalPrice.toLocaleString()}</Text>
        </View>
        <Button title="Confirm & Pay" onPress={onConfirm} loading={loading} style={{ width: 170 }} />
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 84,
      backgroundColor: colors.surface,
      borderTopWidth: 2,
      borderTopColor: colors.divider,
      paddingHorizontal: SPACING.lg,
    },
    bottomBarInner: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    priceLabel: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
    },
    priceVal: {
      fontFamily: FONTS.heading,
      fontSize: 20,
      color: colors.ink,
    },
  });
}
