import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function TripCard({ trip, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Card onPress={onPress}>
      <View style={styles.tripRow}>
        <View style={styles.tripBadge}>
          <MapPin size={20} color={colors.ink} strokeWidth={1.75} />
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
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    tripRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tripBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceMuted,
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
      color: colors.ink,
      marginBottom: 2,
    },
    tripSub: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
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
      color: colors.ink,
    },
    tripPriceSub: {
      fontFamily: FONTS.body,
      fontSize: 10,
      color: colors.textMuted,
    },
  });
}
