/**
 * Copy + actions for Explore's empty list, picked from why it's empty.
 * Takes the useExploreTrips() result; returns ExploreEmptyState props.
 */
export function getEmptyState(explore) {
  const { destination, parentRegion, activeFilterCount, search } = explore;
  const showAll = { label: 'Show all trips', onPress: explore.resetAll };
  const seeParent = parentRegion?.count
    ? {
        label: `See ${parentRegion.count} trips in ${parentRegion.name}`,
        onPress: () => explore.selectDestination(parentRegion),
      }
    : null;

  if (destination && activeFilterCount) {
    return {
      title: `No ${destination.name} trips match these filters`,
      subtitle: 'Try a different month or budget.',
      actions: [{ label: 'Clear filters', onPress: explore.clearFilters }, seeParent].filter(
        Boolean
      ),
    };
  }
  if (destination && search) {
    return {
      title: `No ${destination.name} trips for “${search}”`,
      subtitle: 'Try a different word.',
      actions: [{ label: 'Clear search', onPress: () => explore.setSearch('') }],
    };
  }
  if (destination) {
    return {
      title: `No packages for ${destination.name} yet`,
      subtitle: seeParent
        ? `Agencies haven't listed trips here yet, but ${parentRegion.name} has a few.`
        : "Agencies haven't listed trips here yet.",
      actions: [seeParent, showAll].filter(Boolean),
    };
  }
  if (search) {
    return {
      title: `No trips for “${search}”`,
      subtitle: 'Check the spelling or try a nearby place.',
      actions: [showAll],
    };
  }
  if (activeFilterCount) {
    return {
      title: 'No trips match these filters',
      subtitle: 'Try loosening a filter or two.',
      actions: [{ label: 'Clear filters', onPress: explore.clearFilters }, showAll],
    };
  }
  return { actions: [showAll] };
}
