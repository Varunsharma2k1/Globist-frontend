import React, { useMemo, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, LAYOUT } from '../../../theme';
import { useAgencyProfile } from '../hooks/useAgencyProfile';
import { splitTrips } from '../utils/agencyProfile';
import AgencyHero from '../components/AgencyHero';
import AgencyAbout from '../components/AgencyAbout';
import AgencyTrips from '../components/AgencyTrips';
import AgencyComments from '../components/AgencyComments';
import AgencyEditModal from '../components/AgencyEditModal';

/**
 * Public profile of a travel agency: photo header, verified status, rating,
 * short note, upcoming / organised trips and visitor comments. Agencies get an
 * Edit button to update their own details. Data lives in useAgencyProfile.
 */
export default function AgencyProfileScreen({ route, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { agency: routeAgency } = route.params || {};
  const base = useMemo(() => routeAgency || {}, [routeAgency]);
  const { agency, trips, loading, comments, canEdit, saveProfile, addComment } =
    useAgencyProfile(base);
  const [editing, setEditing] = useState(false);
  const { upcoming, others } = useMemo(() => splitTrips(trips), [trips]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: SPACING.xl + insets.bottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AgencyHero
          agency={agency}
          imageType={trips[0]?.imageType}
          onBack={() => navigation.goBack()}
          onEdit={canEdit ? () => setEditing(true) : undefined}
        />
        <View style={styles.content}>
          <AgencyAbout agency={agency} />
          {loading ? (
            <ActivityIndicator color={colors.ink} style={styles.loader} />
          ) : (
            <AgencyTrips
              upcoming={upcoming}
              others={others}
              onOpenTrip={(trip) =>
                navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
              }
            />
          )}
          <AgencyComments comments={comments} onPost={addComment} />
        </View>
      </ScrollView>

      <AgencyEditModal
        visible={editing}
        agency={agency}
        onSave={saveProfile}
        onClose={() => setEditing(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  loader: { marginVertical: SPACING.lg },
});
