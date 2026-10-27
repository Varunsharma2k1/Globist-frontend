// Frontend-only detail for trips the API already returns, keyed by the
// trip's exact backend `name`. Anything here is merged over the API trip in
// normalizeTrip; an `itinerary` here replaces the API's one entirely.
// `places` tags sub-locations a trip is in whose name isn't in its title
// (used for Explore destinations, not for text search).

const meals3 = ['Breakfast', 'Lunch', 'Dinner'];

export default {
  'Spiti Valley Expedition': {
    startPoint: 'Manali',
    endPoint: 'Manali',
    highlights: [
      'Alpine meadows of Solang Valley',
      'Glacial lake at Beas Kund (3,700 m)',
      'Ki Monastery and Chicham Bridge',
      'Night in a traditional Spitian homestay',
    ],
    inclusions: [
      '5 nights: hotel, alpine camps and homestay',
      'All meals during the trek and in Spiti',
      'Certified trek leader and support staff',
      'Tempo traveller for all road sections',
      'Inner-line permits',
    ],
    exclusions: ['Travel to and from Manali', 'Personal gear and porters', 'Travel insurance'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival · Manali',
        description: 'Pick-up from bus stand. Check-in, orientation and acclimatization walk.',
        activities: ['Trip briefing', 'Acclimatization walk'],
        stay: 'Hotel in Manali',
        meals: ['Dinner'],
      },
      {
        day: 2,
        title: 'Solang Valley Trek',
        description: '10 km trek through alpine meadows. Camping overnight.',
        activities: ['Solang meadows trek'],
        stay: 'Alpine camp, Dhundi',
        meals: meals3,
      },
      {
        day: 3,
        title: 'Beas Kund Summit',
        description: 'High altitude trek to glacial lake at 3,700 m elevation.',
        activities: ['Beas Kund lake'],
        stay: 'Alpine camp, Bakarthach',
        meals: meals3,
      },
      {
        day: 4,
        title: 'Rohtang Pass Crossing',
        description: 'Cross the legendary Rohtang Pass at 3,978 m. Visit Keylong.',
        activities: ['Rohtang Pass', 'Keylong'],
        stay: 'Guesthouse in Keylong',
        meals: meals3,
        transfer: 'Tempo traveller',
      },
      {
        day: 5,
        title: 'Spiti Valley Exploration',
        description: 'Visit Ki Monastery and Chicham Bridge. Local homestay.',
        activities: ['Ki Monastery', 'Chicham Bridge'],
        stay: 'Homestay in Kibber',
        meals: meals3,
        transfer: 'Tempo traveller',
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Morning meditation at monastery. Return to Manali.',
        meals: ['Breakfast'],
        transfer: 'Tempo traveller',
      },
    ],
  },

  'Chadar Frozen River Trek': {
    places: ['Zanskar', 'Chilling'],
    startPoint: 'Leh',
    endPoint: 'Leh',
    highlights: [
      'Walk on the frozen Zanskar river',
      'Frozen Nerak waterfall',
      'Nights in riverside caves and camps',
    ],
    inclusions: [
      '2 nights in a Leh guesthouse, 6 nights in camps',
      'All meals on the trek',
      'Trek leader, guides and porters for common gear',
      'Leh – Chilling – Leh transfers',
      'Wildlife and environment fees',
    ],
    exclusions: ['Flights to and from Leh', 'Personal gear rental', 'Travel insurance'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival · Leh',
        description: 'Acclimatization, gear check.',
        stay: 'Guesthouse in Leh',
        meals: ['Dinner'],
      },
      {
        day: 2,
        title: 'Drive to Chilling',
        description: 'Drive to trek starting point at Chilling village.',
        stay: 'Riverside camp',
        meals: meals3,
        transfer: 'Tempo traveller',
      },
      {
        day: 3,
        title: 'Frozen River Walk',
        description: 'Begin walking on the frozen Zanskar River.',
        stay: 'Riverside camp',
        meals: meals3,
      },
      {
        day: 4,
        title: 'Deep Canyon',
        description: 'Navigate through narrow ice canyon.',
        stay: 'Camp near Tibb cave',
        meals: meals3,
      },
      {
        day: 5,
        title: 'Nerak Waterfall',
        description: 'Reach the frozen Nerak waterfall — the ultimate reward.',
        activities: ['Nerak frozen waterfall'],
        stay: 'Camp at Nerak',
        meals: meals3,
      },
      {
        day: 6,
        title: 'Nerak → Tibb Cave',
        description: 'Begin the walk back downstream, camping near the Tibb caves.',
        stay: 'Camp near Tibb cave',
        meals: meals3,
      },
      {
        day: 7,
        title: 'Tibb → Shingra Koma',
        description: 'Continue over the ice to the last camp at Shingra Koma.',
        stay: 'Riverside camp',
        meals: meals3,
      },
      {
        day: 8,
        title: 'Back to Leh',
        description: 'Walk out to the road head and drive back to Leh for a hot shower.',
        stay: 'Guesthouse in Leh',
        meals: ['Breakfast', 'Lunch'],
        transfer: 'Tempo traveller',
      },
      {
        day: 9,
        title: 'Departure · Leh',
        description: 'Fly out of Leh. Trek ends.',
        meals: ['Breakfast'],
      },
    ],
  },
};
