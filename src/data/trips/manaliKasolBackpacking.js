// Reference package (frontend-only — not in the backend). Raw API shape so
// it goes through normalizeTrip like any other trip.
export default {
  _id: 'local-manali-kasol-backpacking',
  isLocal: true,
  name: 'Manali & Kasol Backpacking Trip',
  description:
    'Six days across two valleys — Old Manali’s hostels and waterfalls, then riverside camping in Kasol with village walks to Chalal and Tosh. Built for solo travellers and friend groups.',
  pricePerPerson: 7500,
  duration: 6,
  difficulty: 'moderate',
  groupSize: { min: 4, max: 20 },
  nextSlot: '2026-11-20',
  startPoint: 'Delhi',
  endPoint: 'Delhi',
  imageType: 'mountain',
  agency: {
    name: 'Kasol Adventure Camp',
    location: 'Kasol, Himachal Pradesh',
    rating: 4.6,
    reviewCount: 430,
    isVerified: true,
  },
  region: { name: 'Himachal Pradesh' },
  occupancyPricing: [
    { occupancy: 'quad', pricePerPerson: 7500 },
    { occupancy: 'triple', pricePerPerson: 8200 },
    { occupancy: 'double', pricePerPerson: 9500 },
    { occupancy: 'single', pricePerPerson: 12500 },
  ],
  highlights: [
    'Jogini Waterfall trek from Vashisht',
    'Atal Tunnel and Solang Valley',
    'Riverside camping on the Parvati in Kasol',
    'Village walks to Chalal and Tosh',
  ],
  inclusions: [
    'Delhi – Manali and Kasol – Delhi AC Volvo',
    '2 nights in a backpacker hostel, Old Manali',
    '1 night in a riverside camp, Kasol',
    '3 breakfasts and 3 dinners',
    'All transfers by tempo traveller',
    'Trek leader for Jogini and Tosh walks',
  ],
  exclusions: [
    'Solang activities and entry tickets',
    'Lunches and personal expenses',
    'Travel insurance',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Delhi → Manali overnight Volvo',
      description:
        'Board the AC Volvo from Delhi in the evening and meet the rest of the group on the road north.',
      stay: 'Overnight in Volvo',
      transfer: 'AC Volvo coach',
    },
    {
      day: 2,
      title: 'Old Manali & Jogini Waterfall trek',
      description:
        'Check in to the hostel, then an easy 3 km trek from Vashisht village to the Jogini waterfall. Evening bonfire and music in Old Manali.',
      activities: ['Jogini Waterfall trek', 'Vashisht village', 'Bonfire night'],
      stay: 'Backpacker hostel, Old Manali',
      meals: ['Dinner'],
    },
    {
      day: 3,
      title: 'Atal Tunnel & Solang Valley',
      description:
        'Day trip through the Atal Tunnel to Sissu, with a stop at Solang Valley for paragliding or the ropeway (own cost).',
      activities: ['Atal Tunnel drive', 'Sissu', 'Solang Valley'],
      stay: 'Backpacker hostel, Old Manali',
      meals: ['Breakfast', 'Dinner'],
      transfer: 'Tempo traveller',
    },
    {
      day: 4,
      title: 'Manali → Kasol · Manikaran Sahib',
      description:
        'Drive down into the Parvati Valley, stopping at the hot springs of Manikaran Sahib before checking in to riverside camps in Kasol.',
      activities: ['Manikaran Sahib Gurudwara', 'Kasol market'],
      stay: 'Riverside camp, Kasol',
      meals: ['Breakfast', 'Dinner'],
      transfer: 'Tempo traveller (approx. 3 hrs)',
    },
    {
      day: 5,
      title: 'Chalal & Tosh village walks · Departure',
      description:
        'Morning walk across the river to Chalal, then a drive to Tosh for views of the valley. Board the evening Volvo from Bhuntar to Delhi.',
      activities: ['Chalal village walk', 'Tosh village'],
      stay: 'Overnight in Volvo',
      meals: ['Breakfast'],
      transfer: 'AC Volvo coach',
    },
    {
      day: 6,
      title: 'Arrive in Delhi',
      description: 'Reach Delhi in the morning. Trip ends.',
    },
  ],
};
