// Reference package (frontend-only — not in the backend). Raw API shape so
// it goes through normalizeTrip like any other trip.
export default {
  _id: 'local-manali-snow-escape',
  isLocal: true,
  name: 'Manali Snow Escape: Solang Valley & Atal Tunnel',
  description:
    'A relaxed 5-day winter getaway from Delhi — snow play at Solang Valley, a drive through the Atal Tunnel to Sissu, Hadimba Temple and the café lanes of Old Manali, with a trip captain throughout.',
  pricePerPerson: 6000,
  duration: 5,
  difficulty: 'easy',
  groupSize: { min: 2, max: 16 },
  nextSlot: '2026-12-12',
  startPoint: 'Delhi',
  endPoint: 'Delhi',
  imageType: 'snow',
  isFeatured: true,
  // Snapshot; swapped for the live agency/region objects when the API
  // returns a trip by the same agency / in the same region.
  agency: {
    name: 'Himalayan High Treks',
    location: 'Manali, Himachal Pradesh',
    rating: 4.9,
    reviewCount: 1240,
    isVerified: true,
  },
  region: { name: 'Himachal Pradesh' },
  occupancyPricing: [
    { occupancy: 'quad', pricePerPerson: 6000 },
    { occupancy: 'triple', pricePerPerson: 6500 },
    { occupancy: 'double', pricePerPerson: 7500 },
    { occupancy: 'single', pricePerPerson: 10500 },
  ],
  highlights: [
    'Snow activities at Solang Valley',
    'Drive through the 9 km Atal Tunnel to Sissu',
    'Hadimba Devi Temple and Vashisht hot springs',
    'Café hopping in Old Manali',
  ],
  inclusions: [
    'Delhi – Manali – Delhi AC Volvo',
    '3 nights in a 3★ hotel in Manali',
    '3 breakfasts and 3 dinners',
    'Sightseeing by private tempo traveller',
    'Trip captain throughout',
  ],
  exclusions: [
    'Snow activity and ropeway tickets at Solang',
    'Lunches and personal expenses',
    'Rohtang Pass permit (if opted)',
    'Anything not listed under inclusions',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Delhi → Manali overnight Volvo',
      description:
        'Meet the group at Majnu ka Tilla in the evening and board the AC Volvo for the overnight drive into the mountains.',
      stay: 'Overnight in Volvo',
      transfer: 'AC Volvo coach',
    },
    {
      day: 2,
      title: 'Arrive in Manali · Hadimba Temple & Mall Road',
      description:
        'Reach Manali by late morning and check in. After lunch, walk through the deodar forest to Hadimba Devi Temple, soak in the Vashisht hot springs and spend the evening on Mall Road.',
      activities: ['Hadimba Devi Temple', 'Vashisht hot springs', 'Mall Road walk'],
      stay: 'Hotel in Manali (3★)',
      meals: ['Dinner'],
      transfer: 'Private tempo traveller',
    },
    {
      day: 3,
      title: 'Solang Valley & Atal Tunnel',
      description:
        'Drive through the Atal Tunnel to the snowy Lahaul side and the frozen Sissu waterfall, then stop at Solang Valley on the way back for skiing, snow scooters or the ropeway.',
      activities: ['Atal Tunnel drive', 'Sissu waterfall viewpoint', 'Snow activities at Solang'],
      stay: 'Hotel in Manali (3★)',
      meals: ['Breakfast', 'Dinner'],
      transfer: 'Private tempo traveller',
    },
    {
      day: 4,
      title: 'Old Manali cafés · Evening departure',
      description:
        'Check out after breakfast and wander Old Manali — Manu Temple, the Tibetan monastery and riverside cafés. Board the evening Volvo back to Delhi.',
      activities: ['Manu Temple', 'Tibetan monastery', 'Old Manali café trail'],
      stay: 'Overnight in Volvo',
      meals: ['Breakfast'],
      transfer: 'AC Volvo coach',
    },
    {
      day: 5,
      title: 'Arrive in Delhi',
      description: 'Reach Delhi early morning. Trip ends with memories (and photos) of the snow.',
    },
  ],
};
