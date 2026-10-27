import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SPACING, RADIUS, FONTS } from '../../../theme';

/**
 * Shown when the feed has nothing to play — either genuinely no reels, or
 * (with `error`) the feed request failed, in which case a retry is offered.
 */
export default function ReelsEmptyState({ error, onRetry }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {error
          ? "Couldn't load reels. Check your connection and try again."
          : 'No reels yet. Be the first to post one!'}
      </Text>
      {error && onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: '#FFFFFF',
  },
  retryText: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: '#161311',
  },
});
