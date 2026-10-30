// Munsiyari, Pithoragarh: packages from several agencies (frontend-only, see ./index.js).
import { UTTARAKHAND, days, pkg } from './shared';

export default [
  pkg({
    id: 'munsiyari-khaliya-trek',
    place: 'Munsiyari',
    region: UTTARAKHAND,
    agency: 'kumaonTrails',
    name: 'Munsiyari & Khaliya Top Trek',
    description:
      'Face the Panchachuli peaks from Munsiyari and trek to the meadows of Khaliya Top for a camp under the stars.',
    pricePerPerson: 13000,
    duration: 6,
    difficulty: 'moderate',
    nextSlot: '2026-11-14',
    startPoint: 'Kathgodam',
    endPoint: 'Kathgodam',
    highlights: ['Panchachuli views', 'Khaliya Top meadow camp', 'Birthi falls'],
    inclusions: ['Kathgodam transfers', '4 nights stay + 1 camp', 'All meals', 'Guide'],
    exclusions: ['Train/flight to Kathgodam'],
    itinerary: days([
      ['Kathgodam → Chaukori', 'Drive through the Kumaon hills.'],
      ['Chaukori → Munsiyari', 'Via Birthi falls to Munsiyari.'],
      ['Khaliya Top trek', 'Trek up to the meadow camp.'],
      ['Descend to Munsiyari', 'Sunrise on Panchachuli, descend.'],
      ['Munsiyari → Almora', 'Drive back to Almora.'],
      ['Almora → Kathgodam', 'Drop at Kathgodam. Trip ends.'],
    ]),
  }),
  pkg({
    id: 'munsiyari-panchachuli-getaway',
    place: 'Munsiyari',
    region: UTTARAKHAND,
    agency: 'nainitalLake',
    name: 'Munsiyari Panchachuli View Getaway',
    description:
      'A relaxed five-day drive-in getaway with mountain-view stays, village walks and the Nanda Devi temple.',
    pricePerPerson: 11500,
    duration: 5,
    difficulty: 'easy',
    nextSlot: '2026-11-21',
    startPoint: 'Nainital',
    endPoint: 'Nainital',
    highlights: ['Panchachuli sunrise', 'Darkot weaving village', 'Nanda Devi temple'],
    inclusions: ['Private cab', '4 nights view rooms', 'Breakfast & dinner'],
    exclusions: ['Lunches'],
    itinerary: days([
      ['Nainital → Chaukori', 'Drive to Chaukori tea gardens.'],
      ['Chaukori → Munsiyari', 'Scenic drive past Birthi falls.'],
      ['Munsiyari village walks', 'Darkot village and the Nanda Devi temple.'],
      ['Munsiyari → Binsar', 'Drive to Binsar forest.'],
      ['Binsar → Nainital', 'Back to Nainital. Trip ends.'],
    ]),
  }),
];
