import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, Radar as RadarIcon } from 'lucide-react-native';
import Input from '../components/Input';
import Card from '../components/Card';
import Tag from '../components/Tag';
import ExploreGlobeMap from '../components/ExploreGlobeMap';
import { getExploreTrips } from '../api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

/**
 * ExploreScreen Component
 *
 * Allows users to search and filter travel experiences by categories (Mountains, Beaches, Deserts, etc.).
 * Uses modular `getExploreTrips` service instead of raw Axios instances.
 */
export default function ExploreScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('radar'); // 'radar' | 'list'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Mountains', 'Beaches', 'Deserts', 'Treks', 'Luxury'];

  const fetchExploreTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExploreTrips();
      const allTrips = data.trips || [];
      if (selectedCategory === 'All') {
        setTrips(allTrips);
      } else {
        setTrips(
          allTrips.filter(
            (t) =>
              t.tags?.includes(selectedCategory) ||
              t.imageType === selectedCategory.toLowerCase().slice(0, -1)
          )
        );
      }
    } catch (error) {
      console.warn('[ExploreScreen] Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchExploreTrips();
  }, [fetchExploreTrips]);

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'radar') {
    return (
      <View style={[styles.radarContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ExploreGlobeMap
          onShowList={() => setView('list')}
          onSelectDestination={(point) => {
            setSearch(point.name);
            setView('list');
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.searchSection, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Explore Destinations</Text>
          <TouchableOpacity style={styles.radarToggle} onPress={() => setView('radar')}>
            <RadarIcon size={16} color={COLORS.white} />
            <Text style={styles.radarToggleText}>Map</Text>
          </TouchableOpacity>
        </View>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search Spiti, Ladakh, Goa, Kerala..."
          leftIcon={<Search size={17} color={COLORS.textMuted} />}
          style={{ marginBottom: SPACING.sm }}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.ink} style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          <Text style={[TYPOGRAPHY.caption, { marginBottom: SPACING.md }]}>
            Showing {filteredTrips.length} Handcrafted Travel Experiences
          </Text>

          {filteredTrips.map((trip) => (
            <Card
              key={trip._id || trip.title}
              onPress={() =>
                navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
              }
            >
              <View style={styles.tripCardHeader}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Tag label={`⭐ ${trip.rating || 4.8}`} variant="success" />
              </View>

              <View style={styles.tripMetaRow}>
                <MapPin size={12} color={COLORS.textMuted} />
                <Text style={styles.tripMeta}>{trip.location || 'India'}</Text>
                <Clock size={12} color={COLORS.textMuted} style={{ marginLeft: SPACING.sm }} />
                <Text style={styles.tripMeta}>{trip.duration || '5 Days'}</Text>
              </View>
              <Text style={styles.tripDesc} numberOfLines={2}>
                {trip.description || 'Authentic local guided experience.'}
              </Text>

              <View style={styles.footerRow}>
                <Tag label={trip.agency?.name || 'Local Agency'} />
                <Text style={styles.price}>₹{(trip.price || 14000).toLocaleString()}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  radarContainer: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },
  searchSection: {
    padding: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.divider,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pageTitle: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: COLORS.ink,
  },
  radarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
  },
  radarToggleText: {
    fontFamily: FONTS.body,
    fontWeight: '700',
    fontSize: 12,
    color: COLORS.white,
  },
  catScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  catChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
    marginRight: SPACING.xs,
  },
  catChipActive: {
    backgroundColor: COLORS.ink,
  },
  catText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  catTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  tripTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.ink,
    flex: 1,
    marginRight: SPACING.xs,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.xs,
  },
  tripMeta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tripDesc: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  price: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.ink,
  },
});
