/**
 * Featured regions on Home: Himachal Pradesh and Uttarakhand, in this order.
 *
 * The backend's `GET /api/regions/featured` supplies each region's id, trip
 * count and pricing. The photo (bundled in assets/home) and tagline for these
 * two are owned here, so the cards always have a Himalayan image — even if the API returns a
 * different photo, none, or can't be reached at all (the fallback entries
 * below then stand in for the missing records).
 */
const FEATURED = [
  {
    slug: 'himachal',
    fallback: { name: 'Himachal Pradesh', state: 'India', imageType: 'mountain' },
    image: require('../../assets/home/spiti-snow.jpg'),
    tagline: 'Pine valleys + snow peaks',
  },
  {
    slug: 'uttarakhand',
    fallback: { name: 'Uttarakhand', state: 'India', imageType: 'valley' },
    image: require('../../assets/home/uttarakhand-ridges.jpg'),
    tagline: 'Himalayan pilgrimage trails',
  },
];

export const FEATURED_REGION_SLUGS = FEATURED.map((f) => f.slug);

/**
 * Returns the two featured regions in order, each with its photo and tagline.
 * A region the API didn't return is replaced by a local placeholder (no id,
 * so tapping it opens the region screen by name only).
 */
export const pickFeaturedRegions = (regions = []) => {
  const list = Array.isArray(regions) ? regions : [];
  return FEATURED.map(({ slug, fallback, image, tagline }) => {
    const hit = list.find((r) => `${r?.name || ''}`.toLowerCase().includes(slug));
    return { ...fallback, ...hit, image, tagline };
  });
};
