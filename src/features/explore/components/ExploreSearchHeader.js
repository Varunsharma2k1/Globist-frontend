import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import Input from '../../../components/Input';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONTS } from '../../../theme';

/**
 * Title + search field. While the field is focused a "Cancel" button
 * appears (the screen swaps the list for suggestions); `children` is the
 * chip row rendered underneath when not searching.
 */
export default function ExploreSearchHeader({
  search,
  onChangeSearch,
  onSubmitSearch,
  focused,
  onFocus,
  onBlur,
  onCancel,
  children,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.searchSection, { paddingTop: insets.top + SPACING.md }]}>
      <Text style={styles.eyebrow}>EXPLORE</Text>
      <Text style={styles.pageTitle}>Where to next?</Text>
      <View style={styles.searchRow}>
        <Input
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Search a place, trek or agency"
          leftIcon={<Search size={17} color={colors.textMuted} />}
          rightIcon={search ? <X size={16} color={colors.textMuted} /> : null}
          onRightIconPress={search ? () => onChangeSearch('') : undefined}
          returnKeyType="search"
          onSubmitEditing={onSubmitSearch}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styles.input}
        />
        {focused ? (
          <TouchableOpacity onPress={onCancel} style={styles.cancel} activeOpacity={0.6}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {focused ? null : children}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    searchSection: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.md,
      backgroundColor: colors.background,
    },
    eyebrow: {
      fontFamily: FONTS.semibold,
      fontSize: 11,
      letterSpacing: 1.6,
      color: colors.textMuted,
      marginBottom: SPACING.xs,
    },
    pageTitle: {
      fontFamily: FONTS.heading,
      fontSize: 28,
      letterSpacing: -0.5,
      color: colors.ink,
      marginBottom: SPACING.md,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    input: {
      flex: 1,
      marginBottom: 0,
    },
    cancel: {
      paddingVertical: SPACING.sm,
    },
    cancelText: {
      fontFamily: FONTS.semibold,
      fontSize: 14,
      color: colors.ink,
    },
  });
}
