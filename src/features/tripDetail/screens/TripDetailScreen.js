import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { OCCUPANCY_LABELS, defaultOccupancy, priceForOccupancy } from '../../../data/occupancy';
import { useTripDetail } from '../hooks/useTripDetail';
import TripDetailHero from '../components/TripDetailHero';
import TripOverview from '../components/TripOverview';
import TripOccupancyPicker from '../components/TripOccupancyPicker';
import TripItinerary from '../components/TripItinerary';
import TripInclusionsList from '../components/TripInclusionsList';
import TripBottomBar from '../components/TripBottomBar';

/**
 * TripDetailScreen Component
 *
 * Cover photo, overview (agency with verified tick + rating), room-sharing
 * picker, day-wise itinerary, inclusions/exclusions, and a booking bar
 * priced for the selected room sharing. Data fetching lives in
 * useTripDetail; each visual section is its own component (see
 * ../components) — this file is just the layout.
 */
export default function TripDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  // `referral` is only present when the user arrived from a reel's Book
  // button; it's passed through untouched so Booking can attribute it.
  const { tripId, referral } = route.params || {};
  const { trip: item, loading } = useTripDetail(tripId);
  const [pickedOccupancy, setPickedOccupancy] = useState(null);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Trip Itinerary" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      </View>
    );
  }

  const occupancy = pickedOccupancy || defaultOccupancy(item);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <TripDetailHero trip={item} onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <TripOverview
            trip={item}
            onAgencyPress={(agency) => navigation.navigate('AgencyProfile', { agency })}
          />
          <TripOccupancyPicker
            options={item.occupancyPricing}
            value={occupancy}
            onChange={setPickedOccupancy}
          />
          <TripInclusionsList description={item.description} highlights={item.highlights} />
          <TripItinerary itinerary={item.itinerary} />
          <TripInclusionsList inclusions={item.inclusions} exclusions={item.exclusions} />
        </View>
      </ScrollView>

      <TripBottomBar
        price={priceForOccupancy(item, occupancy)}
        priceNote={occupancy ? OCCUPANCY_LABELS[occupancy] : null}
        onBookPress={() => navigation.navigate('Booking', { trip: item, referral, occupancy })}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: SPACING.lg,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
