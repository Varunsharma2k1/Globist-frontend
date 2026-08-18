import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import Card from '../../../components/Card';
import Tag from '../../../components/Tag';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function ExploreTripCard({ trip, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Card onPress={onPress}>
      <View style={styles.tripCardHeader}>
        <Text style={styles.tripTitle}>{trip.title}</Text>
        <Tag label={`⭐ ${trip.rating || 4.8}`} variant="success" />
      </View>

      <View style={styles.tripMetaRow}>
        <MapPin size={12} color={colors.textMuted} />
        <Text style={styles.tripMeta}>{trip.location || 'India'}</Text>
        <Clock size={12} color={colors.textMuted} style={{ marginLeft: SPACING.sm }} />
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
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    tripCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
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
      marginBottom: SPACING.xs,
    },
    tripMeta: {
      fontFamily: FONTS.body,
      fontSize: 12,
      color: colors.textMuted,
    },
    tripDesc: {
      fontFamily: FONTS.body,
      fontSize: 13,
      color: colors.text,
      marginBottom: SPACING.md,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    price: {
      fontFamily: FONTS.heading,
      fontSize: 16,
      color: colors.ink,
    },
  });
}
