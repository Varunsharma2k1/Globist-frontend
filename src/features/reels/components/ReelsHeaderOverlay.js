import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { SPACING, FONTS } from '../../../theme';

export default function ReelsHeaderOverlay({ onPressPost }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerOverlay, { paddingTop: insets.top + SPACING.sm }]}>
      <Text style={styles.headerTitle}>Travel Reels</Text>
      <TouchableOpacity style={styles.addBtn} onPress={onPressPost}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: '#FFFFFF',
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
