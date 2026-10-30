/**
 * Slides for the Home carousel: offbeat places in Himachal Pradesh and
 * Uttarakhand (name + location + photo only), then the "Explore Destinations
 * via Reels" slide last. `target` is the bottom-tab the slide opens when tapped;
 * place slides pass `destination` so Explore opens on that place's packages.
 * Photos are bundled in assets/home (credits in CREDITS.md there).
 */
export const CAROUSEL_SLIDES = [
  {
    id: 'kalpa',
    title: 'Kalpa',
    destination: 'Kalpa',
    location: 'Kinnaur, Himachal Pradesh',
    image: require('../../../../assets/home/kalpa-kinnaur.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'kedarkantha',
    title: 'Kedarkantha',
    destination: 'Kedarkantha',
    location: 'Uttarkashi, Uttarakhand',
    image: require('../../../../assets/home/kedarkantha-peak.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'munsiyari',
    title: 'Munsiyari',
    destination: 'Munsiyari',
    location: 'Pithoragarh, Uttarakhand',
    image: require('../../../../assets/home/munsiyari-panchachuli.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'valley-of-flowers',
    title: 'Valley of Flowers',
    destination: 'Valley of Flowers',
    location: 'Chamoli, Uttarakhand',
    image: require('../../../../assets/home/valley-of-flowers.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'reels',
    title: 'Explore Destinations via Reels',
    cta: 'Watch Reels Now →',
    image: require('../../../../assets/home/rishikesh-ganges.jpg'),
    target: 'ReelsTab',
  },
];
