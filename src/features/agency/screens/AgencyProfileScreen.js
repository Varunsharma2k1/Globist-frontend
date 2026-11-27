import React, { useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import Button from '../../../components/Button';
import KeyboardAwareScrollView from '../../../components/KeyboardAwareScrollView';
import { useAuth } from '../../../hooks/useAuth';
import { SPACING, LAYOUT } from '../../../theme';
import { useAgencyProfile } from '../hooks/useAgencyProfile';
import { useAgencyReels } from '../hooks/useAgencyReels';
import { splitTrips } from '../utils/agencyProfile';
import AgencyHero from '../components/AgencyHero';
import AgencyAbout from '../components/AgencyAbout';
import AgencyTrips from '../components/AgencyTrips';
import AgencyTabs from '../components/AgencyTabs';
import AgencyTapesGrid from '../components/AgencyTapesGrid';
import AgencyComments from '../components/AgencyComments';
import AgencyEditModal from '../components/AgencyEditModal';

/**
 * Public profile of a travel agency: photo header, verified status, rating,
 * short note and a Message button, then Instagram-style tabs: Trips
 * (upcoming + organised), Tapes (grid of traveller tapes from verified
 * bookings) and Reviews (visitor comments). Agencies get an
 * Edit button to update their own details. Data lives in useAgencyProfile.
 */
export default function AgencyProfileScreen({ route, navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { agency: routeAgency } = route.params || {};
  const base = useMemo(() => routeAgency || {}, [routeAgency]);
  const {
    agency,
    trips,
    loading,
    comments,
    commentsTotal,
    canReview,
    canEdit,
    saveProfile,
    addComment,
    removeComment,
  } = useAgencyProfile(base);
  const { user } = useAuth();
  const reels = useAgencyReels(base);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('trips');
  const { requireAuth } = useRequireAuth(navigation);
  const { upcoming, others } = useMemo(() => splitTrips(trips), [trips]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: SPACING.xl + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <AgencyHero
          agency={agency}
          imageType={trips[0]?.imageType}
          onBack={() => navigation.goBack()}
          onEdit={canEdit ? () => setEditing(true) : undefined}
        />
        <View style={[styles.content, styles.headerBody]}>
          <AgencyAbout agency={agency} tapesCount={reels.length} />
          {agency._id && !canEdit && (
            <Button
              title="Message agency"
              variant="outline"
              onPress={() => {
                const params = { agencyId: agency._id, title: agency.name };
                if (requireAuth({ name: 'ChatThread', params }))
                  navigation.navigate('ChatThread', params);
              }}
              style={{ marginBottom: SPACING.xs }}
            />
          )}
        </View>

        <AgencyTabs active={tab} onChange={setTab} />

        {tab === 'trips' && (
          <View style={[styles.content, styles.tabBody]}>
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
          </View>
        )}

        {tab === 'tapes' && (
          <View style={styles.tabBodyFlush}>
            <AgencyTapesGrid
              agencyName={agency.name}
              reels={reels}
              onOpenReel={(startIndex) => navigation.navigate('ReelViewer', { reels, startIndex })}
            />
          </View>
        )}

        {tab === 'reviews' && (
          <View style={[styles.content, styles.tabBody]}>
            <AgencyComments
              comments={comments}
              total={commentsTotal}
              canReview={canReview}
              currentUserId={user && !user.isGuest ? user._id : null}
              onPost={addComment}
              onDelete={removeComment}
              ensureSignedIn={() => requireAuth({ name: 'AgencyProfile', params: { agency } })}
            />
          </View>
        )}
      </KeyboardAwareScrollView>

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
  headerBody: { paddingTop: SPACING.sm },
  tabBody: { paddingTop: SPACING.md },
  tabBodyFlush: { paddingTop: 2 },
});
