/**
 * Pure helpers behind Explore's destination search: which trips belong to a
 * place, what to suggest while typing, and the When/Budget/Duration/
 * Difficulty filters + sorting. Kept free of React so the hook stays thin.
 */

export const normalize = (s) => (s == null ? '' : String(s).toLowerCase().trim());

// Trips are found by their title only. Descriptions, itineraries and agency
// locations mention places a trip merely starts from or passes through
// (e.g. the Spiti expedition starts in Manali), which would otherwise make
// it show up as a trip *in* that place.
export function tripMatchesText(trip, query) {
  const q = normalize(query);
  return !q || normalize(trip.title).includes(q);
}

// Places a trip is tagged as being in (src/data/trips) even when its title
// doesn't name them, e.g. the Chadar trek → Zanskar.
const isTaggedWith = (trip, place) =>
  (trip.places || []).some((p) => normalize(p) === normalize(place));

function tripInRegion(trip, region) {
  const regionId = trip.region?._id || trip.region;
  if (regionId) return String(regionId) === String(region._id);
  return normalize(trip.location) === normalize(region.name);
}

function withStats(destination, trips) {
  const prices = trips.map((t) => t.price).filter(Number.isFinite);
  return {
    ...destination,
    tripIds: new Set(trips.map((t) => t._id)),
    count: trips.length,
    minPrice: prices.length ? Math.min(...prices) : null,
  };
}

/**
 * Every searchable destination: each region (e.g. Ladakh) plus each of its
 * places — the region's sub-locations (e.g. Zanskar) and any place its trips
 * are tagged with (e.g. Kalpa). A place's trips are the region's trips that
 * name it in their title or are tagged with it.
 */
export function buildDestinations(regions, trips) {
  const destinations = [];
  regions.forEach((region) => {
    const regionTrips = trips.filter((t) => tripInRegion(t, region));
    destinations.push(
      withStats(
        { key: `region:${region._id}`, type: 'region', name: region.name, region },
        regionTrips
      )
    );
    const tagged = regionTrips.flatMap((t) => t.places || []);
    const places = [...(region.subLocations || []), ...tagged].filter(
      (place, i, all) => all.findIndex((p) => normalize(p) === normalize(place)) === i
    );
    places.forEach((place) => {
      destinations.push(
        withStats(
          {
            key: `place:${region._id}:${place}`,
            type: 'place',
            name: place,
            parentName: region.name,
            region,
          },
          regionTrips.filter((t) => tripMatchesText(t, place) || isTaggedWith(t, place))
        )
      );
    });
  });
  return destinations;
}

export function findParentRegion(destinations, destination) {
  if (!destination || destination.type !== 'place') return null;
  return destinations.find(
    (d) => d.type === 'region' && String(d.region._id) === String(destination.region._id)
  );
}

export function findDestinationByName(destinations, name) {
  const q = normalize(name);
  if (!q) return null;
  const exact = destinations.filter((d) => normalize(d.name) === q);
  // Prefer the region when a place shares its name (e.g. "Goa").
  return exact.find((d) => d.type === 'region') || exact[0] || null;
}

/** Grouped typeahead results, max 3 per group, prefix matches first. */
export function getSuggestions(query, destinations, trips) {
  const q = normalize(query);
  if (!q) return null;
  const has = (s) => normalize(s).includes(q);
  const rank = (s) => (normalize(s).startsWith(q) ? 0 : 1);

  const destinationHits = destinations
    .filter((d) => has(d.name))
    .sort((a, b) => rank(a.name) - rank(b.name) || b.count - a.count)
    .slice(0, 3);

  const agencies = new Map();
  trips.forEach((t) => {
    const agency = t.agency;
    if (!agency?.name || !(has(agency.name) || has(agency.location))) return;
    const id = agency._id || agency.name;
    const entry = agencies.get(id) || { agency, count: 0 };
    entry.count += 1;
    agencies.set(id, entry);
  });

  const packages = trips
    .filter((t) => has(t.title))
    .sort((a, b) => rank(a.title) - rank(b.title))
    .slice(0, 3);

  return {
    destinations: destinationHits,
    agencies: [...agencies.values()].slice(0, 3),
    packages,
  };
}
