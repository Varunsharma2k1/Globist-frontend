import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import Card from '../../../components/Card';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

export default function TripMetaCard({ item }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
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
            <Star size={12} color={colors.success} fill={colors.success} />
            <Text style={styles.metaVal}>{item.rating || 4.9}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
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
      backgroundColor: colors.divider,
    },
    metaLabel: {
      fontFamily: FONTS.body,
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 2,
    },
    metaVal: {
      fontFamily: FONTS.heading,
      fontSize: 14,
      color: colors.ink,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
}
