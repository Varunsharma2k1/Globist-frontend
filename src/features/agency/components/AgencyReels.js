import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ReelGridTile from '../../profile/components/ReelGridTile';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

const TILE_WIDTH = 120;

/** Horizontal strip of traveller reels that tag the agency; tapping one plays it. */
export default function AgencyReels({ agencyName, reels, onOpenReel }) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={typography.h3}>Traveller reels</Text>
      <Text style={styles.sub}>
        {reels.length
          ? `Reels travellers posted after their trip with ${agencyName || 'this agency'}`
          : `No reels tagging ${agencyName || 'this agency'} yet.`}
      </Text>
      {reels.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {reels.map((reel, index) => (
            <View key={reel._id} style={styles.tile}>
              <ReelGridTile reel={reel} width={TILE_WIDTH} onPress={() => onOpenReel(index)} />
              <Text style={styles.handle} numberOfLines={1}>
                {reel.creatorHandle}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    section: { marginBottom: SPACING.lg },
    sub: { fontFamily: FONTS.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },
    row: { gap: SPACING.sm, marginTop: SPACING.sm },
    tile: { width: TILE_WIDTH, borderRadius: 12, overflow: 'hidden' },
    handle: { fontFamily: FONTS.semibold, fontSize: 12, color: colors.text, marginTop: 4 },
  });
}
