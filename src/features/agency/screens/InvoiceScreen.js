import React from 'react';
import { View, Text, ScrollView, Share, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Tag from '../../../components/Tag';
import { getAgencyBooking, GST_RATE } from '../../../data/agencyBookings';
import { OCCUPANCY_LABELS } from '../../../data/occupancy';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { formatDate, formatINR, STATUS_TAG } from '../utils/format';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../../../theme';

/** Tax invoice + booking details for one booking on an agency's package. */
export default function InvoiceScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(colors);

  // Agencies open a booking by id; travellers pass the booking they built.
  const booking = route.params?.booking || getAgencyBooking(route.params?.bookingId);
  if (!booking) {
    return (
      <View style={styles.container}>
        <Header title="Invoice" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const { traveler, package: pkg } = booking;
  const agencyName = booking.agencyName || user?.name || 'Your Agency';
  const status = STATUS_TAG[booking.status];

  const share = () =>
    Share.share({
      title: `Invoice ${booking.invoiceNo}`,
      message: [
        `Triptape Tax Invoice ${booking.invoiceNo}`,
        `Sold by: ${agencyName}`,
        `Billed to: ${traveler.name}${traveler.email ? ` (${traveler.email})` : ''}`,
        `${pkg.name} — ${booking.travelers} traveller(s), ${OCCUPANCY_LABELS[booking.occupancy]}`,
        `Travel date: ${formatDate(booking.travelDate)}`,
        `Subtotal ${formatINR(booking.subtotal)} + GST ${formatINR(booking.gst)} = ${formatINR(booking.total)}`,
        `Payment: ${status.label} via ${booking.paymentMethod}`,
      ].join('\n'),
    });

  return (
    <View style={styles.container}>
      <Header title="Invoice" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.brand}>TRIPTAPE</Text>
              <Text style={styles.docTitle}>Tax Invoice</Text>
            </View>
            <Tag label={status.label} variant={status.variant} />
          </View>

          <Row label="Invoice no." value={booking.invoiceNo} styles={styles} />
          <Row label="Booking ID" value={booking._id} styles={styles} />
          <Row label="Booked on" value={formatDate(booking.bookedOn)} styles={styles} />

          <Divider styles={styles} />

          <Text style={styles.sectionLabel}>BILLED TO</Text>
          <Text style={styles.strong}>{traveler.name}</Text>
          {[traveler.email, traveler.phone, traveler.city].filter(Boolean).map((line) => (
            <Text key={line} style={styles.muted}>
              {line}
            </Text>
          ))}

          <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>SOLD BY</Text>
          <Text style={styles.strong}>{agencyName}</Text>

          <Divider styles={styles} />

          <Text style={styles.sectionLabel}>PACKAGE</Text>
          <Text style={styles.strong}>{pkg.name}</Text>
          <Text style={styles.muted}>
            {[pkg.region, pkg.duration ? `${pkg.duration} days` : null].filter(Boolean).join(' · ')}
          </Text>
          <Row label="Travel date" value={formatDate(booking.travelDate)} styles={styles} />
          <Row label="Travellers" value={String(booking.travelers)} styles={styles} />
          <Row label="Room sharing" value={OCCUPANCY_LABELS[booking.occupancy]} styles={styles} />

          <Divider styles={styles} />

          <Row
            label={`${formatINR(booking.ratePerPerson)} × ${booking.travelers}`}
            value={formatINR(booking.subtotal)}
            styles={styles}
          />
          <Row label={`GST (${GST_RATE * 100}%)`} value={formatINR(booking.gst)} styles={styles} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatINR(booking.total)}</Text>
          </View>

          <Divider styles={styles} />

          <Row label="Payment method" value={booking.paymentMethod} styles={styles} />
          <Row label="Payment status" value={status.label} styles={styles} />
        </View>

        <Button title="Share Invoice" onPress={share} style={{ marginTop: SPACING.md }} />
      </ScrollView>
    </View>
  );
}

function Row({ label, value, styles }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const Divider = ({ styles }) => <View style={styles.divider} />;

function getStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    brand: { fontFamily: FONTS.heading, fontSize: 20, letterSpacing: 1, color: colors.ink },
    docTitle: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: SPACING.md },
    sectionLabel: {
      fontFamily: FONTS.bold,
      fontSize: 11,
      letterSpacing: 0.8,
      color: colors.textMuted,
      marginBottom: SPACING.xs,
    },
    strong: { fontFamily: FONTS.heading, fontSize: 15, color: colors.ink },
    muted: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      gap: SPACING.md,
    },
    rowLabel: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted },
    rowValue: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.ink,
      flexShrink: 1,
      textAlign: 'right',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.sm,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    totalLabel: { fontFamily: FONTS.heading, fontSize: 16, color: colors.ink },
    totalValue: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
  });
}
