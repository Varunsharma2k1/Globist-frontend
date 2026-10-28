/**
 * Slides for the Home carousel: offbeat places in Himachal Pradesh and
 * Uttarakhand (name + location + photo only), then the "Explore Destinations
 * via Reels" slide last. `target` is the bottom-tab the slide opens when tapped.
 * Photos are bundled in assets/home (credits in CREDITS.md there).
 */
export const CAROUSEL_SLIDES = [
  {
    id: 'kalpa',
    title: 'Kalpa',
    location: 'Kinnaur, Himachal Pradesh',
    image: require('../../../../assets/home/kalpa-kinnaur.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'kedarkantha',
    title: 'Kedarkantha',
    location: 'Uttarkashi, Uttarakhand',
    image: require('../../../../assets/home/kedarkantha-peak.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'munsiyari',
    title: 'Munsiyari',
    location: 'Pithoragarh, Uttarakhand',
    image: require('../../../../assets/home/munsiyari-panchachuli.jpg'),
    target: 'ExploreTab',
  },
  {
    id: 'valley-of-flowers',
    title: 'Valley of Flowers',
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
