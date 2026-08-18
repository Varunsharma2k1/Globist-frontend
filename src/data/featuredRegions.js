/**
 * Featured regions allowlist.
 *
 * The backend exposes `GET /api/regions/featured` which already returns only
 * the curated two featured regions (Himachal + Uttarakhand) sorted in the
 * order we want. This file owns the frontend's interest in ordering and
 * provides a stable `match` key that other screens (if they ever need it)
 * can use to align server records with frontend metadata.
 *
 * Image URLs and taglines now come from the backend per record — see
 * `Region.imageUrl` + `Region.tagline` in server/models/Region.js and
 * `normalizeRegion` in src/api/normalize.js. The frontend no longer carries
 * any imagery data of its own.
 */

export const FEATURED_REGION_SLUGS = ['himachal', 'uttarakhand'];

/**
 * Returns the curated featured regions in the order they appear on the home
 * screen. Acts as a defensive pass-through: if for some reason the API
 * returns an out-of-order or extra region, this snaps it back to the curated
 * list and order.
 */
export const pickFeaturedRegions = (regions = []) => {
  if (!Array.isArray(regions)) return [];
  const lookup = regions.map((r) => ({
    region: r,
    haystack: `${r && r.name ? r.name : ''}`.toLowerCase(),
  }));
  return FEATURED_REGION_SLUGS.map((slug) => {
    const hit = lookup.find((row) => row.haystack.includes(slug));
    return hit ? hit.region : null;
  }).filter(Boolean);
};
