import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import ExploreTripCard from '../../explore/components/ExploreTripCard';
import BookedTripCard from '../components/BookedTripCard';
import TripRewardActions from '../components/TripRewardActions';
import { useProfileTrips } from '../hooks/useProfileTrips';
import { useTheme } from '../../../hooks/useTheme';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { SPACING, LAYOUT } from '../../../theme';

const COPY = {
  booked: { title: 'My Trips', subtitle: 'Tap a trip to see its invoice' },
  saved: { title: 'Saved Trips', subtitle: 'Trips you have saved for later' },
};

/**
 * Lists the actual trips behind a profile row. `kind` comes from the route
 * params: 'booked' (My Trips) or 'saved' (Saved Trips).
 */
export default function ProfileTripsScreen({ navigation, route }) {
  const kind = route.params?.kind === 'saved' ? 'saved' : 'booked';
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { trips, loading } = useProfileTrips(kind);
  const { markTripCompleted } = useTripLedger();
  const openTrip = (trip) =>
    navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title });

  // Real trips complete on their own once the return date passes; this lets
  // the reel-reward flow be tried without waiting for the trip.
  const confirmCompleted = (booking) =>
    Alert.alert(
      'Mark trip as completed?',
      'Demo only: trips complete automatically after their return date. This unlocks posting a reel for this trip.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark completed', onPress: () => markTripCompleted(booking._id) },
      ]
    );

  return (
    <View style={styles.container}>
      <Header title={COPY[kind].title} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
        >
          <Text style={[typography.body, { marginBottom: SPACING.md }]}>
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} ·{' '}
            {COPY[kind].subtitle.toLowerCase()}
          </Text>
          {kind === 'booked'
            ? trips.map((booking) => (
                <BookedTripCard
                  key={booking._id}
                  booking={booking}
                  onPress={() => navigation.navigate('Invoice', { booking })}
                >
                  {booking.ledgerBooking ? (
                    <TripRewardActions
                      booking={booking.ledgerBooking}
                      onMarkCompleted={() => confirmCompleted(booking.ledgerBooking)}
                      onPostReel={() =>
                        navigation.navigate('PostReel', { bookingId: booking.ledgerBooking._id })
                      }
                    />
                  ) : null}
                </BookedTripCard>
              ))
            : trips.map((trip, index) => (
                <ExploreTripCard
                  key={trip._id}
                  trip={trip}
                  index={index}
                  onPress={() => openTrip(trip)}
                />
              ))}
        </ScrollView>
      )}
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
  });
}
