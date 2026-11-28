import React from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { demoCompleteBooking } from '../../../api/trips';
import { CONFIG } from '../../../config';
import { Briefcase, Heart } from 'lucide-react-native';
import ExploreTripCard from '../../explore/components/ExploreTripCard';
import BookedTripCard from './BookedTripCard';
import TripRewardActions from './TripRewardActions';
import Button from '../../../components/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

const EMPTY = {
  booked: {
    Icon: Briefcase,
    title: 'No trips yet',
    sub: 'Book a trip from any tape or Explore. It shows up here with its invoice.',
    cta: 'Explore trips',
  },
  saved: {
    Icon: Heart,
    title: 'Nothing saved yet',
    sub: 'Tap ♡ on any trip to keep it here for later.',
    cta: 'Find trips',
  },
};

/**
 * Booked trips (with invoice + "post a tape" actions) or saved trips, used
 * by the profile's tabs and the full My Trips / Saved Trips screens.
 */
export default function ProfileTripsList({ kind, trips, loading, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { markTripCompleted } = useTripLedger();
  // Demo shortcut for showcasing; hidden in production builds (and the server refuses it there).
  const demoTools = CONFIG.APP_ENV !== 'production';

  const demoComplete = (booking) =>
    Alert.alert(
      'Mark trip as completed?',
      'Demo only: real trips complete by themselves the day after they end. This lets you post a tape for this trip now.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark completed',
          onPress: async () => {
            try {
              if (booking.backendId) await demoCompleteBooking(booking.backendId);
              markTripCompleted(booking._id);
            } catch (e) {
              Alert.alert(
                'Could not complete',
                e.response?.data?.message || 'Check your connection.'
              );
            }
          },
        },
      ]
    );

  if (loading) return <ActivityIndicator color={colors.ink} style={styles.loader} />;

  if (!trips.length) {
    const e = EMPTY[kind];
    return (
      <View style={styles.empty}>
        <e.Icon size={32} color={colors.textMuted} strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>{e.title}</Text>
        <Text style={styles.emptySub}>{e.sub}</Text>
        <Button
          title={e.cta}
          variant="outline"
          onPress={() => navigation.navigate('MainTabs', { screen: 'ExploreTab' })}
          style={styles.emptyBtn}
        />
      </View>
    );
  }

  if (kind === 'saved') {
    return (
      <View style={styles.list}>
        {trips.map((trip, index) => (
          <ExploreTripCard
            key={trip._id}
            trip={trip}
            index={index}
            onPress={() =>
              navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
            }
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {trips.map((booking) => (
        <BookedTripCard
          key={booking._id}
          booking={booking}
          onPress={() => navigation.navigate('Invoice', { booking })}
        >
          {booking.ledgerBooking ? (
            <TripRewardActions
              booking={booking.ledgerBooking}
              onDemoComplete={demoTools ? () => demoComplete(booking.ledgerBooking) : undefined}
              onPostReel={() =>
                navigation.navigate('PostReel', { bookingId: booking.ledgerBooking._id })
              }
            />
          ) : null}
        </BookedTripCard>
      ))}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    loader: { marginVertical: SPACING.xl },
    list: { gap: SPACING.md },
    empty: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.xs },
    emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: colors.ink, marginTop: SPACING.sm },
    emptySub: {
      fontFamily: FONTS.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      textAlign: 'center',
      maxWidth: 280,
    },
    emptyBtn: { marginTop: SPACING.md, paddingHorizontal: SPACING.xl },
  });
}
