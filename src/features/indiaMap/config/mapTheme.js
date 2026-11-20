/**
 * India map: every colour, size and zoom threshold in one place.
 * Change values here; nothing else needs touching.
 */

export const MAP_THEME = {
  // Ocean around India (with a lighter glow near the coast)
  background: '#0A3150',
  oceanGlow: '#1C6A92',
  oceanLabel: 'rgba(200, 228, 245, 0.6)',

  // Land: each state gets a terrain colour (see STATE_TERRAIN below)
  stateFillDefault: '#9DAA66',
  stateStroke: 'rgba(40, 45, 30, 0.45)',
  borderWidth: 0.8,                // screen pixels

  // Selected state (tap): everything else dims, the state lifts and glows
  dimOthers: 'rgba(4, 16, 28, 0.55)',
  stateLighten: 'rgba(255, 255, 255, 0.16)',
  stateStrokeActive: '#EE8A65',
  activeBorderWidth: 2,            // screen pixels
  activeGlow: 'rgba(238, 138, 101, 0.45)',
  activeRaise: 3,                  // screen pixels the selected state lifts up
  highlightDuration: 500,          // ms for the dim/glow fade-in

  // Pins
  pinFill: '#EE8A65',
  pinStroke: '#FFFFFF',
  pinRadius: 4,                    // screen pixels

  // Bubbles
  bubble: {
    // place bubble = Snap-style photo thumbnail + count badge + name
    thumbW: 46,
    thumbH: 58,
    thumbRadius: 12,
    thumbBorder: '#EE8A65',
    thumbBorderWidth: 2.5,
    badgeBackground: '#EE8A65',
    badgeText: '#161311',
    nameColor: '#FFFFFF',
    nameSize: 12,
    gapAbovePin: 6,
    // state bubble = light pill "Himachal  540"
    stateBackground: 'rgba(16, 24, 38, 0.92)',
    stateText: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.16)',
    radius: 14,
    fontSize: 12,
    paddingH: 10,
    height: 28,
  },

  // UI chrome (dark glass on top of the colourful map)
  buttonBackground: 'rgba(16, 24, 38, 0.92)',
  buttonText: '#F2EFEA',
  sheetBackground: '#141B2D',
  sheetText: '#F2EFEA',
  sheetMuted: 'rgba(242, 239, 234, 0.6)',
};

/**
 * Terrain-style colour per state (hand-picked from each state's dominant landscape:
 * cold desert, Himalayan forest, Gangetic farmland, Thar desert, Deccan plateau,
 * Western Ghats rainforest…). Purely visual and offline — tweak freely.
 */
export const STATE_TERRAIN = {
  // Himalaya & cold desert
  LA: '#C8BBA0', JK: '#7E9A63', HP: '#6E8F58', UK: '#5E8A52', SK: '#5C8A55', AR: '#4E7F4C',
  // North-east hills & forest
  AS: '#6F9A55', ML: '#5E8E52', NL: '#55864E', MN: '#5A8A50', MZ: '#5B8D4F', TR: '#68954F',
  // Gangetic & Punjab plains (farmland)
  PB: '#A9B66A', HR: '#AEB46B', CH: '#A9B66A', DL: '#B4AE74', UP: '#A3B466', BR: '#9DB162', WB: '#8FAE5E',
  // Thar desert & arid west
  RJ: '#D8B67C', GJ: '#C9B27C', DH: '#B2B072',
  // Central forests & plateau
  MP: '#97A85E', CG: '#7F9F55', JH: '#86A158', OD: '#8AA85C',
  // Deccan plateau
  MH: '#BBA86E', TS: '#C1A86F', AP: '#B3AA6C', KA: '#AFA86A',
  // Western Ghats, coast & south
  GA: '#5E9A55', KL: '#4F8E4E', TN: '#A4AE68', PY: '#A4AE68',
  // Islands
  AN: '#4E8E55', LD: '#6FA066',
};

export const MAP_CONFIG = {
  // Zoom levels are relative to "whole India fits on screen" (= 1).
  minZoom: 1,
  // Zoom OUT stops at whole-India-fits (minZoom: 1).
  // Zoom IN stops at 30x (≈ 300 m per pixel — already finer than the simplified borders).
  // Going far past this made the phone's GPU/memory give up and close the app (it was 400
  // when that happened); 8 was stable. Raise it carefully, e.g. 40 → 60, and test pinching.
  maxZoom: 30,
  doubleTapZoomFactor: 2,
  // Place bubbles appear only for the TAPPED state: the top N by tape count.
  trendingLimit: 8,

  // The map opens zoomed in on Himachal Pradesh (Dharamshala, Manali, Shimla, Spiti, Kalpa).
  // Edit this lng/lat box to change the starting view.
  initialView: { west: 74.6, east: 80.4, south: 30.2, north: 33.8 },

  // Padding (px) around India at min zoom, and around a state when zooming into it.
  fitPadding: 16,
  stateZoomPadding: 48,
  // Max zoom used when tapping a state (stops tiny states like Goa from over-zooming).
  stateZoomMax: 6,

  // How far (px) India may be dragged past the screen edge before it stops.
  panSlack: 80,
  // Momentum after a fling: closer to 1 = glides longer.
  decayDeceleration: 0.997,
  // Camera fly duration (ms) for reset / state zoom / double-tap.
  flyDuration: 1100,

  // Bubbles
  collisionPadding: 4,           // px gap required between bubbles
  viewportMargin: 60,            // px outside the screen still counted as "visible"
};

// Short labels for zoomed-out state bubbles ("Himachal · 3.4k").
export const STATE_SHORT_NAMES = {
  HP: 'Himachal', UK: 'Uttarakhand', RJ: 'Rajasthan', GA: 'Goa', KL: 'Kerala',
  JK: 'J&K', LA: 'Ladakh', SK: 'Sikkim', ML: 'Meghalaya', TN: 'Tamil Nadu',
  AP: 'Andhra', AR: 'Arunachal', MP: 'Madhya Pradesh', UP: 'Uttar Pradesh',
  WB: 'West Bengal', AN: 'Andaman', DH: 'Daman & Diu', DL: 'Delhi',
};
