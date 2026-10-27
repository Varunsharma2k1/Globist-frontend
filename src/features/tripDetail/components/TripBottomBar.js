import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

export default function TripBottomBar({ price, priceNote, onBookPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { height: 84 + insets.bottom, paddingBottom: insets.bottom }]}>
      <View style={styles.bottomBarInner}>
        <View>
          {Number.isFinite(price) ? (
            <Text style={styles.priceVal}>
              ₹{price.toLocaleString()}
              <Text style={styles.priceUnit}> / person</Text>
            </Text>
          ) : null}
          {priceNote ? <Text style={styles.priceLabel}>{priceNote}</Text> : null}
        </View>
        <Button title="Book now" onPress={onBookPress} style={{ width: 150 }} />
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
      borderTopWidth: StyleSheet.hairlineWidth,
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
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    priceVal: {
      fontFamily: FONTS.heading,
      fontSize: 20,
      color: colors.ink,
    },
    priceUnit: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
  });
}
