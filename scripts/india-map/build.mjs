#!/usr/bin/env node
/**
 * Builds the bundled India map asset used by the IndiaMap feature.
 *
 *   Source : Datameet "maps" repo, States/Admin2.shp (state + UT boundaries that
 *            follow Survey of India, incl. all of J&K, Ladakh, Arunachal Pradesh).
 *            https://github.com/datameet/maps  (licence: CC BY 2.5 India — keep attribution)
 *   Output : src/features/indiaMap/data/indiaMap.json
 *            { width, height, projection: { scale, tx, ty }, states: [{ id, name, d, cx, cy, bbox }] }
 *
 * Paths are PRE-PROJECTED (Mercator fitted to India) into a fixed map space of
 * `width` × `height` units, so the app never parses GeoJSON or projects borders at runtime.
 * Pins are projected at runtime with src/features/indiaMap/geo/projection.js, which
 * uses the exact `projection` numbers written here — this script verifies both agree.
 *
 * Usage (from mobile/):  node scripts/india-map/build.mjs path/to/Admin2.shp
 * See scripts/india-map/README.md.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { geoArea, geoMercator, geoPath } from 'd3-geo';

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) {
  console.error('Usage: node scripts/india-map/build.mjs path/to/Admin2.shp');
  process.exit(1);
}

// ---- Tunables ---------------------------------------------------------------
const MAP_WIDTH = 1000;      // map-space width; height follows India's aspect ratio
const PADDING = 20;          // map-space padding around India
const SIMPLIFY = '2%';       // mapshaper Visvalingam: % of vertices kept (borders still accurate at phone zoom)
const DIGITS = 1;            // decimals in path coordinates (0.1 map unit ≈ 4 m… plenty)
const OUT = path.resolve('src/features/indiaMap/data/indiaMap.json');

// Datameet ST_NM -> short id used across the app (pins reference these).
const IDS = {
  'Andaman & Nicobar': 'AN', 'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', Assam: 'AS', Bihar: 'BR',
  Chandigarh: 'CH', Chhattisgarh: 'CG', 'Dadra and Nagar Haveli and Daman and Diu': 'DH', Delhi: 'DL',
  Goa: 'GA', Gujarat: 'GJ', Haryana: 'HR', 'Himachal Pradesh': 'HP', 'Jammu & Kashmir': 'JK',
  Jharkhand: 'JH', Karnataka: 'KA', Kerala: 'KL', Ladakh: 'LA', Lakshadweep: 'LD', 'Madhya Pradesh': 'MP',
  Maharashtra: 'MH', Manipur: 'MN', Meghalaya: 'ML', Mizoram: 'MZ', Nagaland: 'NL', Odisha: 'OD',
  Puducherry: 'PY', Punjab: 'PB', Rajasthan: 'RJ', Sikkim: 'SK', 'Tamil Nadu': 'TN', Telangana: 'TS',
  Tripura: 'TR', 'Uttar Pradesh': 'UP', Uttarakhand: 'UK', 'West Bengal': 'WB',
};

// ---- 1. Simplify with mapshaper -----------------------------------------------
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'india-map-')), 'states.json');
execFileSync('npx', [
  'mapshaper', SRC,
  '-simplify', `percentage=${SIMPLIFY}`, 'weighted', 'keep-shapes',   // keep-shapes: small islands/UTs never vanish
  '-o', 'format=geojson', 'precision=0.0001', tmp,
], { stdio: 'inherit' });
const geo = JSON.parse(fs.readFileSync(tmp, 'utf8'));

// d3-geo is spherical and wants clockwise exterior rings; GeoJSON may be the
// other way round, which d3 reads as "the whole world minus this state".
// If a feature's spherical area is more than a hemisphere, flip all its rings.
for (const f of geo.features) {
  if (geoArea(f) > 2 * Math.PI) {
    const g = f.geometry;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    polys.forEach((poly) => poly.forEach((ring) => ring.reverse()));
  }
}

// ---- 2. Fit a Mercator projection to India -----------------------------------
const projection = geoMercator().precision(0).fitWidth(MAP_WIDTH - PADDING * 2, geo);
const [tx0, ty0] = projection.translate();
projection.translate([tx0 + PADDING, ty0 + PADDING]);
const pathGen = geoPath(projection).digits(DIGITS);
const [[, y0], [, y1]] = pathGen.bounds(geo);
const MAP_HEIGHT = Math.ceil(y1 - y0 + PADDING * 2);
// shift so the top padding is exact
projection.translate([projection.translate()[0], projection.translate()[1] - (y0 - PADDING)]);

// ---- 3. Verify our runtime projection formula matches d3 ----------------------
const scale = projection.scale();
const [tx, ty] = projection.translate();
const runtime = (lng, lat) => {
  const l = (lng * Math.PI) / 180, p = (lat * Math.PI) / 180;
  return [scale * l + tx, -scale * Math.log(Math.tan(Math.PI / 4 + p / 2)) + ty];
};
for (const [lng, lat] of [[77.1892, 32.2432], [73.8, 15.5], [94.5, 27.5], [80.2, 13.0]]) {
  const a = projection([lng, lat]), b = runtime(lng, lat);
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-6) throw new Error(`Projection mismatch at ${lng},${lat}`);
}

// ---- 4. Emit pre-projected states -------------------------------------------
// After rounding to DIGITS, neighbouring vertices often collapse onto the same
// point ("L1.2,3.4L1.2,3.4"); drop those repeats, and rings that collapse entirely.
function dedupe(d) {
  return d
    .split('M')
    .filter(Boolean)
    .map((ring) => {
      const pts = ring.replace(/Z$/, '').split('L');
      const kept = pts.filter((p, i) => i === 0 || p !== pts[i - 1]);
      return kept.length >= 3 ? 'M' + kept.join('L') + 'Z' : '';
    })
    .join('');
}
const states = geo.features.map((f) => {
  const name = f.properties.ST_NM;
  const id = IDS[name];
  if (!id) throw new Error(`No id for state "${name}" — add it to IDS`);
  const [cx, cy] = pathGen.centroid(f);
  const [[bx0, by0], [bx1, by1]] = pathGen.bounds(f);
  const r = (n) => Math.round(n * 10) / 10;
  return { id, name, d: dedupe(pathGen(f)), cx: r(cx), cy: r(cy), bbox: [r(bx0), r(by0), r(bx1), r(by1)] };
}).sort((a, b) => a.id.localeCompare(b.id));

const out = {
  source: 'Datameet maps (States/Admin2), CC BY 2.5 India — https://github.com/datameet/maps',
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  projection: { scale, tx, ty },
  states,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote ${OUT}: ${states.length} states, ${MAP_WIDTH}×${MAP_HEIGHT}, ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
