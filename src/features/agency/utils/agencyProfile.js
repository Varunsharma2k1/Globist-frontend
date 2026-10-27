/** Stable key for an agency — the id when the API gave one, else its name. */
export const agencyKey = (agency) => String(agency?._id || agency?.name || '');

export const sameAgency = (a, b) => {
  if (!a || !b) return false;
  if (a._id && b._id) return a._id === b._id;
  return Boolean(a.name) && a.name === b.name;
};

const isFuture = (value) => {
  const date = value ? new Date(value) : null;
  return Boolean(date) && !Number.isNaN(date.getTime()) && date >= new Date();
};

/**
 * Splits an agency's trips into those with an upcoming departure (soonest
 * first) and the rest that it organises without a scheduled date.
 */
export function splitTrips(trips) {
  const upcoming = trips
    .filter((t) => isFuture(t.nextSlot))
    .sort((a, b) => new Date(a.nextSlot) - new Date(b.nextSlot));
  const others = trips.filter((t) => !isFuture(t.nextSlot));
  return { upcoming, others };
}
