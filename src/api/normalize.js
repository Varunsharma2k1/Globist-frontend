/**
 * Backend <-> Frontend shape adapters
 *
 * The Express/Mongoose backend and the RN screens were built against slightly
 * different field names (e.g. Trip.name vs. UI's trip.title, Booking.checkIn vs.
 * UI's booking.startDate). These helpers translate backend documents into the
 * shape the screens already expect, so normalization lives in one place instead
 * of being duplicated (or missed) across screens.
 */

import { withTripExtras } from '../data/trips';

export function normalizeTrip(rawTrip) {
  if (!rawTrip) return rawTrip;
  // Frontend-only detail (room-sharing prices, richer itinerary, ...) — see
  // src/data/trips.
  const trip = withTripExtras(rawTrip);
  // Cheapest room-sharing option first; `price` is the "starting from" rate.
  const occupancyPricing = [...(trip.occupancyPricing || [])].sort(
    (a, b) => a.pricePerPerson - b.pricePerPerson
  );
  return {
    ...trip,
    title: trip.name,
    price: occupancyPricing.length ? occupancyPricing[0].pricePerPerson : trip.pricePerPerson,
    occupancyPricing,
    duration: typeof trip.duration === 'number' ? `${trip.duration} Days` : trip.duration,
    rating: trip.agency?.rating,
    reviewCount: trip.agency?.reviewCount,
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
