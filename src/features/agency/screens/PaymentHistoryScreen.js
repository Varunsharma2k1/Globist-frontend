import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import Header from '../../../components/Header';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { getAgencyBookings } from '../../../data/agencyBookings';
import { formatDate, formatINR, STATUS_TAG } from '../utils/format';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

/**
 * Agency accounts only: everyone who has booked one of this agency's
 * packages, newest first. Tapping a booking opens its invoice.
 */
export default function PaymentHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  const bookings = getAgencyBookings();
  const received = bookings.filter((x) => x.status === 'paid').reduce((s, x) => s + x.total, 0);
  const pending = bookings.filter((x) => x.status === 'pending').reduce((s, x) => s + x.total, 0);

  return (
    <View style={styles.container}>
      <Header title="Payment History" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <View style={styles.summaryRow}>
          <Summary label="Received" value={formatINR(received)} styles={styles} />
          <Summary label="Pending" value={formatINR(pending)} styles={styles} />
          <Summary label="Bookings" value={String(bookings.length)} styles={styles} />
        </View>

        <Text style={[typography.h3, { marginBottom: SPACING.sm }]}>All bookings</Text>

        {bookings.map((x) => (
          <Card key={x._id} onPress={() => navigation.navigate('Invoice', { bookingId: x._id })}>
            <View style={styles.rowTop}>
              <Text style={styles.name}>{x.traveler.name}</Text>
              <Tag label={STATUS_TAG[x.status].label} variant={STATUS_TAG[x.status].variant} />
            </View>
            <Text style={styles.pkg} numberOfLines={1}>
              {x.package.name}
            </Text>
            <Text style={styles.meta}>
              {x.travelers} traveller{x.travelers > 1 ? 's' : ''} · Travel {formatDate(x.travelDate)}
            </Text>
            <View style={styles.rowBottom}>
              <Text style={styles.meta}>
                {x.invoiceNo} · {x.paymentMethod}
              </Text>
              <View style={styles.amountWrap}>
                <Text style={styles.amount}>{formatINR(x.total)}</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function Summary({ label, value, styles }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
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
    summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm + 2,
    },
    summaryValue: { fontFamily: FONTS.heading, fontSize: 17, color: colors.ink },
    summaryLabel: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontFamily: FONTS.heading, fontSize: 16, color: colors.ink, flex: 1 },
    pkg: { fontFamily: FONTS.semibold, fontSize: 13, color: colors.text, marginTop: 2 },
    meta: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
    rowBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    amountWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    amount: { fontFamily: FONTS.heading, fontSize: 16, color: colors.ink },
  });
}
