/**
 * Regions the app doesn't list trips for right now. Trips (and destination
 * tiles) in these regions are filtered out on the frontend only — the
 * backend still has them.
 */
const HIDDEN_REGIONS = ['goa', 'kerala', 'rajasthan', 'karnataka', 'meghalaya'];

const mentionsHidden = (text) => {
  const lower = `${text || ''}`.toLowerCase();
  return HIDDEN_REGIONS.some((name) => lower.includes(name));
};

export const isHiddenRegion = (region) => mentionsHidden(region?.name);

export const isHiddenTrip = (trip) => mentionsHidden(`${trip.region?.name} ${trip.location}`);
