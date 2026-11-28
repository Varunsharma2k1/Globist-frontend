import client from './client';
import { normalizeTrip, normalizeBooking } from './normalize';
import { isHiddenTrip } from '../data/hiddenRegions';

/**
 * Trips & Bookings API Service
 *
 * Provides methods for fetching handcrafted travel packages, single trip details,
 * creating bookings, and retrieving user bookings.
 */

/**
 * Fetches explore packages and handcrafted trips.
 * @returns {Promise<{trips: Array}>}
 */
export const getExploreTrips = async () => {
  // The API defaults to 20 trips; Explore filters client-side, so ask for
  // the whole catalogue.
  const response = await client.get('/trips', { params: { limit: 100 } });
  // Real trips only (MongoDB), minus regions the app isn't listing right now.
  const trips = (response.data || []).map(normalizeTrip);
  return { trips: trips.filter((t) => !isHiddenTrip(t)) };
};

/**
 * Fetches details for a single trip package by ID.
 * Backend returns { trip, relatedTrips } — unwrapped here so callers can
 * keep treating the result as the trip itself.
 * @param {string} tripId
 * @returns {Promise<Object>}
 */
export const getTripById = async (tripId) => {
  const response = await client.get(`/trips/${tripId}`);
  return {
    ...normalizeTrip(response.data.trip),
    relatedTrips: (response.data.relatedTrips || []).map(normalizeTrip),
  };
};

/**
 * Creates a new trip reservation booking.
 * Backend requires checkIn/checkOut (not a single date) and computes the
 * price itself — checkOut defaults to the day after checkIn since the UI
 * only collects one travel date for now.
 * `referredBy` is the creator's user id when the booking started from a reel;
 * the backend owns validating it and awarding any commission.
 * @param {Object} bookingData - ({ tripId, travelersCount, startDate, paymentMethod, referredBy })
 * @returns {Promise<Object>}
 */
export const createBooking = async (bookingData) => {
  // The server computes the return date from the trip's length.
  const response = await client.post('/bookings', {
    tripId: bookingData.tripId,
    checkIn: bookingData.startDate,
    adults: bookingData.travelersCount,
    occupancy: bookingData.occupancy,
    paymentMethod: bookingData.paymentMethod,
    referredBy: bookingData.referredBy,
  });
  return normalizeBooking(response.data);
};

/**
 * Fetches all bookings made by the current authenticated user.
 * @returns {Promise<Array>}
 */
export const getMyBookings = async () => {
  const response = await client.get('/bookings');
  return (response.data || []).map(normalizeBooking);
};

/** Trips the user saved (♡), from MongoDB. */
export const getWishlist = async () =>
  ((await client.get('/users/wishlist')).data || []).map(normalizeTrip);

/** Saves / un-saves a trip. @returns {Promise<boolean>} saved now? */
export const toggleWishlist = async (tripId) =>
  Boolean((await client.post(`/users/wishlist/${tripId}`)).data?.wishlisted);

/** DEMO ONLY (server refuses in production): ends one of my trips now. */
export const demoCompleteBooking = async (bookingId) =>
  (await client.post(`/bookings/${bookingId}/demo-complete`)).data;
