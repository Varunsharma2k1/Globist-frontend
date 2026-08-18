import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Film, MapPin } from 'lucide-react-native';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { getFeaturedRegions, getExploreTrips } from '../api';
import { pickFeaturedRegions } from '../data/featuredRegions';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, FONTS, LAYOUT } from '../theme';

/**
 * HomeScreen Component
 *
 * Renders top banner, featured travel regions, and trending travel packages.
 * Replaces direct HTTP calls with modular API functions (getRegions, getExploreTrips).
 */
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [regions, setRegions] = useState([]);
  const [trendingTrips, setTrendingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [regionsData, exploreData] = await Promise.all([
        // Dedicated endpoint that the backend already restricts to the
        // curated two regions with their imageUrl + tagline attached.
        getFeaturedRegions().catch(() => []),
        getExploreTrips().catch(() => ({ trips: [] })),
      ]);
      setRegions(pickFeaturedRegions(regionsData));
      setTrendingTrips(exploreData.trips || []);
    } catch (error) {
      console.warn('[HomeScreen] Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hero image area. The API supplies `imageUrl` and we layer it on top of
  // a two-tone gradient so a slow / failed network load still looks
  // intentional rather than blank. Safe even when imageUrl is missing.
  const renderHero = (region) => {
    const imageUrl = region && region.imageUrl;
    const palette =
      (region && region.imageType) === 'desert'
        ? ['#F8E6C2', '#7A5A1E']
        : (region && region.imageType) === 'beach'
        ? ['#DBE6F2', '#2F4D6E']
        : ['#DFE9DA', '#3F5C3A'];
    return (
      <View style={styles.regionImage}>
        <View style={[styles.regionGradientTop, { backgroundColor: palette[0] }]} />
        <View style={[styles.regionGradientBottom, { backgroundColor: palette[1] }]} />
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.regionImageAsset}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.regionImageOverlay} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* App Navigation Bar */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.appName}>GLOBIST</Text>
          <Text style={styles.subHeader}>Discover Authentic Travel</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Reels Banner */}
        <Card style={styles.bannerCard} onPress={() => navigation.navigate('ReelsTab')}>
          <View style={styles.bannerBadge}>
            <Film size={12} color={COLORS.pastel.peach.fg} />
            <Text style={styles.bannerBadgeText}>TRENDING REELS</Text>
          </View>
          <Text style={styles.bannerTitle}>Explore Destinations via Reels</Text>
          <Text style={styles.bannerDesc}>
            Watch short vertical clips posted by verified creators & agencies.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ReelsTab')}>
            <Text style={styles.bannerAction}>Watch Reels Now →</Text>
          </TouchableOpacity>
        </Card>

        {/* Featured Travel Destinations */}
        <View style={styles.sectionHeader}>
          <Text style={TYPOGRAPHY.h3}>Featured Regions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.ink} style={{ marginVertical: SPACING.lg }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {regions.map((region) => {
              const tagline = region.tagline;
              const pillTrips = Number.isFinite(region.tripCount) && region.tripCount > 0
                ? `${region.tripCount} Trips`
                : 'Featured';
              const showPrice = Number.isFinite(region.startingPrice);
              return (
                <Card
                  key={region._id || region.name}
                  style={styles.regionCard}
                  onPress={() =>
                    navigation.navigate('RegionDetail', {
                      regionId: region._id,
                      title: region.name,
                    })
                  }
                >
                  <View style={styles.regionImageWrap}>
                    {renderHero(region)}
                    <View style={styles.regionPill}>
                      <MapPin size={12} color={COLORS.white} strokeWidth={2} />
                      <Text style={styles.regionPillText}>{pillTrips}</Text>
                    </View>
                  </View>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Text style={styles.regionState}>{region.state || 'India'}</Text>
                  {tagline ? <Text style={styles.regionTagline}>{tagline}</Text> : null}
                  {showPrice ? (
                    <Text style={styles.regionPrice}>
                      From ₹{region.startingPrice.toLocaleString()}
                    </Text>
                  ) : (
                    <Text style={styles.regionPriceMuted}>Tap to view pricing</Text>
                  )}
                </Card>
              );
            })}
          </ScrollView>
        )}

        {/* Top Handcrafted Packages */}
        <View style={styles.sectionHeader}>
          <Text style={TYPOGRAPHY.h3}>Top Handcrafted Packages</Text>
        </View>

        {trendingTrips.slice(0, 4).map((trip) => (
          <Card
            key={trip._id || trip.title}
            onPress={() =>
              navigation.navigate('TripDetail', { tripId: trip._id, title: trip.title })
            }
          >
            <View style={styles.tripRow}>
              <View style={styles.tripBadge}>
                <MapPin size={20} color={COLORS.ink} strokeWidth={1.75} />
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.tripSub}>
                  {trip.duration || '5 Days'} • {trip.region?.name || 'Popular'}
                </Text>
                <View style={styles.tagRow}>
                  <Tag label={`⭐ ${trip.rating || 4.9}`} variant="success" />
                  <Tag label={trip.agency?.name || 'Verified Partner'} />
                </View>
              </View>
              <View style={styles.tripPriceContainer}>
                <Text style={styles.tripPrice}>₹{(trip.price || 15000).toLocaleString()}</Text>
                <Text style={styles.tripPriceSub}>per person</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.divider,
  },
  headerTextWrap: {
    alignItems: 'center',
  },
  appName: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.ink,
    letterSpacing: 1,
  },
  subHeader: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuIcon: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
    width: '100%',
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: 'center',
  },
  bannerCard: {
    backgroundColor: COLORS.pastel.peach.bg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginBottom: SPACING.sm,
  },
  bannerBadgeText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.pastel.peach.fg,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 19,
    color: COLORS.ink,
    marginBottom: 4,
  },
  bannerDesc: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  bannerAction: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.ink,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  seeAll: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.ink,
  },
  horizontalScroll: {
    marginBottom: SPACING.lg,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  regionCard: {
    width: 200,
    marginRight: SPACING.md,
    padding: SPACING.sm,
  },
  regionImageWrap: {
    width: '100%',
    height: 120,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  regionImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  regionGradientTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%',
  },
  regionGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    opacity: 0.85,
  },
  regionImageAsset: {
    ...StyleSheet.absoluteFillObject,
  },
  regionImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  regionPill: {
    position: 'absolute',
    left: SPACING.xs,
    bottom: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  regionPillText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  regionName: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.ink,
    paddingHorizontal: SPACING.xs,
  },
  regionState: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
    paddingHorizontal: SPACING.xs,
  },
  regionTagline: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  regionPrice: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.ink,
    paddingHorizontal: SPACING.xs,
  },
  regionPriceMuted: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xs,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.ink,
    marginBottom: 2,
  },
  tripSub: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tripPriceContainer: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  tripPrice: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.ink,
  },
  tripPriceSub: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
