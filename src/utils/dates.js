/**
 * Small local-time date helpers. Dates travel through the app as "YYYY-MM-DD"
 * strings (what the booking API takes), and are built from local parts —
 * never toISOString(), which shifts the day across timezones.
 */
const pad = (n) => String(n).padStart(2, '0');

export const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "2026-12-12" → local Date at midnight; null if missing/invalid. */
export const parseISODate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

export const isSameDay = (a, b) => Boolean(a && b) && toISODate(a) === toISODate(b);

/** "Sat, 12 Dec 2026" */
export const formatLongDate = (date) =>
  date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** "December 2026" */
export const formatMonthYear = (date) =>
  date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

/**
 * Six weeks of a month for a Monday-first grid: arrays of 7 entries, each a
 * Date or null for the blank cells before the 1st / after the last day.
 */
export const monthGrid = (monthStart) => {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0
  const cells = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  // Always six weeks, so a calendar doesn't change height from month to month.
  while (cells.length < 42) cells.push(null);
  return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
};
