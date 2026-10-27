import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Plane, Star, Compass } from 'lucide-react-native';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Full-width "Book Trip" bar pinned to the bottom of every reel: the agency
 * running the trip, its location + starting price, and the CTA. Reels with
 * no agency attached get an "Explore" variant instead, so every reel still
 * has a booking path.
 */
export default function ReelBookingBar({ agency, location, pending, onPress, onAgencyPress }) {
  const hasAgency = Boolean(agency);
  const price = agency?.startingPrice
    ? `from ₹${Number(agency.startingPrice).toLocaleString()}`
    : null;
  const meta = hasAgency
    ? [agency.location || location, price].filter(Boolean).join(' · ')
    : 'Browse handpicked packages on Globist';
  const Icon = hasAgency ? Plane : Compass;

  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={styles.agencyTap}
        onPress={onAgencyPress}
        disabled={!hasAgency || !onAgencyPress}
        activeOpacity={0.7}
        accessibilityRole="link"
        accessibilityLabel={hasAgency ? `Open ${agency.name} profile` : undefined}
      >
        <View style={styles.iconWrap}>
          <Icon size={16} color="#FFFFFF" />
        </View>

        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {hasAgency ? agency.name : 'Find trips like this'}
            </Text>
            {hasAgency && agency.rating ? (
              <View style={styles.rating}>
                <Star size={10} color="#FFD54A" fill="#FFD54A" />
                <Text style={styles.ratingText}>{agency.rating}</Text>
              </View>
            ) : null}
          </View>
          {meta ? (
            <Text style={styles.meta} numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cta}
        onPress={onPress}
        disabled={pending || !onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={hasAgency ? `Book trip with ${agency.name}` : 'Explore trips'}
      >
        {pending ? (
          <ActivityIndicator size="small" color="#161311" />
        ) : (
          <Text style={styles.ctaText}>{hasAgency ? 'Book Trip' : 'Explore'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(22,19,17,0.62)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  agencyTap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flexShrink: 1,
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  cta: {
    minWidth: 92,
    height: 38,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: '#161311',
  },
});
