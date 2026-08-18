import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

// Hero image area. The API supplies `imageUrl` and we layer it on top of a
// two-tone gradient so a slow/failed network load still looks intentional
// rather than blank. Safe even when imageUrl is missing.
function RegionHero({ region }) {
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
        <Image source={{ uri: imageUrl }} style={styles.regionImageAsset} resizeMode="cover" />
      ) : null}
      <View style={styles.regionImageOverlay} />
    </View>
  );
}

export default function RegionCard({ region, onPress }) {
  const { colors } = useTheme();
  const cardStyles = getCardStyles(colors);
  const tagline = region.tagline;
  const pillTrips =
    Number.isFinite(region.tripCount) && region.tripCount > 0
      ? `${region.tripCount} Trips`
      : 'Featured';
  const showPrice = Number.isFinite(region.startingPrice);

  return (
    <Card style={cardStyles.regionCard} onPress={onPress}>
      <View style={cardStyles.regionImageWrap}>
        <RegionHero region={region} />
        <View style={cardStyles.regionPill}>
          <MapPin size={12} color={colors.white} strokeWidth={2} />
          <Text style={cardStyles.regionPillText}>{pillTrips}</Text>
        </View>
      </View>
      <Text style={cardStyles.regionName}>{region.name}</Text>
      <Text style={cardStyles.regionState}>{region.state || 'India'}</Text>
      {tagline ? <Text style={cardStyles.regionTagline}>{tagline}</Text> : null}
      {showPrice ? (
        <Text style={cardStyles.regionPrice}>From ₹{region.startingPrice.toLocaleString()}</Text>
      ) : (
        <Text style={cardStyles.regionPriceMuted}>Tap to view pricing</Text>
      )}
    </Card>
  );
}

// Static (theme-independent) hero styles — the region hero always uses its
// own fixed pastel gradient regardless of app theme.
const styles = StyleSheet.create({
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
});

function getCardStyles(colors) {
  return StyleSheet.create({
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
      color: colors.white,
      letterSpacing: 0.4,
    },
    regionName: {
      fontFamily: FONTS.heading,
      fontSize: 15,
      color: colors.ink,
      paddingHorizontal: SPACING.xs,
    },
    regionState: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
      paddingHorizontal: SPACING.xs,
    },
    regionTagline: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: SPACING.xs,
      paddingHorizontal: SPACING.xs,
    },
    regionPrice: {
      fontFamily: FONTS.heading,
      fontSize: 13,
      color: colors.ink,
      paddingHorizontal: SPACING.xs,
    },
    regionPriceMuted: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
      paddingHorizontal: SPACING.xs,
    },
  });
}
