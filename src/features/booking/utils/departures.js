/**
 * Fixed-departure schedule for a trip. Agencies run each trip on set start
 * dates: the backend only stores the next one (`trip.nextSlot`), so the
 * following departures are projected from it at a fixed interval — weekly
 * for short trips, fortnightly for trips longer than a week — unless the
 * trip carries its own `departureEveryDays`.
 *
 * Dates are handled as local calendar days ('YYYY-MM-DD'), never through
 * toISOString(), which would shift them a day in timezones ahead of UTC.
 */

const pad = (n) => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD' in local time. */
export const isoDay = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** 'YYYY-MM-DD' / ISO timestamp / Date → local midnight Date (or null). */
export function toLocalDay(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const todayIso = () => isoDay(new Date());

/** "7 Days" / 7 → 7 (defaults to 1). */
export const durationDays = (trip) => Math.max(1, parseInt(trip?.duration, 10) || 1);

/** 5-day trip → "5D / 4N" */
export const formatDaysNights = (trip) => {
  const days = durationDays(trip);
  return `${days}D / ${Math.max(0, days - 1)}N`;
};

export const departureInterval = (trip) =>
  trip?.departureEveryDays || (durationDays(trip) > 7 ? 14 : 7);

/** Last day of a trip starting on `startIso` ('YYYY-MM-DD'). */
export const tripEndDate = (trip, startIso) =>
  isoDay(addDays(toLocalDay(startIso), durationDays(trip) - 1));

/**
 * Bookable departure dates ('YYYY-MM-DD', ascending) covering `months`
 * months from the first one (seasonal trips may not start for a while).
 * Bookings close the day before departure, so the earliest date offered is
 * tomorrow.
 */
export function departureDates(trip, { months = 6 } = {}) {
  const today = toLocalDay(new Date());
  const earliest = addDays(today, 1);
  const every = departureInterval(trip);

  let next = toLocalDay(trip?.nextSlot) || addDays(today, 3);
  while (next < earliest) next = addDays(next, every);

  const until = new Date(next);
  until.setMonth(until.getMonth() + months);

  const dates = [];
  for (let d = next; d <= until; d = addDays(d, every)) dates.push(isoDay(d));
  return dates;
}

/** '2026-12-12' → 'Sat, 12 Dec 2026' */
export const formatDay = (iso, { weekday = true, year = true } = {}) =>
  toLocalDay(iso)?.toLocaleDateString('en-IN', {
    weekday: weekday ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: year ? 'numeric' : undefined,
  }) || '';
