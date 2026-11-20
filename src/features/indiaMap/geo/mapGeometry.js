/**
 * Map geometry: the projection, the (lazily built, memoised) Skia paths for
 * every state, and hit-testing. Nothing here runs per frame.
 *
 * All positions live in "map space": a fixed MAP_W × MAP_H box produced by
 * scripts/india-map/build.mjs. The camera turns map space into screen pixels.
 */
import { Skia, FillType } from '@shopify/react-native-skia';
import MAP from '../data/indiaMap.json';
import { STATE_SHORT_NAMES } from '../config/mapTheme';

export const MAP_W = MAP.width;
export const MAP_H = MAP.height;

const { scale: P_SCALE, tx: P_TX, ty: P_TY } = MAP.projection;
const RAD = Math.PI / 180;

/**
 * lat/lng → map space. Same Mercator (same numbers) the build script used for
 * the state borders, so pins always line up with the borders.
 */
export function project(lng, lat) {
  return {
    x: P_SCALE * lng * RAD + P_TX,
    y: -P_SCALE * Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) + P_TY,
  };
}

/** Plain state metadata by id: { id, name, cx, cy, bbox } (no path). */
export const STATE_BY_ID = Object.fromEntries(
  MAP.states.map(({ d, ...meta }) => [meta.id, meta])
);

export function stateShortName(id) {
  return STATE_SHORT_NAMES[id] || STATE_BY_ID[id]?.name || id;
}

let statesCache = null;
let indiaOutlineCache = null;

/** States with parsed Skia paths. Parsed once per app session. */
export function getStatePaths() {
  if (!statesCache) {
    statesCache = MAP.states.map((s) => {
      // Paths are immutable in this Skia version: set the fill rule via a builder.
      const parsed = Skia.Path.MakeFromSVGString(s.d);
      const path = Skia.PathBuilder.MakeFromPath(parsed).setFillType(FillType.EvenOdd).build();
      return { id: s.id, name: s.name, bbox: s.bbox, path };
    });
  }
  return statesCache;
}

/** Every state merged into one path: used for India's drop shadow. */
export function getIndiaOutline() {
  if (!indiaOutlineCache) {
    const b = Skia.PathBuilder.Make();
    getStatePaths().forEach((s) => b.addPath(s.path));
    indiaOutlineCache = b.build();
  }
  return indiaOutlineCache;
}

/** Which state contains this map-space point? (bbox check first, then exact path test.) */
export function hitTestState(x, y) {
  for (const s of getStatePaths()) {
    const [x0, y0, x1, y1] = s.bbox;
    if (x < x0 || x > x1 || y < y0 || y > y1) continue;
    if (s.path.contains(x, y)) return s;
  }
  return null;
}
