import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Film, Users, Clock, Ticket } from 'lucide-react-native';
import Header from '../../../components/Header';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { SPACING, FONTS, LAYOUT } from '../../../theme';
import { formatDay } from '../../booking/utils/departures';
import { REEL_REWARD_CAP, REFERRAL_AFTER_COMPLETION } from '../utils/rewards';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

const TX_TITLES = {
  reel: (tx) => `Reel reward · ${tx.agencyName || 'agency'}`,
  referral: (tx) => `Referral · ${tx.fromName || 'a traveller'} completed their trip`,
  redeem: () => 'Used for a trip booking',
};

/**
 * Traveller wallet: balance, how rewards are earned, rewards still to come
 * (trips to post a reel for, referral bookings whose trip hasn't finished)
 * and the credit history.
 */
export default function WalletScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { wallet } = useTripLedger();
  const { balance, transactions, pendingReferrals, unclaimedReels } = wallet;
  const hasUpcoming = unclaimedReels.length || pendingReferrals.length;

  return (
    <View style={styles.container}>
      <Header title="Wallet" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <View style={styles.balanceCard}>
          <Wallet size={22} color={colors.inkContrast} />
          <Text style={styles.balanceLabel}>Wallet balance</Text>
          <Text style={styles.balance}>{inr(balance)}</Text>
        </View>

        <Card>
          <Text style={styles.cardTitle}>How you earn</Text>
          <View style={styles.rule}>
            <Film size={16} color={colors.pastel.peach.fg} />
            <Text style={styles.ruleText}>
              Post a reel tagging the agency after your trip: 2% of the booking, up to{' '}
              {inr(REEL_REWARD_CAP)}. One tagged reel per trip.
            </Text>
          </View>
          <View style={styles.rule}>
            <Users size={16} color={colors.pastel.peach.fg} />
            <Text style={styles.ruleText}>
              Someone books through your tagged reel: 0.5% of their booking
              {REFERRAL_AFTER_COMPLETION ? ' once they complete the trip' : ''}.
            </Text>
          </View>
          <View style={styles.rule}>
            <Ticket size={16} color={colors.pastel.peach.fg} />
            <Text style={styles.ruleText}>
              Spend it on your next booking: 1 point = ₹1 off the price.
            </Text>
          </View>
        </Card>

        {hasUpcoming ? (
          <>
            <Text style={[typography.h3, styles.sectionTitle]}>Coming up</Text>
            {unclaimedReels.map(({ booking, amount }) => (
              <Card key={`r-${booking._id}`}>
                <Text style={styles.itemTitle}>{booking.trip?.title}</Text>
                <Text style={styles.itemSub}>
                  Post a reel tagging {booking.agency?.name || 'the agency'} to earn {inr(amount)}
                </Text>
                <Button
                  title="Post reel"
                  onPress={() => navigation.navigate('PostReel', { bookingId: booking._id })}
                  style={styles.itemBtn}
                />
              </Card>
            ))}
            {pendingReferrals.map(({ booking, amount }) => (
              <Card key={`p-${booking._id}`} style={styles.row}>
                <Clock size={16} color={colors.textMuted} />
                <View style={styles.rowText}>
                  <Text style={styles.itemTitle}>{booking.userName} booked via your reel</Text>
                  <Text style={styles.itemSub}>
                    {booking.trip?.title} · credited after{' '}
                    {formatDay(booking.endDate, { weekday: false })}
                  </Text>
                </View>
                <Text style={styles.pending}>+{inr(amount)}</Text>
              </Card>
            ))}
          </>
        ) : null}

        <Text style={[typography.h3, styles.sectionTitle]}>History</Text>
        {transactions.length ? (
          transactions.map((tx) => (
            <Card key={tx._id} style={styles.row}>
              {tx.type === 'redeem' ? (
                <Ticket size={16} color={colors.textMuted} />
              ) : tx.type === 'reel' ? (
                <Film size={16} color={colors.success} />
              ) : (
                <Users size={16} color={colors.success} />
              )}
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>{TX_TITLES[tx.type](tx)}</Text>
                <Text style={styles.itemSub}>
                  {tx.tripTitle} · {formatDay(tx.createdAt, { weekday: false })}
                </Text>
              </View>
              {tx.amount < 0 ? (
                <Text style={styles.debit}>−{inr(-tx.amount)}</Text>
              ) : (
                <Text style={styles.credit}>+{inr(tx.amount)}</Text>
              )}
            </Card>
          ))
        ) : (
          <Text style={styles.empty}>
            No rewards yet. Book a trip, then post a reel tagging the agency once you&apos;re back.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    balanceCard: {
      backgroundColor: colors.ink,
      borderRadius: 20,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
    },
    balanceLabel: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.inkContrast,
      opacity: 0.75,
      marginTop: SPACING.sm,
    },
    balance: { fontFamily: FONTS.heading, fontSize: 34, color: colors.inkContrast, marginTop: 2 },
    cardTitle: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink, marginBottom: 6 },
    rule: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
    ruleText: { flex: 1, fontFamily: FONTS.body, fontSize: 13, color: colors.text },
    sectionTitle: { marginTop: SPACING.sm, marginBottom: SPACING.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    rowText: { flex: 1 },
    itemTitle: { fontFamily: FONTS.semibold, fontSize: 14, color: colors.ink },
    itemSub: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    itemBtn: { marginTop: SPACING.sm, paddingVertical: SPACING.sm + 2 },
    credit: { fontFamily: FONTS.heading, fontSize: 15, color: colors.success },
    debit: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink },
    pending: { fontFamily: FONTS.heading, fontSize: 15, color: colors.textMuted },
    empty: { fontFamily: FONTS.body, fontSize: 14, color: colors.textMuted },
  });
}
