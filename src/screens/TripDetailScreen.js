import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Star, Check, Mountain, Waves, Sun } from 'lucide-react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { getTripById, getExploreTrips } from '../api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

const CATEGORY_ICON = { desert: Sun, sun: Sun, beach: Waves, waves: Waves, mountain: Mountain };

/**
 * TripDetailScreen Component
 *
 * Displays itinerary, inclusions, agency verification badge, and booking action bar for a specific package.
 * Replaces direct HTTP calls with `getTripById` / `getExploreTrips`.
 */
export default function TripDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { tripId } = route.params || {};
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTripDetails = useCallback(async () => {
    try {
      if (tripId) {
        const data = await getTripById(tripId);
        setTrip(data);
      } else {
        const data = await getExploreTrips();
        setTrip(data.trips?.[0] || null);
      }
    } catch (error) {
      console.warn('[TripDetailScreen] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Trip Itinerary" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={COLORS.ink} style={{ flex: 1 }} />
      </View>
    );
  }

  const item = trip || {
    title: 'Spiti Valley Winter Expedition',
    duration: '7 Days / 6 Nights',
    price: 24500,
    location: 'Spiti, Himachal Pradesh',
    agency: { name: 'Highland Travelers', rating: 4.9 },
    description:
      'Experience sub-zero temperatures, frozen waterfalls, and ancient monasteries in high altitude Spiti.',
    inclusions: ['4x4 Vehicle Transfers', 'Stays in Homestays', 'Permits & Taxes', 'All Meals'],
  };

  const CategoryIcon = CATEGORY_ICON[item.icon] || Mountain;
  const pastelKey = item.icon === 'waves' ? 'beach' : item.icon === 'sun' ? 'desert' : 'mountain';
  const pastel = COLORS.pastel[pastelKey];

  return (
    <View style={styles.container}>
      <Header title={item.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}>
        <View style={styles.heroSection}>
          <View style={[styles.heroIconTile, { backgroundColor: pastel.bg }]}>
            <CategoryIcon size={36} color={pastel.fg} strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={13} color={COLORS.textMuted} />
            <Text style={styles.locationText}>{item.location || 'Himalayas'}</Text>
          </View>
        </View>

        <Card style={styles.metaCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaVal}>{item.duration || '5 Days'}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Verified Agency</Text>
              <Text style={styles.metaVal}>{item.agency?.name || 'Local Partner'}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Rating</Text>
              <View style={styles.ratingRow}>
                <Star size={12} color={COLORS.success} fill={COLORS.success} />
                <Text style={styles.metaVal}>{item.rating || 4.9}</Text>
              </View>
            </View>
          </View>
        </Card>

        <Text style={TYPOGRAPHY.h3}>Overview</Text>
        <Text style={styles.description}>{item.description}</Text>

        <Text style={[TYPOGRAPHY.h3, { marginTop: SPACING.md }]}>Package Inclusions</Text>
        <View style={styles.inclusionList}>
          {(item.inclusions || ['Accommodation', 'Transfers', 'Guide', 'Meals']).map((inc, i) => (
            <View key={i} style={styles.inclusionRow}>
              <Check size={16} color={COLORS.success} strokeWidth={2.5} />
              <Text style={styles.inclusionText}>{inc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Booking Action Bar */}
      <View style={[styles.bottomBar, { height: 84 + insets.bottom, paddingBottom: insets.bottom }]}>
        <View style={styles.bottomBarInner}>
          <View>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceVal}>₹{(item.price || 18000).toLocaleString()}</Text>
          </View>
          <Button
            title="Proceed to Book"
            onPress={() => navigation.navigate('Booking', { trip: item })}
            style={{ width: 170 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroIconTile: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontFamily: FONTS.heading,
    fontSize: 21,
    color: COLORS.ink,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  locationText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  metaCard: {
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metaCol: {
    alignItems: 'center',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.divider,
  },
  metaLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metaVal: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.ink,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  inclusionList: {
    marginTop: SPACING.xs,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  inclusionText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.divider,
    paddingHorizontal: SPACING.lg,
  },
  bottomBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  priceLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  priceVal: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.ink,
  },
});
