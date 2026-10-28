/**
 * Travel communities people can join (frontend-only demo data, like the other
 * local datasets). Covers are bundled photos from assets/home.
 * `members` / `online` are base counts; joining adds you to the member count.
 */
export const COMMUNITY_CATEGORIES = [
  'All',
  'Trekking',
  'Offbeat',
  'Solo',
  'Road trips',
  'Stays & food',
  'Photography',
];

export const POST_FLAIRS = ['Question', 'Trek Report', 'Photo', 'Tips', 'Hidden gem', 'Meet-up'];

export const COMMUNITIES = [
  {
    id: 'kedarkantha-club',
    name: 'Kedarkantha Trekking Club',
    handle: 'KedarkanthaClub',
    category: 'Trekking',
    tagline: 'Summit reports, batch buddies and gear checklists',
    about:
      'Everything for the classic winter trek in Uttarakhand: honest trek reports, packing lists, fitness plans and people to share a batch with.',
    members: 18420,
    online: 312,
    cover: require('../../assets/home/kedarkantha-peak.jpg'),
  },
  {
    id: 'offbeat-himalaya',
    name: 'Offbeat Himalaya Collective',
    handle: 'OffbeatHimalaya',
    category: 'Offbeat',
    tagline: 'Villages, passes and valleys nobody put on a billboard',
    about:
      'A club for the quiet side of the mountains: Kinnaur, Pithoragarh, Tirthan and beyond. Share routes, homestays and places that deserve to stay uncrowded.',
    members: 9730,
    online: 148,
    cover: require('../../assets/home/kalpa-kinnaur.jpg'),
  },
  {
    id: 'solo-trippies',
    name: 'Solo Trippies India',
    handle: 'SoloTrippies',
    category: 'Solo',
    tagline: 'Travelling alone, never lonely',
    about:
      'Plans, safety tips and weekend meet-ups for people who travel solo. New here? Say hi and tell us where you are headed next.',
    members: 24110,
    online: 521,
    cover: require('../../assets/home/rishikesh-ganges.jpg'),
  },
  {
    id: 'spiti-riders',
    name: 'Spiti & Ladakh Riders',
    handle: 'SpitiRiders',
    category: 'Road trips',
    tagline: 'Road conditions, routes and rides above 4,000 m',
    about:
      'Live road updates, bike setups, permits and itineraries for riders heading up to Spiti, Ladakh and the passes in between.',
    members: 15340,
    online: 203,
    cover: require('../../assets/home/spiti-snow.jpg'),
  },
  {
    id: 'homestay-hunters',
    name: 'Homestay Hunters',
    handle: 'HomestayHunters',
    category: 'Stays & food',
    tagline: 'Cosy homestays, hidden cafés and the best chai stops',
    about:
      'Real stays run by real families, plus the cafés and kitchens worth a detour. Prices, hosts and what to order.',
    members: 7210,
    online: 96,
    cover: require('../../assets/home/munsiyari-panchachuli.jpg'),
  },
  {
    id: 'monsoon-trails',
    name: 'Monsoon Trails',
    handle: 'MonsoonTrails',
    category: 'Trekking',
    tagline: 'Valley of Flowers, waterfalls and everything green',
    about:
      'Treks and walks that come alive in the rains. Bloom updates, leech survival tips and trail conditions from people on the ground.',
    members: 6840,
    online: 71,
    cover: require('../../assets/home/valley-of-flowers.jpg'),
  },
  {
    id: 'frames-himalaya',
    name: 'Frames from the Himalaya',
    handle: 'FramesHimalaya',
    category: 'Photography',
    tagline: 'Golden hours, blue hours and the shots in between',
    about:
      'Landscape and travel photography from the mountains. Post your frames, swap settings and plan sunrise shoots together.',
    members: 11890,
    online: 134,
    cover: require('../../assets/home/uttarakhand-ridges.jpg'),
  },
];

export const getCommunity = (id) => COMMUNITIES.find((c) => c.id === id) || null;
