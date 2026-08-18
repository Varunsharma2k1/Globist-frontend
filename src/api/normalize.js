/**
 * Backend <-> Frontend shape adapters
 *
 * The Express/Mongoose backend and the RN screens were built against slightly
 * different field names (e.g. Trip.name vs. UI's trip.title, Booking.checkIn vs.
 * UI's booking.startDate). These helpers translate backend documents into the
 * shape the screens already expect, so normalization lives in one place instead
 * of being duplicated (or missed) across screens.
 */

export function normalizeTrip(trip) {
  if (!trip) return trip;
  return {
    ...trip,
    title: trip.name,
    price: trip.pricePerPerson,
    duration: typeof trip.duration === 'number' ? `${trip.duration} Days` : trip.duration,
    rating: trip.agency?.rating,
    inclusions: trip.itinerary?.length ? trip.itinerary.map((i) => i.title) : undefined,
    location: trip.region?.name || trip.location,
  };
}

export function normalizeRegion(region) {
  if (!region) return region;
  return {
    ...region,
    tripCount: region.spotCount,
    // imageUrl and tagline come straight from the backend; if a region
    // doesn't have them the UI falls back to a gradient backdrop and a
    // neutral "Tap to view" line.
    imageUrl: region.imageUrl || '',
    tagline: region.tagline || '',
  };
}

export function normalizeBooking(booking) {
  if (!booking) return booking;
  return {
    ...booking,
    startDate: booking.checkIn,
    totalPrice: booking.totalAmount,
    travelersCount: booking.adults,
    trip: booking.trip ? normalizeTrip(booking.trip) : booking.trip,
  };
}

export function normalizeUser(user) {
  if (!user) return user;
  return {
    ...user,
    stats: {
      ...user.stats,
      tripsBooked: user.stats?.trips,
      earnings: user.referralPoints,
    },
  };
}
