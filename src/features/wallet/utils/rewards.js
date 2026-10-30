/**
 * Traveller reward rules (see the commission model: Triptape takes ~10% per
 * booking and shares part of it with travellers).
 *
 * - Reel reward: a traveller who posts a reel tagging the agency of a trip
 *   they completed earns 2% of that booking, capped at ₹500. One tagged reel
 *   per booking; untagged reels earn nothing and are unlimited.
 * - Referral reward: when someone books through a traveller's tagged reel,
 *   the traveller earns 0.5% of that booking once the trip is completed.
 *
 * Both are computed on the trip amount (travellers × per-person price),
 * excluding Triptape's service fee — the same base the agency commission is
 * charged on.
 */
export const REEL_REWARD_RATE = 0.02;
export const REEL_REWARD_CAP = 500;
export const REFERRAL_REWARD_RATE = 0.005;
// Product rule: the referral is paid once the referred traveller completes
// their trip. Off for now (testing): it's paid as soon as they book. Flip
// back to true to restore the completion check.
export const REFERRAL_AFTER_COMPLETION = false;

export const rewardBase = (booking) => booking?.subtotal ?? booking?.totalPrice ?? 0;

export const reelReward = (booking) =>
  Math.min(REEL_REWARD_CAP, Math.round(rewardBase(booking) * REEL_REWARD_RATE));

export const referralReward = (booking) => Math.round(rewardBase(booking) * REFERRAL_REWARD_RATE);
