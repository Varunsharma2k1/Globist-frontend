/* eslint-disable max-lines -- demo content table */
/**
 * Demo posts and comments for each community (frontend-only). `hoursAgo` is
 * how old the post is; `commentCount` is the thread's total, `comments` the
 * ones loaded on the post page.
 */
const c = (id, handle, hoursAgo, text, likes = 0) => ({ id, handle, hoursAgo, text, likes });

export const COMMUNITY_POSTS = [
  // ---- Kedarkantha Trekking Club
  {
    id: 'p-kk-1',
    communityId: 'kedarkantha-club',
    handle: 'arjun_treks',
    hoursAgo: 5,
    flair: 'Trek Report',
    title: 'Summited Kedarkantha last weekend: my honest 6-day breakdown',
    body: 'Batch of 14, minus 12°C at base camp and easily the best sunrise of my life. Juda ka Talab was frozen solid.\n\nDay 1: Sankri to Juda ka Talab, easy 4 km.\nDay 2: on to Kedarkantha base, steady climb.\nDay 3: summit push at 2 am, about 6 hours round trip.\n\nCarry gaiters. The trail turns slippery after 3 am.',
    image: require('../../assets/home/kedarkantha-peak.jpg'),
    score: 842,
    commentCount: 126,
    comments: [
      c(
        'c1',
        'meera.wanders',
        4,
        'This is the report I needed. Did you rent microspikes or carry your own?',
        41
      ),
      c(
        'c2',
        'arjun_treks',
        4,
        'Rented at Sankri for ₹200 a day. Worth every rupee on summit day.',
        28
      ),
      c(
        'c3',
        'pahadi_priya',
        3,
        'That sunrise photo, though. Booking my December batch right now.',
        17
      ),
    ],
  },
  {
    id: 'p-kk-2',
    communityId: 'kedarkantha-club',
    handle: 'the_slow_trekker',
    hoursAgo: 22,
    flair: 'Tips',
    title: 'Gear that actually mattered (and 3 things I wasted money on)',
    body: 'Mattered: two thermal layers, a balaclava, microspikes and trekking poles.\n\nWasted: a cotton hoodie, a 20,000 mAh power bank (the cold drains it anyway) and fancy sunglasses. Rent the rest and save the cash for hot chai.',
    score: 531,
    commentCount: 74,
    comments: [
      c('c4', 'rohan_on_wheels', 20, 'Add a pair of dry socks for sleeping. Game changer.', 63),
      c(
        'c5',
        'ananya_clicks',
        18,
        'Counterpoint: sunglasses are not optional on the snow. Snow blindness is real.',
        22
      ),
    ],
  },
  {
    id: 'p-kk-3',
    communityId: 'kedarkantha-club',
    handle: 'first_timer_vik',
    hoursAgo: 2,
    flair: 'Question',
    title: 'Is Kedarkantha doable in January as a first trek?',
    body: 'I run 5k three times a week but have never been above 3,000 m. Worried about the cold and the altitude. Should I wait for spring?',
    score: 214,
    commentCount: 58,
    comments: [
      c(
        'c6',
        'arjun_treks',
        1,
        'Very doable. Start fitness work 4 weeks out and drink water like it is your job.',
        35
      ),
      c(
        'c7',
        'meera.wanders',
        1,
        'January is the prettiest month. Just pack properly and listen to your guide.',
        19
      ),
    ],
  },
  // ---- Offbeat Himalaya Collective
  {
    id: 'p-oh-1',
    communityId: 'offbeat-himalaya',
    handle: 'kinnauri_kabir',
    hoursAgo: 9,
    flair: 'Hidden gem',
    title: 'Kalpa on a weekday: the Kinnaur Kailash view with zero crowd',
    body: 'Walked the old village lanes at golden hour and had the whole ridge to myself. The apple orchards are just turning and the temple bells carry across the valley.',
    image: require('../../assets/home/kalpa-kinnaur.jpg'),
    score: 689,
    commentCount: 91,
    comments: [
      c(
        'c8',
        'solo_sneha',
        8,
        'Adding this to my October list. Any homestay you would recommend?',
        30
      ),
      c(
        'c9',
        'kinnauri_kabir',
        7,
        'Ask for Tashi’s place near the Narayan Nagini temple. Dinner included.',
        24
      ),
    ],
  },
  {
    id: 'p-oh-2',
    communityId: 'offbeat-himalaya',
    handle: 'budget_baba',
    hoursAgo: 30,
    flair: 'Tips',
    title: '9 days, Chitkul to Kaza by bus and shared taxi, ₹14k all in',
    body: 'Chitkul, Nako, Tabo, Kaza, on public transport with homestays only. Full day-by-day costs in the comments if anyone wants the sheet.',
    score: 457,
    commentCount: 63,
    comments: [c('c10', 'solo_sneha', 28, 'Yes please, drop the sheet!', 12)],
  },
  {
    id: 'p-oh-3',
    communityId: 'offbeat-himalaya',
    handle: 'curious_chirag',
    hoursAgo: 12,
    flair: 'Question',
    title: 'Munsiyari in the off-season: worth the long drive?',
    body: 'Thinking of going in late November. Are the Panchachuli views still clear, and are homestays open?',
    image: require('../../assets/home/munsiyari-panchachuli.jpg'),
    score: 188,
    commentCount: 37,
    comments: [
      c(
        'c11',
        'pahadi_priya',
        10,
        'November is perfect. Crisp mornings and the peaks are sharp.',
        26
      ),
    ],
  },
  // ---- Solo Trippies India
  {
    id: 'p-st-1',
    communityId: 'solo-trippies',
    handle: 'solo_sneha',
    hoursAgo: 6,
    flair: 'Tips',
    title: 'Three weeks solo across Uttarakhand: what I would tell my past self',
    body: 'Book the first night, not the whole trip. Share your live location with one person. Talk to the homestay host, they know the safest shortcuts and the best food.\n\nAnd go slower than you think you should.',
    score: 1204,
    commentCount: 212,
    comments: [
      c(
        'c12',
        'meera.wanders',
        5,
        'The point about the first night only is gold. Saved this post.',
        88
      ),
      c(
        'c13',
        'first_timer_vik',
        4,
        'Needed to read this before my first solo trip next month. Thank you!',
        31
      ),
    ],
  },
  {
    id: 'p-st-2',
    communityId: 'solo-trippies',
    handle: 'rishikesh_rohit',
    hoursAgo: 3,
    flair: 'Meet-up',
    title: 'Rishikesh meet-up this Saturday: chai by the Ganga at 5 pm',
    body: 'Casual hangout for anyone passing through. No agenda, just chai, stories and trip swaps. Comment if you are in.',
    image: require('../../assets/home/rishikesh-ganges.jpg'),
    score: 356,
    commentCount: 48,
    comments: [c('c14', 'solo_sneha', 2, 'In! Coming from Dehradun, see you there.', 14)],
  },
  {
    id: 'p-st-3',
    communityId: 'solo-trippies',
    handle: 'backpack_bhavna',
    hoursAgo: 40,
    flair: 'Question',
    title: 'Hostels in Kasol that are not just party central?',
    body: 'Looking for somewhere calm with a good common area to meet people. Preferably near the river.',
    score: 142,
    commentCount: 29,
    comments: [
      c(
        'c15',
        'budget_baba',
        38,
        'Try the ones in Chalal. Quieter, and a short riverside walk away.',
        20
      ),
    ],
  },
  // ---- Spiti & Ladakh Riders
  {
    id: 'p-sr-1',
    communityId: 'spiti-riders',
    handle: 'rohan_on_wheels',
    hoursAgo: 7,
    flair: 'Tips',
    title: 'Manali to Kaza via Kunzum: road conditions right now',
    body: 'Rohtang side is smooth till Gramphoo, then loose gravel for about 40 km. Water crossings after Batal are shallow in the morning and ankle-deep by afternoon. Start early.',
    image: require('../../assets/home/spiti-snow.jpg'),
    score: 774,
    commentCount: 102,
    comments: [c('c16', 'curious_chirag', 6, 'Thanks. Is Kunzum open to cars as well?', 9)],
  },
  {
    id: 'p-sr-2',
    communityId: 'spiti-riders',
    handle: 'moto_mandeep',
    hoursAgo: 52,
    flair: 'Question',
    title: 'Luggage setup for 10 days on a Himalayan 411?',
    body: 'Saddlebags plus a tail bag, or two soft panniers? Trying to keep it under 18 kg.',
    score: 203,
    commentCount: 44,
    comments: [
      c(
        'c17',
        'rohan_on_wheels',
        50,
        'Soft panniers plus a dry bag on the pillion seat. Keeps the weight low.',
        33
      ),
    ],
  },
  // ---- Homestay Hunters
  {
    id: 'p-hh-1',
    communityId: 'homestay-hunters',
    handle: 'pahadi_priya',
    hoursAgo: 14,
    flair: 'Hidden gem',
    title: 'Tiny homestay above Munsiyari, ₹900 a night, best rajma ever',
    body: 'Two rooms, a wood stove and a host who insists you eat second helpings. The Panchachuli view from the porch is unreal.',
    image: require('../../assets/home/munsiyari-panchachuli.jpg'),
    score: 612,
    commentCount: 55,
    comments: [
      c('c18', 'kinnauri_kabir', 12, 'Name and number please! This is exactly what I want.', 21),
    ],
  },
  {
    id: 'p-hh-2',
    communityId: 'homestay-hunters',
    handle: 'cafe_crawler',
    hoursAgo: 60,
    flair: 'Tips',
    title: 'My top 5 hidden cafés in Jibhi and Tirthan',
    body: 'Cafés in apple orchards, one inside a 100-year-old wooden house. Full list with what to order is in the comments.',
    score: 391,
    commentCount: 40,
    comments: [c('c19', 'solo_sneha', 58, 'Saving this for my trip next week!', 11)],
  },
  // ---- Monsoon Trails
  {
    id: 'p-mt-1',
    communityId: 'monsoon-trails',
    handle: 'ananya_clicks',
    hoursAgo: 18,
    flair: 'Photo',
    title: 'Valley of Flowers in full bloom, first week of August',
    body: 'Walked in from Ghangaria at 7 am and had the meadow nearly to ourselves. The pink balsam was everywhere.',
    image: require('../../assets/home/valley-of-flowers.jpg'),
    score: 953,
    commentCount: 84,
    comments: [c('c20', 'meera.wanders', 16, 'Stunning. What lens was this?', 15)],
  },
  {
    id: 'p-mt-2',
    communityId: 'monsoon-trails',
    handle: 'wet_socks_wanderer',
    hoursAgo: 80,
    flair: 'Question',
    title: 'Leeches on the Hemkund trail: what actually worked for you?',
    body: 'Salt, tobacco or just long socks? I have heard all the folk remedies.',
    score: 167,
    commentCount: 33,
    comments: [
      c(
        'c21',
        'arjun_treks',
        78,
        'Long socks tucked over your trousers, plus a little salt on the shoes.',
        27
      ),
    ],
  },
  // ---- Frames from the Himalaya
  {
    id: 'p-fh-1',
    communityId: 'frames-himalaya',
    handle: 'ananya_clicks',
    hoursAgo: 10,
    flair: 'Photo',
    title: 'Blue hour over the Garhwal ridges',
    body: 'Shot just before sunrise, 35 mm at f/8, three bracketed exposures. The mist rolled in for about two minutes.',
    image: require('../../assets/home/uttarakhand-ridges.jpg'),
    score: 1120,
    commentCount: 97,
    comments: [
      c('c22', 'solo_sneha', 9, 'The layers of blue are so calm. Wallpaper material.', 38),
    ],
  },
  {
    id: 'p-fh-2',
    communityId: 'frames-himalaya',
    handle: 'lens_and_lakes',
    hoursAgo: 36,
    flair: 'Tips',
    title: 'Shooting sunrise at Munsiyari: settings that worked for Panchachuli',
    body: 'Tripod, f/11, ISO 100, and wait for the first light to hit the tips. Bracket the exposure, the sky will fool your meter.',
    image: require('../../assets/home/munsiyari-panchachuli.jpg'),
    score: 478,
    commentCount: 41,
    comments: [
      c('c23', 'curious_chirag', 34, 'Thank you! Going in November with exactly this plan.', 16),
    ],
  },
];

export const getPost = (id) => COMMUNITY_POSTS.find((p) => p.id === id) || null;
