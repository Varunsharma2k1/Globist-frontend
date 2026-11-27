import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Clapperboard } from 'lucide-react-native';
import ReelGridTile from '../../profile/components/ReelGridTile';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS, LAYOUT } from '../../../theme';

const COLUMNS = 3;
const GAP = 2;

/**
 * Instagram-style 3-column grid of tapes travellers posted after a trip with
 * this agency (verified bookings only). Tiles are 9:16 like the reels.
 */
export default function AgencyTapesGrid({
  agencyName,
  reels,
  onOpenReel,
  emptyTitle,
  emptySub,
  showHandle = true,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { width: screenW } = useWindowDimensions();
  const gridW = Math.min(screenW, LAYOUT.contentMaxWidth || screenW);
  const tileW = Math.floor((gridW - GAP * (COLUMNS - 1)) / COLUMNS);

  if (!reels.length) {
    return (
      <View style={styles.empty}>
        <Clapperboard size={32} color={colors.textMuted} strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>{emptyTitle || 'No tapes yet'}</Text>
        <Text style={styles.emptySub}>
          {emptySub ||
            `Travellers who book with ${agencyName || 'this agency'} can post their trip tapes here.`}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.grid, { width: gridW }]}>
      {reels.map((reel, index) => (
        <ReelGridTile
          key={reel._id}
          reel={reel}
          width={tileW}
          aspect={16 / 9}
          onPress={() => onOpenReel(index)}
        >
          {showHandle ? (
            <View style={styles.handleWrap} pointerEvents="none">
              <Text style={styles.handle} numberOfLines={1}>
                {reel.creatorHandle || reel.user?.name || ''}
              </Text>
            </View>
          ) : null}
        </ReelGridTile>
      ))}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, alignSelf: 'center' },
    handleWrap: { position: 'absolute', left: 6, right: 6, top: 6 },
    handle: {
      fontFamily: FONTS.semibold,
      fontSize: 12,
      color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowRadius: 3,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
      gap: SPACING.xs,
    },
    emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: colors.ink, marginTop: SPACING.xs },
    emptySub: {
      fontFamily: FONTS.body,
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}
