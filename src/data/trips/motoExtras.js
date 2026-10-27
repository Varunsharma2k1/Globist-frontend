// Frontend-only detail for the Leh-Ladakh moto expedition (see
// tripExtras.js for the format). The API only lists 6 of its 10 days.

const meals2 = ['Breakfast', 'Dinner'];

export default {
  'Leh-Ladakh Moto Expedition': {
    places: ['Leh', 'Nubra Valley', 'Pangong'],
    startPoint: 'Leh',
    endPoint: 'Manali',
    highlights: [
      'Ride over Khardung La (5,359 m)',
      'Overnight by Pangong Tso',
      'Double-humped camels in Nubra',
      'Leh – Manali highway over Baralacha La',
    ],
    inclusions: [
      'Royal Enfield Himalayan with fuel',
      '9 nights: hotels, lakeside camp and highway camps',
      'Breakfast and dinner daily',
      'Ride captain, mechanic and backup vehicle',
      'Inner-line permits',
    ],
    exclusions: ['Flights to Leh', 'Riding gear', 'Lunches', 'Bike damage deposit'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival · Leh',
        description: 'Acclimatization day, Leh Market, Shanti Stupa.',
        stay: 'Hotel in Leh',
        meals: ['Dinner'],
      },
      {
        day: 2,
        title: 'Magnetic Hill & Confluence',
        description: 'Visit Magnetic Hill, Zanskar-Indus confluence.',
        stay: 'Hotel in Leh',
        meals: meals2,
      },
      {
        day: 3,
        title: 'Khardung La',
        description: 'Ride over Khardung La (5,359 m), descend to Nubra Valley.',
        stay: 'Camp in Hunder, Nubra',
        meals: meals2,
      },
      {
        day: 4,
        title: 'Nubra Valley',
        description: 'Diskit Monastery, double-humped camel ride.',
        activities: ['Diskit Monastery', 'Camel ride at Hunder'],
        stay: 'Camp in Hunder, Nubra',
        meals: meals2,
      },
      {
        day: 5,
        title: 'Pangong Lake',
        description: 'Ride to Pangong Tso lake, overnight lakeside camp.',
        stay: 'Lakeside camp, Pangong',
        meals: meals2,
      },
      {
        day: 6,
        title: 'Return to Leh',
        description: 'Return via Chang La pass.',
        stay: 'Hotel in Leh',
        meals: meals2,
      },
      {
        day: 7,
        title: 'Leh → Sarchu',
        description: 'Ride south over Taglang La and the More Plains to the high camps at Sarchu.',
        stay: 'Camp at Sarchu',
        meals: meals2,
      },
      {
        day: 8,
        title: 'Sarchu → Jispa',
        description: 'Cross Baralacha La and descend into the Bhaga valley for a riverside night.',
        stay: 'Riverside camp, Jispa',
        meals: meals2,
      },
      {
        day: 9,
        title: 'Jispa → Manali',
        description: 'Final ride through the Atal Tunnel down to Manali.',
        stay: 'Hotel in Manali',
        meals: meals2,
      },
      {
        day: 10,
        title: 'Departure · Manali',
        description: 'Hand back the motorcycles after breakfast. Expedition ends.',
        meals: ['Breakfast'],
      },
    ],
  },
};
