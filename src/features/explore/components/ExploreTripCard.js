import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import ExploreTripCardMedia from './ExploreTripCardMedia';
import RatingSummary from '../../../components/RatingSummary';
import VerifiedBadge from '../../../components/VerifiedBadge';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';

export default function ExploreTripCard({ trip, onPress, onAgencyPress, index = 0 }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const pressScale = useRef(new Animated.Value(1)).current;
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 320,
      delay: Math.min(index, 6) * 60,
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  const springTo = (toValue) =>
    Animated.spring(pressScale, {
      toValue,
      friction: 7,
      tension: 160,
      useNativeDriver: true,
    }).start();

  const hasPrice = Number.isFinite(trip.price);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: appear,
          transform: [
            { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
            { scale: pressScale },
          ],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => springTo(0.98)}
        onPressOut={() => springTo(1)}
        accessibilityRole="button"
        accessibilityLabel={trip.title}
      >
        <ExploreTripCardMedia trip={trip} />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {trip.title}
            </Text>
            <RatingSummary rating={trip.rating} reviewCount={trip.reviewCount} />
          </View>

          {trip.location ? (
            <View style={styles.metaRow}>
              <MapPin size={12} color={colors.textMuted} />
              <Text style={styles.meta}>{trip.location}</Text>
            </View>
          ) : null}

          {trip.description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {trip.description}
            </Text>
          ) : null}

          <View style={styles.footerRow}>
            <View style={styles.agency}>
              {trip.agency?.name ? (
                <Pressable
                  style={styles.agencyTap}
                  onPress={onAgencyPress ? () => onAgencyPress(trip.agency) : onPress}
                  hitSlop={6}
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${trip.agency.name} profile`}
                >
                  <Text style={styles.agencyName} numberOfLines={1}>
                    {trip.agency.name}
                  </Text>
                  {trip.agency.isVerified ? <VerifiedBadge size={14} /> : null}
                </Pressable>
              ) : null}
            </View>
            {hasPrice ? (
              <View style={styles.priceBlock}>
                <Text style={styles.price}>
                  ₹{trip.price.toLocaleString()}
                  <Text style={styles.priceUnit}> onwards</Text>
                </Text>
                <Text style={styles.priceNote}>
                  {trip.occupancyPricing?.length ? 'per person · sharing' : 'per person'}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.divider,
      overflow: 'hidden',
      marginBottom: SPACING.md,
    },
    body: {
      padding: SPACING.md,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: SPACING.sm,
      marginBottom: SPACING.xs,
    },
    title: {
      flex: 1,
      fontFamily: FONTS.bold,
      fontSize: 17,
      letterSpacing: -0.2,
      color: colors.ink,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: SPACING.sm,
    },
    meta: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.textMuted,
    },
    desc: {
      fontFamily: FONTS.body,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
      marginBottom: SPACING.md,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: SPACING.sm,
      paddingTop: SPACING.sm + 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
    },
    agency: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    agencyTap: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    agencyName: {
      flexShrink: 1,
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
    },
    priceBlock: {
      alignItems: 'flex-end',
    },
    priceNote: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 1,
    },
    price: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: colors.ink,
    },
    priceUnit: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
    },
  });
}
