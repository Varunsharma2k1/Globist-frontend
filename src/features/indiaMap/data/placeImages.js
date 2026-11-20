/**
 * Bundled photos for places we have real pictures of (keyed by place id).
 * Any place can instead send `image: "https://..."` from the API; that wins.
 * Places without either get a placeholder tile — never a photo of somewhere else.
 */
export const PLACE_IMAGES = {
  kalpa: require('../../../../assets/home/kalpa-kinnaur.jpg'),
  rishikesh: require('../../../../assets/home/rishikesh-ganges.jpg'),
  spiti: require('../../../../assets/home/spiti-snow.jpg'),
  'valley-of-flowers': require('../../../../assets/home/valley-of-flowers.jpg'),
};

/** Image source for a place, or null for the placeholder. */
export function placeImage(place) {
  if (place?.image) return { uri: place.image };
  return PLACE_IMAGES[place?.id] || null;
}
