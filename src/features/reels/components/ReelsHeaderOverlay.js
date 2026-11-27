import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { SPACING } from '../../../theme';
import { useTopInset } from '../../../hooks/useTopInset';

export default function ReelsHeaderOverlay({ onPressPost }) {
  const topInset = useTopInset();

  return (
    <View
      style={[styles.headerOverlay, { paddingTop: topInset + SPACING.sm }]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.addBtn}
        onPress={onPressPost}
        accessibilityRole="button"
        accessibilityLabel="Post a tape"
      >
        <Plus size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
