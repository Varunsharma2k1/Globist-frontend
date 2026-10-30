// Shared pieces for the Home-carousel place packages (see ./index.js).
//
// Agencies that already exist in the backend (Himalayan High Treks, Ganges
// Valley Treks, …) are swapped for their live records by mergeLocalTrips;
// the others are demo agencies until real listings replace them.

export const HIMACHAL = { name: 'Himachal Pradesh' };
export const UTTARAKHAND = { name: 'Uttarakhand' };

const AGENCIES = {
  himalayanHigh: {
    name: 'Himalayan High Treks',
    location: 'Manali, Himachal Pradesh',
    rating: 4.9,
    reviewCount: 1240,
    isVerified: true,
  },
  kasolCamp: {
    name: 'Kasol Adventure Camp',
    location: 'Kasol, Himachal Pradesh',
    rating: 4.6,
    reviewCount: 430,
    isVerified: true,
  },
  kinnaurTrails: {
    name: 'Kinnaur Trails Co.',
    location: 'Reckong Peo, Himachal Pradesh',
    rating: 4.7,
    reviewCount: 210,
    isVerified: true,
  },
  gangesValley: {
    name: 'Ganges Valley Treks',
    location: 'Rishikesh, Uttarakhand',
    rating: 4.8,
    reviewCount: 860,
    isVerified: true,
  },
  auliSnow: {
    name: 'Auli Snow Escapes',
    location: 'Joshimath, Uttarakhand',
    rating: 4.7,
    reviewCount: 390,
    isVerified: true,
  },
  garhwalSummit: {
    name: 'Garhwal Summit Treks',
    location: 'Dehradun, Uttarakhand',
    rating: 4.5,
    reviewCount: 175,
    isVerified: false,
  },
  nainitalLake: {
    name: 'Nainital Lake Retreats',
    location: 'Nainital, Uttarakhand',
    rating: 4.6,
    reviewCount: 320,
    isVerified: true,
  },
  kumaonTrails: {
    name: 'Kumaon Hill Trails',
    location: 'Almora, Uttarakhand',
    rating: 4.6,
    reviewCount: 140,
    isVerified: true,
  },
};

/** [title, description] pairs → itinerary days. */
export const days = (list) =>
  list.map(([title, description], i) => ({ day: i + 1, title, description }));

export const pkg = ({ id, place, region, agency, ...rest }) => ({
  _id: `local-${id}`,
  isLocal: true,
  places: [place],
  region,
  agency: AGENCIES[agency],
  groupSize: { min: 2, max: 16 },
  imageType: 'mountain',
  ...rest,
});
