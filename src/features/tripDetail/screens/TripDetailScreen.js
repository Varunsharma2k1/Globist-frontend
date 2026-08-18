import React from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useTripDetail } from '../hooks/useTripDetail';
import TripHero from '../components/TripHero';
import TripMetaCard from '../components/TripMetaCard';
import TripInclusionsList from '../components/TripInclusionsList';
import TripBottomBar from '../components/TripBottomBar';

/**
 * TripDetailScreen Component
 *
 * Displays itinerary, inclusions, agency verification badge, and booking
 * action bar for a specific package. Data fetching lives in useTripDetail;
 * each visual section is its own component (see ../components) — this file
 * is just the layout.
 */
export default function TripDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { tripId } = route.params || {};
  const { trip: item, loading } = useTripDetail(tripId);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Trip Itinerary" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={item.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}>
        <TripHero item={item} />
        <TripMetaCard item={item} />
        <TripInclusionsList description={item.description} inclusions={item.inclusions} />
      </ScrollView>

      <TripBottomBar
        price={item.price}
        onBookPress={() => navigation.navigate('Booking', { trip: item })}
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
      paddingBottom: 100,
      width: '100%',
      maxWidth: LAYOUT.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
