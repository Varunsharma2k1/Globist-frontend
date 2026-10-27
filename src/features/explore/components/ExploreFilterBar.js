import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  X,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Compass,
  Mountain,
  Waves,
  Sun,
  Footprints,
  Gem,
} from 'lucide-react-native';
import ExploreChip from './ExploreChip';
import { SPACING } from '../../../theme';
import { CATEGORIES } from '../hooks/useExploreTrips';
import { optionFor } from '../utils/exploreFilters';

const agencyLabel = ({ agencies, verifiedOnly }, agencyOptions) => {
  if (agencies.length === 1) {
    return agencyOptions.find((o) => o.id === agencies[0])?.agency.name || '1 agency';
  }
  if (agencies.length) return `${agencies.length} agencies`;
  return verifiedOnly ? 'Verified only' : 'Agency';
};

const CATEGORY_ICON = {
  All: Compass,
  Mountains: Mountain,
  Beaches: Waves,
  Deserts: Sun,
  Treks: Footprints,
  Luxury: Gem,
};

/**
 * The single chip row under the search bar.
 * - Browsing: [Filters] [Agency] + category chips.
 * - Inside a destination: [📍 Zanskar ✕] + [When] [Budget] [Agency] [Filters].
 * Refine chips only show when `showFilters` (enough trips to narrow down).
 */
export default function ExploreFilterBar({
  destination,
  onClearDestination,
  selectedCategory,
  onSelectCategory,
  filters,
  showFilters,
  activeFilterCount,
  agencyOptions,
  onOpenSheet,
}) {
  const filtersLabel = activeFilterCount ? `Filters · ${activeFilterCount}` : 'Filters';
  const filtersChip = showFilters ? (
    <ExploreChip
      label={filtersLabel}
      icon={SlidersHorizontal}
      active={activeFilterCount > 0}
      onPress={() => onOpenSheet('all')}
    />
  ) : null;

  const agencyChip = showFilters ? (
    <ExploreChip
      label={agencyLabel(filters, agencyOptions)}
      trailingIcon={ChevronDown}
      active={filters.agencies.length > 0 || filters.verifiedOnly}
      onPress={() => onOpenSheet('agency')}
    />
  ) : null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {destination ? (
        <>
          <ExploreChip
            label={destination.name}
            icon={MapPin}
            trailingIcon={X}
            active
            onPress={onClearDestination}
          />
          {showFilters ? (
            <>
              <ExploreChip
                label={filters.when === 'any' ? 'When' : optionFor('when', filters.when).label}
                trailingIcon={ChevronDown}
                active={filters.when !== 'any'}
                onPress={() => onOpenSheet('when')}
              />
              <ExploreChip
                label={
                  filters.budget === 'any' ? 'Budget' : optionFor('budget', filters.budget).label
                }
                trailingIcon={ChevronDown}
                active={filters.budget !== 'any'}
                onPress={() => onOpenSheet('budget')}
              />
              {agencyChip}
            </>
          ) : null}
          {filtersChip}
        </>
      ) : (
        <>
          {filtersChip}
          {agencyChip}
          {CATEGORIES.map((cat) => (
            <ExploreChip
              key={cat}
              label={cat}
              icon={CATEGORY_ICON[cat] || Compass}
              active={selectedCategory === cat}
              onPress={() => onSelectCategory(cat)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -SPACING.lg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
  },
});
