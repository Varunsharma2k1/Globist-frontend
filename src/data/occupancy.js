/**
 * Room-sharing (occupancy) options a trip can be priced by. A trip's
 * `occupancyPricing` (see normalizeTrip) lists the ones it offers, cheapest
 * first; trips without it (day walks) are priced by `price` alone.
 */

export const OCCUPANCY_LABELS = {
  quad: 'Quad sharing',
  triple: 'Triple sharing',
  double: 'Double sharing',
  single: 'Single room',
};

export const OCCUPANCY_HINTS = {
  quad: '4 per room',
  triple: '3 per room',
  double: '2 per room',
  single: 'Room to yourself',
};

/** Per-person price for `occupancy`, falling back to the trip's starting price. */
export function priceForOccupancy(trip, occupancy) {
  const option = trip?.occupancyPricing?.find((o) => o.occupancy === occupancy);
  return option ? option.pricePerPerson : trip?.price;
}

/** The cheapest offered option, or null for trips without room sharing. */
export const defaultOccupancy = (trip) => trip?.occupancyPricing?.[0]?.occupancy || null;
