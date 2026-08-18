/**
 * Curated trending destinations shown on the Explore map/radar, with real
 * coordinates so a bearing + distance can be computed from the user's live
 * location anywhere in the world.
 */
export const TRENDING_DESTINATIONS = [
  // South Asia
  { id: 'ladakh', name: 'Ladakh, India', tag: 'Mountains', lat: 34.1526, lng: 77.5771 },
  { id: 'manali', name: 'Manali, India', tag: 'Mountains', lat: 32.2432, lng: 77.1892 },
  { id: 'bir', name: 'Bir, India', tag: 'Paragliding', lat: 32.048, lng: 76.7247 },
  { id: 'spiti', name: 'Spiti Valley, India', tag: 'Mountains', lat: 32.2461, lng: 78.0349 },
  { id: 'rishikesh', name: 'Rishikesh, India', tag: 'Adventure', lat: 30.0869, lng: 78.2676 },
  { id: 'varanasi', name: 'Varanasi, India', tag: 'Heritage', lat: 25.3176, lng: 82.9739 },
  { id: 'kerala', name: 'Munnar, Kerala', tag: 'Backwaters', lat: 10.0889, lng: 77.0595 },
  { id: 'goa', name: 'Goa, India', tag: 'Beaches', lat: 15.2993, lng: 74.124 },
  { id: 'jaisalmer', name: 'Jaisalmer, India', tag: 'Desert', lat: 26.9157, lng: 70.9083 },
  { id: 'udaipur', name: 'Udaipur, India', tag: 'Luxury', lat: 24.5854, lng: 73.7125 },
  { id: 'maldives', name: 'Maldives', tag: 'Beaches', lat: 3.2028, lng: 73.2207 },
  { id: 'kathmandu', name: 'Kathmandu, Nepal', tag: 'Mountains', lat: 27.7172, lng: 85.324 },
  { id: 'sri-lanka', name: 'Ella, Sri Lanka', tag: 'Hills', lat: 6.8667, lng: 81.0466 },

  // Southeast & East Asia
  { id: 'bali', name: 'Bali, Indonesia', tag: 'Beaches', lat: -8.3405, lng: 115.092 },
  { id: 'bangkok', name: 'Bangkok, Thailand', tag: 'City', lat: 13.7563, lng: 100.5018 },
  { id: 'phuket', name: 'Phuket, Thailand', tag: 'Beaches', lat: 7.8804, lng: 98.3923 },
  { id: 'halong-bay', name: 'Ha Long Bay, Vietnam', tag: 'Nature', lat: 20.9101, lng: 107.1839 },
  { id: 'kyoto', name: 'Kyoto, Japan', tag: 'Heritage', lat: 35.0116, lng: 135.7681 },
  { id: 'tokyo', name: 'Tokyo, Japan', tag: 'City', lat: 35.6762, lng: 139.6503 },
  { id: 'seoul', name: 'Seoul, South Korea', tag: 'City', lat: 37.5665, lng: 126.978 },
  { id: 'boracay', name: 'Boracay, Philippines', tag: 'Beaches', lat: 11.9674, lng: 121.9248 },

  // Middle East
  { id: 'dubai', name: 'Dubai, UAE', tag: 'Luxury', lat: 25.2048, lng: 55.2708 },
  { id: 'petra', name: 'Petra, Jordan', tag: 'Heritage', lat: 30.3285, lng: 35.4444 },

  // Europe
  { id: 'santorini', name: 'Santorini, Greece', tag: 'Beaches', lat: 36.3932, lng: 25.4615 },
  { id: 'paris', name: 'Paris, France', tag: 'City', lat: 48.8566, lng: 2.3522 },
  { id: 'rome', name: 'Rome, Italy', tag: 'Heritage', lat: 41.9028, lng: 12.4964 },
  { id: 'amalfi', name: 'Amalfi Coast, Italy', tag: 'Beaches', lat: 40.634, lng: 14.6027 },
  { id: 'zermatt', name: 'Zermatt, Switzerland', tag: 'Mountains', lat: 46.0207, lng: 7.7491 },
  { id: 'reykjavik', name: 'Reykjavik, Iceland', tag: 'Nature', lat: 64.1466, lng: -21.9426 },
  { id: 'barcelona', name: 'Barcelona, Spain', tag: 'City', lat: 41.3874, lng: 2.1686 },

  // Africa
  { id: 'marrakech', name: 'Marrakech, Morocco', tag: 'Heritage', lat: 31.6295, lng: -7.9811 },
  { id: 'serengeti', name: 'Serengeti, Tanzania', tag: 'Safari', lat: -2.3333, lng: 34.8333 },
  { id: 'cape-town', name: 'Cape Town, South Africa', tag: 'Coastal', lat: -33.9249, lng: 18.4241 },
  { id: 'cairo', name: 'Cairo, Egypt', tag: 'Heritage', lat: 30.0444, lng: 31.2357 },

  // Oceania
  { id: 'sydney', name: 'Sydney, Australia', tag: 'City', lat: -33.8688, lng: 151.2093 },
  { id: 'queenstown', name: 'Queenstown, New Zealand', tag: 'Adventure', lat: -45.0312, lng: 168.6626 },

  // Americas
  { id: 'machu-picchu', name: 'Machu Picchu, Peru', tag: 'Heritage', lat: -13.1631, lng: -72.545 },
  { id: 'rio', name: 'Rio de Janeiro, Brazil', tag: 'Beaches', lat: -22.9068, lng: -43.1729 },
  { id: 'nyc', name: 'New York City, USA', tag: 'City', lat: 40.7128, lng: -74.006 },
  { id: 'grand-canyon', name: 'Grand Canyon, USA', tag: 'Nature', lat: 36.1069, lng: -112.1129 },
  { id: 'banff', name: 'Banff, Canada', tag: 'Mountains', lat: 51.1784, lng: -115.5708 },
  { id: 'cancun', name: 'Cancun, Mexico', tag: 'Beaches', lat: 21.1619, lng: -86.8515 },
];
