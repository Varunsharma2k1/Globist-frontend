import client from './client';
import { normalizeTrip, normalizeBooking } from './normalize';

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
  const response = await client.get('/trips');
  return { trips: (response.data || []).map(normalizeTrip) };
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
  const checkIn = bookingData.startDate;
  let checkOut;
  const parsed = new Date(checkIn);
  if (!isNaN(parsed.getTime())) {
    parsed.setDate(parsed.getDate() + 1);
    checkOut = parsed.toISOString().slice(0, 10);
  }

  const response = await client.post('/bookings', {
    tripId: bookingData.tripId,
    checkIn,
    checkOut,
    adults: bookingData.travelersCount,
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
