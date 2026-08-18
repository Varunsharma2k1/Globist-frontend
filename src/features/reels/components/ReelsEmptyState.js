import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, FONTS } from '../../../theme';

export default function ReelsEmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No reels yet. Be the first to post one!</Text>
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
});
