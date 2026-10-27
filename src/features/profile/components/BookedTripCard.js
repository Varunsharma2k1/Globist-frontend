import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Calendar, Users, MapPin, ChevronRight } from 'lucide-react-native';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import RatingSummary from '../../../components/RatingSummary';
import { getCoverImage } from '../../../data/coverImages';
import { formatDate, STATUS_TAG } from '../../agency/utils/format';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * A booked trip in My Trips: where it is, how it's rated and what kind of
 * adventure it is. Tapping it opens the booking's invoice receipt — no
 * prices or booking actions here.
 */
export default function BookedTripCard({ booking, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { trip } = booking;
  const status = STATUS_TAG[booking.status];

  const adventure = [
    ...(trip?.agency?.categories || []).slice(0, 2),
    capitalize(trip?.difficulty),
    trip?.duration,
  ].filter(Boolean);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: getCoverImage(trip) }} style={styles.image} />
        <View style={styles.statusWrap}>
          <Tag label={status.label} variant={status.variant} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {booking.package.name}
          </Text>
          <RatingSummary rating={trip?.rating} reviewCount={trip?.agency?.reviewCount} />
        </View>

        {booking.package.region ? (
          <View style={styles.metaRow}>
            <MapPin size={13} color={colors.textMuted} />
            <Text style={styles.meta}>{booking.package.region}</Text>
          </View>
        ) : null}

        <View style={styles.tags}>
          {adventure.map((label) => (
            <Tag key={label} label={label} variant="primary" />
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Calendar size={13} color={colors.textMuted} />
            <Text style={styles.meta}>{formatDate(booking.travelDate)}</Text>
            <Users size={13} color={colors.textMuted} style={{ marginLeft: SPACING.md }} />
            <Text style={styles.meta}>
              {booking.travelers} traveller{booking.travelers > 1 ? 's' : ''}
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </View>
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: { padding: 0, overflow: 'hidden' },
    imageWrap: { height: 140, backgroundColor: colors.surfaceMuted },
    image: { width: '100%', height: '100%' },
    statusWrap: { position: 'absolute', top: SPACING.sm + 2, left: SPACING.sm + 2 },
    body: { padding: SPACING.md },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: SPACING.sm,
    },
    name: { flex: 1, fontFamily: FONTS.heading, fontSize: 17, color: colors.ink },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    meta: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted },
    tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.xs,
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
  });
}
