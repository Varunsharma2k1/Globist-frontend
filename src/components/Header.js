import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../theme';

export default function Header({ title, onBack, rightElement }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { height: 56 + insets.top, paddingTop: insets.top }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={22} color={COLORS.ink} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.ink,
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
});
