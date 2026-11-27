import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import ProfileTripsList from '../components/ProfileTripsList';
import { useProfileTrips } from '../hooks/useProfileTrips';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';

const COPY = {
  booked: { title: 'My Trips', subtitle: 'Tap a trip to see its invoice' },
  saved: { title: 'Saved Trips', subtitle: 'Trips you have saved for later' },
};

/** Full-screen My Trips / Saved Trips (route param `kind`). */
export default function ProfileTripsScreen({ navigation, route }) {
  const kind = route.params?.kind === 'saved' ? 'saved' : 'booked';
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const { trips, loading } = useProfileTrips(kind);

  return (
    <View style={styles.container}>
      <Header title={COPY[kind].title} onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}
      >
        {trips.length ? (
          <Text style={[typography.body, { marginBottom: SPACING.md }]}>
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} ·{' '}
            {COPY[kind].subtitle.toLowerCase()}
          </Text>
        ) : null}
        <ProfileTripsList kind={kind} trips={trips} loading={loading} navigation={navigation} />
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
  });
}
