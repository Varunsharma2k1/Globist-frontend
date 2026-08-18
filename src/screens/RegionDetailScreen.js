import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mountain, Clock } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { getRegionById, getExploreTrips } from '../api';
import { SPACING, RADIUS, FONTS, LAYOUT } from '../theme';
import { useTheme } from '../hooks/useTheme';

/**
 * RegionDetailScreen Component
 *
 * Displays region-specific travel packages and destination information.
 * Uses `getRegionById` / `getExploreTrips` API services.
 */
export default function RegionDetailScreen({ route, navigation }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { regionId, title } = route.params || {};
  const [, setRegion] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegionData = useCallback(async () => {
    try {
      if (regionId) {
        const data = await getRegionById(regionId);
        setRegion(data.region || data);
        setTrips(data.trips || []);
      } else {
        const data = await getExploreTrips();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.warn('[RegionDetailScreen] Error fetching region packages:', error);
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    fetchRegionData();
  }, [fetchRegionData]);

  return (
    <View style={styles.container}>
      <Header title={title || 'Region Expeditions'} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: SPACING.lg + insets.bottom }]}>
          <View style={styles.banner}>
            <View style={styles.bannerIconTile}>
              <Mountain size={32} color={colors.pastel.mountain.fg} strokeWidth={1.5} />
            </View>
            <Text style={typography.h2}>{title || 'High Himalayas'}</Text>
            <Text style={styles.bannerDesc}>Curated local agency itineraries for this region.</Text>
          </View>

          <Text style={[typography.h3, { marginBottom: SPACING.md }]}>Available Packages</Text>

          {trips.map((trip) => (
            <Card
              key={trip._id || trip.title}
              onPress={() =>
                navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
              }
            >
              <View style={styles.tripHeader}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Tag label={`⭐ ${trip.rating || 4.9}`} variant="success" />
              </View>
              <View style={styles.tripMetaRow}>
                <Clock size={12} color={colors.textMuted} />
                <Text style={styles.tripMeta}>
                  {trip.duration || '5 Days'} • {trip.agency?.name || 'Partner Agency'}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceVal}>₹{(trip.price || 16000).toLocaleString()}</Text>
                <Text style={styles.viewText}>View Itinerary →</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
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
  banner: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  bannerIconTile: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.pastel.mountain.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bannerDesc: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  tripTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: colors.ink,
    flex: 1,
    marginRight: SPACING.xs,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.md,
  },
  tripMeta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceVal: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: colors.ink,
  },
  viewText: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: colors.ink,
  },
  });
}
