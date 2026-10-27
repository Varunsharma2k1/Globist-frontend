// Placeholder counts until trips/saved are real: derived from the user's id so
// they look random but stay the same across renders/launches.
// My Trips: 2 or 3. Saved Trips: 4 or 5.
const hashId = (seed = '') => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const demoCounts = (userId) => {
  const h = hashId(userId);
  return { trips: 2 + (h % 2), saved: 4 + (Math.floor(h / 2) % 2) };
};

/** Picks `count` trips from `trips`, starting at a per-user, per-kind offset. */
export const pickDemoTrips = (trips, userId, kind, count) => {
  if (!trips.length) return [];
  const start = (hashId(userId) + (kind === 'saved' ? 7 : 0)) % trips.length;
  return Array.from(
    { length: Math.min(count, trips.length) },
    (_, i) => trips[(start + i) % trips.length]
  );
};
