/**
 * Explore's refine options (When / Budget / Duration / Difficulty / Sort)
 * and the pure functions that apply them to a trip list.
 */

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Next 12 months from today, keyed "YYYY-M" (month 0-based) to match a
// trip's nextSlot.
function upcomingMonths() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
    };
  });
}

export const FILTER_OPTIONS = {
  when: [{ key: 'any', label: 'Any time' }, ...upcomingMonths()],
  budget: [
    { key: 'any', label: 'Any budget' },
    { key: 'under10', label: 'Under ₹10k', max: 9999 },
    { key: '10to25', label: '₹10k – 25k', min: 10000, max: 24999 },
    { key: 'over25', label: '₹25k+', min: 25000 },
  ],
  duration: [
    { key: 'any', label: 'Any length' },
    { key: 'weekend', label: '1–2 days', min: 1, max: 2 },
    { key: 'short', label: '3–5 days', min: 3, max: 5 },
    { key: 'week', label: '6–9 days', min: 6, max: 9 },
    { key: 'long', label: '10+ days', min: 10 },
  ],
  difficulty: [
    { key: 'any', label: 'Any level' },
    { key: 'easy', label: 'Easy' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'hard', label: 'Hard' },
  ],
  sort: [
    { key: 'recommended', label: 'Recommended' },
    { key: 'soonest', label: 'Soonest departure' },
    { key: 'price_low', label: 'Price: low to high' },
    { key: 'price_high', label: 'Price: high to low' },
    { key: 'rating', label: 'Top rated' },
  ],
};

export const DEFAULT_FILTERS = {
  when: 'any',
  budget: 'any',
  duration: 'any',
  difficulty: 'any',
  agencies: [], // agency ids; empty = any agency
  verifiedOnly: false,
  sort: null, // null → "soonest" inside a destination, "recommended" otherwise
};

export const optionFor = (group, key) => FILTER_OPTIONS[group].find((o) => o.key === key);

export const countActiveFilters = (filters) =>
  ['when', 'budget', 'duration', 'difficulty'].filter((k) => filters[k] !== 'any').length +
  (filters.agencies.length ? 1 : 0) +
  (filters.verifiedOnly ? 1 : 0);

const agencyId = (trip) => trip.agency?._id || trip.agency?.name;

/**
 * Agencies running any of `trips`, for the Agency filter: verified first,
 * then by how many of these trips they run, then rating.
 */
export function agencyOptions(trips) {
  const byId = new Map();
  trips.forEach((trip) => {
    const id = agencyId(trip);
    if (!id) return;
    const entry = byId.get(id) || { id, agency: trip.agency, count: 0 };
    entry.count += 1;
    byId.set(id, entry);
  });
  return [...byId.values()].sort(
    (a, b) =>
      Number(Boolean(b.agency.isVerified)) - Number(Boolean(a.agency.isVerified)) ||
      b.count - a.count ||
      (b.agency.rating || 0) - (a.agency.rating || 0)
  );
}

const inRange = (value, { min = -Infinity, max = Infinity }) =>
  Number.isFinite(value) && value >= min && value <= max;

// Upcoming departure as a Date, or null if missing / already past.
function nextDeparture(trip) {
  if (!trip.nextSlot) return null;
  const date = new Date(trip.nextSlot);
  return Number.isNaN(date.getTime()) || date < new Date() ? null : date;
}

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

/**
 * "When" options limited to months where at least one of `trips` departs,
 * so picking a month never leads to an empty list.
 */
export function availableWhenOptions(trips) {
  const months = new Set(trips.map(nextDeparture).filter(Boolean).map(monthKey));
  return FILTER_OPTIONS.when.filter((o) => o.key === 'any' || months.has(o.key));
}

export function applyFilters(trips, filters) {
  const budget = optionFor('budget', filters.budget);
  const duration = optionFor('duration', filters.duration);
  return trips.filter((trip) => {
    if (filters.when !== 'any') {
      const date = nextDeparture(trip);
      if (!date || monthKey(date) !== filters.when) return false;
    }
    if (budget?.key !== 'any' && !inRange(trip.price, budget)) return false;
    if (duration?.key !== 'any' && !inRange(parseInt(trip.duration, 10), duration)) return false;
    if (filters.difficulty !== 'any' && trip.difficulty !== filters.difficulty) return false;
    if (filters.agencies.length && !filters.agencies.includes(agencyId(trip))) return false;
    if (filters.verifiedOnly && !trip.agency?.isVerified) return false;
    return true;
  });
}

export function sortTrips(trips, sortKey) {
  const sorted = [...trips];
  const by = (fn) => sorted.sort((a, b) => fn(a) - fn(b));
  switch (sortKey) {
    case 'soonest':
      return by((t) => nextDeparture(t)?.getTime() ?? Infinity);
    case 'price_low':
      return by((t) => (Number.isFinite(t.price) ? t.price : Infinity));
    case 'price_high':
      return by((t) => -(Number.isFinite(t.price) ? t.price : -Infinity));
    case 'rating':
      return by((t) => -(Number.isFinite(t.rating) ? t.rating : 0));
    default:
      return sorted; // "recommended" keeps the API's featured/popular order
  }
}
