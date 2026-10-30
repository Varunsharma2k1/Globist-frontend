import { reelReward, referralReward, REFERRAL_AFTER_COMPLETION } from './rewards';
import { todayIso } from '../../booking/utils/departures';

/**
 * Pure state transitions for the on-device trip ledger: bookings, the reels
 * travellers post about them, and the wallet credits those earn. Kept free
 * of React/storage so the rules live in one place (TripLedgerContext just
 * persists whatever these return).
 *
 * Every record carries its owner's user id, so several accounts signed in on
 * the same device each see their own trips and wallet — which is also what
 * makes the reel-referral flow (user A posts, user B books) testable on one
 * phone until the backend owns this.
 */

export const EMPTY_LEDGER = { bookings: [], reels: [], transactions: [] };

const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

const handleOf = (user) => `@${(user?.name || 'explorer').toLowerCase().replace(/\s+/g, '_')}`;

/** Trip fields worth keeping on a booking (skips relatedTrips etc.). */
const tripSnapshot = (trip) => {
  const { relatedTrips, ...rest } = trip || {};
  return rest;
};

const balanceOf = (state, userId) =>
  state.transactions.filter((t) => t.userId === userId).reduce((sum, t) => sum + t.amount, 0);

/**
 * Records a paid booking. `walletUsed` (1 point = ₹1) is spent from the
 * booker's wallet towards `totalPrice` — never more than their balance or
 * the total — and logged as a negative 'redeem' entry; `amountPaid` is the
 * rest.
 */
export function addBooking(state, { user, trip, walletUsed = 0, ...details }) {
  const redeemed = Math.max(
    0,
    Math.min(Math.round(walletUsed), balanceOf(state, user._id), details.totalPrice || 0)
  );
  const booking = {
    _id: newId('TT-BK'),
    isLocal: true,
    userId: user._id,
    userName: user.name,
    trip: tripSnapshot(trip),
    agency: trip?.agency || null,
    ...details, // startDate, endDate, travelersCount, occupancy, prices, referral, backendId
    walletUsed: redeemed,
    amountPaid: (details.totalPrice || 0) - redeemed,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentRef: newId('PAY'),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    completedAt: null,
    reelId: null,
  };
  const transactions = redeemed
    ? [
        {
          _id: newId('TX'),
          type: 'redeem',
          userId: user._id,
          amount: -redeemed,
          bookingId: booking._id,
          tripTitle: booking.trip?.title,
          createdAt: booking.createdAt,
        },
        ...state.transactions,
      ]
    : state.transactions;
  const next = { ...state, bookings: [booking, ...state.bookings], transactions };
  return {
    state: REFERRAL_AFTER_COMPLETION ? next : payReferral(next, booking._id),
    booking: next.bookings[0],
  };
}

/**
 * Pays the 0.5% referral to the traveller whose reel a booking came through
 * (never to the booker themself). Paid at most once per booking.
 */
function payReferral(state, bookingId) {
  const booking = state.bookings.find((b) => b._id === bookingId);
  const ref = booking?.referral;
  if (!ref?.referredBy || ref.referredBy === booking.userId || booking.referralPaid) return state;

  return {
    ...state,
    bookings: state.bookings.map((b) => (b._id === bookingId ? { ...b, referralPaid: true } : b)),
    transactions: [
      {
        _id: newId('TX'),
        type: 'referral',
        userId: ref.referredBy,
        amount: referralReward(booking),
        bookingId,
        reelId: ref.reelId || null,
        tripTitle: booking.trip?.title,
        fromName: booking.userName,
        createdAt: new Date().toISOString(),
      },
      ...state.transactions,
    ],
  };
}

/**
 * Marks a booking's trip as completed and pays its referral if that hasn't
 * happened yet (it normally has unless REFERRAL_AFTER_COMPLETION). Idempotent.
 */
export function completeBooking(state, bookingId) {
  const booking = state.bookings.find((b) => b._id === bookingId);
  if (!booking || booking.status !== 'confirmed') return state;

  const completedAt = new Date().toISOString();
  const next = {
    ...state,
    bookings: state.bookings.map((b) =>
      b._id === bookingId ? { ...b, status: 'completed', completedAt } : b
    ),
  };
  return payReferral(next, bookingId);
}

/** Completes every confirmed booking whose last trip day is in the past. */
export function settleFinishedTrips(state) {
  const today = todayIso();
  return state.bookings
    .filter((b) => b.status === 'confirmed' && b.endDate && b.endDate < today)
    .reduce((acc, b) => completeBooking(acc, b._id), state);
}

/** Why `user` can't tag `booking` in a reel, or null when they can. */
export function reelLinkProblem(booking, user) {
  if (!booking) return 'That booking no longer exists.';
  if (booking.userId !== user?._id) return 'You can only tag trips you booked.';
  if (booking.status !== 'completed') return 'You can tag this trip once it is completed.';
  if (booking.reelId) return 'You have already posted a reel for this trip.';
  return null;
}

/**
 * Adds a reel. When `bookingId` is given the reel is tagged to that
 * booking's agency + trip: it must be a completed trip of the poster's that
 * has no reel yet, and the poster earns 2% (capped) in their wallet.
 * Untagged reels have no limit and earn nothing.
 *
 * @returns {{ state, reel, reward: number }}
 */
export function addReel(state, { user, bookingId, ...fields }) {
  const booking = bookingId ? state.bookings.find((b) => b._id === bookingId) : null;
  if (bookingId) {
    const problem = reelLinkProblem(booking, user);
    if (problem) throw new Error(problem);
  }

  const reel = {
    _id: newId('REEL'),
    isLocal: true,
    user: { _id: user._id, name: user.name },
    creatorHandle: handleOf(user),
    creatorTier: user.explorerTier || 'bronze',
    likes: 0,
    comments: 0,
    shares: 0,
    ...fields, // caption, location, mediaUrl, imageType, backendId
    isAffiliate: Boolean(booking),
    agency: booking?.agency || null,
    trip: booking ? { _id: booking.trip?._id, title: booking.trip?.title } : null,
    bookingId: booking?._id || null,
    createdAt: new Date().toISOString(),
  };

  const reward = booking ? reelReward(booking) : 0;
  const next = {
    ...state,
    reels: [reel, ...state.reels],
    bookings: booking
      ? state.bookings.map((b) => (b._id === booking._id ? { ...b, reelId: reel._id } : b))
      : state.bookings,
    transactions: booking
      ? [
          {
            _id: newId('TX'),
            type: 'reel',
            userId: user._id,
            amount: reward,
            bookingId: booking._id,
            reelId: reel._id,
            tripTitle: booking.trip?.title,
            agencyName: booking.agency?.name,
            createdAt: reel.createdAt,
          },
          ...state.transactions,
        ]
      : state.transactions,
  };
  return { state: next, reel, reward };
}

/** Balance, credits and still-to-come earnings for one user. */
export function walletFor(state, userId) {
  const transactions = state.transactions.filter((t) => t.userId === userId);
  const balance = balanceOf(state, userId);

  // Bookings made through this user's reels whose trip hasn't finished yet.
  const pendingReferrals = state.bookings
    .filter((b) => b.referral?.referredBy === userId && b.status === 'confirmed' && !b.referralPaid)
    .map((b) => ({ booking: b, amount: referralReward(b) }));

  // Completed trips of theirs that can still earn a reel reward.
  const unclaimedReels = state.bookings
    .filter((b) => b.userId === userId && b.status === 'completed' && !b.reelId)
    .map((b) => ({ booking: b, amount: reelReward(b) }));

  return { balance, transactions, pendingReferrals, unclaimedReels };
}
