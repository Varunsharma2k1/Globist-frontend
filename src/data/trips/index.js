/**
 * Frontend-only trip data layered over the API (the backend has no fields
 * for these yet):
 * - TRIP_EXTRAS: richer detail (itinerary stays/meals, highlights,
 *   inclusions, place tags) for trips the API returns, keyed by name.
 * - Room-sharing prices for every multi-day trip, derived from its listed
 *   price unless a trip defines its own.
 * - LOCAL_TRIPS: reference packages that exist only in the app. They show
 *   in Explore and open a trip page, but the backend can't book them.
 */
import spiti from './tripExtras';
import moto from './motoExtras';
import manaliSnowEscape from './manaliSnowEscape';
import manaliKasolBackpacking from './manaliKasolBackpacking';
import placePackages from './places';

const TRIP_EXTRAS = { ...spiti, ...moto };

export const LOCAL_TRIPS = [manaliSnowEscape, manaliKasolBackpacking, ...placePackages];

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

/** Raw API trip → raw trip with frontend extras + room-sharing prices. */
export function withTripExtras(trip) {
  const merged = { ...trip, ...TRIP_EXTRAS[trip.name] };
  if (!merged.occupancyPricing?.length) merged.occupancyPricing = deriveOccupancyPricing(merged);
  return merged;
}

export const getLocalTrip = (id) => LOCAL_TRIPS.find((t) => t._id === id) || null;

/**
 * Puts the local packages in front of the API's list, swapping their
 * agency/region snapshots for the live objects (real _ids, categories) when
 * the API returned another trip by the same agency / in the same region.
 */
export function mergeLocalTrips(apiTrips) {
  const agencies = new Map(apiTrips.map((t) => [t.agency?.name, t.agency]));
  const regions = new Map(apiTrips.map((t) => [t.region?.name, t.region]));
  const local = LOCAL_TRIPS.map((t) => ({
    ...t,
    agency: agencies.get(t.agency.name) || t.agency,
    region: regions.get(t.region.name) || t.region,
  }));
  return [...local, ...apiTrips];
}
