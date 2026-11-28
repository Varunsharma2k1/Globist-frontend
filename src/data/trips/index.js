/**
 * Room-sharing prices for multi-day trips, derived from the listed price.
 * (Trip content itself lives in MongoDB; this file used to hold demo trips.)
 */
// The listed price is the cheapest (quad sharing) rate — the one the
// backend charges — and fewer people per room cost more.
const OCCUPANCY_MULTIPLIERS = { quad: 1, triple: 1.08, double: 1.18, single: 1.65 };
const roundTo100 = (n) => Math.round(n / 100) * 100;

function deriveOccupancyPricing(trip) {
  // Day trips (no overnight stay) have no room sharing.
  if (!Number.isFinite(trip.pricePerPerson) || !(trip.duration >= 2)) return [];
  return Object.entries(OCCUPANCY_MULTIPLIERS).map(([occupancy, m]) => ({
    occupancy,
    pricePerPerson: roundTo100(trip.pricePerPerson * m),
  }));
}

/**
 * Adds room-sharing prices to a trip from the server (all trip details —
 * itinerary, highlights, inclusions — now come from MongoDB).
 */
export function withTripExtras(trip) {
  if (trip.occupancyPricing?.length) return trip;
  return { ...trip, occupancyPricing: deriveOccupancyPricing(trip) };
}

