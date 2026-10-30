import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wallet } from 'lucide-react-native';
import Card from '../../../components/Card';
import SettingsToggle from '../../../components/SettingsToggle';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/**
 * "Use wallet balance" switch on the booking page. Wallet points (earned
 * from reels and referrals) are worth ₹1 each and come off the total.
 */
export default function WalletRedeemCard({ balance, enabled, onToggle, applied }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const empty = balance <= 0;

  return (
    <Card style={[styles.card, empty && styles.cardEmpty]}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <Wallet size={18} color={colors.pastel.peach.fg} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>Use wallet balance</Text>
          <Text style={styles.sub}>
            {empty
              ? 'No points yet. Post reels after your trips to earn.'
              : `${balance.toLocaleString('en-IN')} points available · 1 point = ₹1`}
          </Text>
        </View>
        {!empty ? <SettingsToggle value={enabled} onValueChange={onToggle} /> : null}
      </View>
      {enabled && applied > 0 ? (
        <Text style={styles.applied}>{inr(applied)} off this booking</Text>
      ) : null}
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: { marginBottom: SPACING.md },
    cardEmpty: { opacity: 0.7 },
    row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    icon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.pastel.peach.bg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: { flex: 1 },
    title: { fontFamily: FONTS.bold, fontSize: 14, color: colors.ink },
    sub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    applied: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.success,
      marginTop: SPACING.sm,
    },
  });
}
