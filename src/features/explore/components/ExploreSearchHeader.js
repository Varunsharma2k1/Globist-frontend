import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import Input from '../../../components/Input';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, RADIUS, FONTS } from '../../../theme';
import { CATEGORIES } from '../hooks/useExploreTrips';

export default function ExploreSearchHeader({
  search,
  onChangeSearch,
  selectedCategory,
  onSelectCategory,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.searchSection, { paddingTop: insets.top + SPACING.md }]}>
      <Text style={styles.pageTitle}>Explore Destinations</Text>
      <Input
        value={search}
        onChangeText={onChangeSearch}
        placeholder="Search Spiti, Ladakh, Goa, Kerala..."
        leftIcon={<Search size={17} color={colors.textMuted} />}
        style={{ marginBottom: SPACING.sm }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    searchSection: {
      padding: SPACING.lg,
      borderBottomWidth: 2,
      borderBottomColor: colors.divider,
    },
    pageTitle: {
      fontFamily: FONTS.heading,
      fontSize: 26,
      color: colors.ink,
      marginBottom: SPACING.md,
    },
    catScroll: {
      marginHorizontal: -SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    catChip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs + 4,
      borderRadius: RADIUS.pill,
      backgroundColor: colors.surfaceMuted,
      marginRight: SPACING.xs,
    },
    catChipActive: {
      backgroundColor: colors.ink,
    },
    catText: {
      fontFamily: FONTS.semibold,
      fontSize: 13,
      color: colors.text,
    },
    catTextActive: {
      color: colors.inkContrast,
    },
  });
}
