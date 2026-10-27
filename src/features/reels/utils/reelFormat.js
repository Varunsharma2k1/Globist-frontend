/**
 * Small pure helpers shared by the reel components — count/time formatting,
 * avatar initials, and the referral + share payloads built from a reel.
 */

/** 950 → "950", 12400 → "12.4K", 2100000 → "2.1M" */
export function formatCount(value) {
  const n = Number(value) || 0;
  if (n < 1000) return String(n);
  if (n < 1000000) return `${trimDecimal(n / 1000)}K`;
  return `${trimDecimal(n / 1000000)}M`;
}

function trimDecimal(n) {
  return n >= 100 ? Math.floor(n).toString() : (Math.floor(n * 10) / 10).toString();
}

/** Instagram-style relative time: "now", "5m", "3h", "2d", "4w". */
export function formatRelativeTime(timestamp) {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

/** "@auli_diaries" → "A", "Arjun Sharma" → "AS" */
export function initialsOf(name) {
  const clean = (name || '').replace(/^@/, '').trim();
  if (!clean) return '?';
  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function formatCreatorTier(tier) {
  if (!tier) return 'Creator';
  if (/creator/i.test(tier)) return tier;
  return `${tier.charAt(0).toUpperCase()}${tier.slice(1)} Creator`;
}

/**
 * Attribution context carried from a reel through TripDetail → Booking.
 * `referredBy` is the creator's user id — the field the backend's booking
 * endpoint already accepts. Returns undefined (a plain direct booking) when
 * the reel has no creator, or when the viewer is the creator themself so
 * nobody earns commission on their own booking. The backend stays the
 * authority on whether attribution is valid.
 *
 * @param {Object} reel
 * @param {string} [currentUserId]
 */
export function buildReferral(reel, currentUserId) {
  const creatorId = reel?.user?._id;
  if (!creatorId || creatorId === currentUserId) return undefined;
  return {
    referredBy: creatorId,
    creatorHandle: reel.creatorHandle,
    reelId: reel._id,
    agencyId: reel.agency?._id,
  };
}

/**
 * Text for the native share sheet. There's no public web URL or deep-link
 * scheme configured for the app yet, so this shares a descriptive message
 * rather than inventing a link.
 */
export function buildShareMessage(reel) {
  const handle = reel.creatorHandle || 'a Globist creator';
  const lines = [`🎥 ${handle} on Globist${reel.location ? ` — ${reel.location}` : ''}`];
  if (reel.caption) lines.push(`“${reel.caption}”`);
  if (reel.agency?.name) {
    const price = reel.agency.startingPrice
      ? ` · from ₹${Number(reel.agency.startingPrice).toLocaleString()}`
      : '';
    lines.push('', `Trip by ${reel.agency.name}${price}`);
  }
  lines.push('Watch the full reel and book it on the Globist app.');
  return lines.join('\n');
}
