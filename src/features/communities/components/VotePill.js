import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { compact } from '../utils/format';

/** Reddit-style up / down vote pill. `vote` is 1, -1 or 0. */
export default function VotePill({ score, vote, onVote }) {
  const { colors } = useTheme();
  const up = vote === 1;
  const down = vote === -1;
  const accent = up ? colors.success : down ? colors.error : colors.text;

  return (
    <View style={[styles.pill, { backgroundColor: colors.surfaceMuted }]}>
      <Pressable onPress={() => onVote(1)} hitSlop={6} accessibilityLabel="Upvote">
        <ArrowBigUp
          size={22}
          color={up ? colors.success : colors.textMuted}
          fill={up ? colors.success : 'none'}
        />
      </Pressable>
      <Text style={[styles.score, { color: accent }]}>{compact(score)}</Text>
      <Pressable onPress={() => onVote(-1)} hitSlop={6} accessibilityLabel="Downvote">
        <ArrowBigDown
          size={22}
          color={down ? colors.error : colors.textMuted}
          fill={down ? colors.error : 'none'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  score: { fontFamily: FONTS.heading, fontSize: 14, minWidth: 22, textAlign: 'center' },
});
