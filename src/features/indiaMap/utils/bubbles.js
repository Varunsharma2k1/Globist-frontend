/**
 * Bubble data: grouping places by state, compact counts, and screen-space
 * layout (viewport culling + collision hiding). Pure functions, no React.
 */
import { MAP_THEME, MAP_CONFIG } from '../config/mapTheme';
import { project, STATE_BY_ID, stateShortName } from '../geo/mapGeometry';

/** 1240 → "1.2k", 2100000 → "2.1M". */
export function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 1e6) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
}

/** Places → bubble models positioned in map space. */
export function placeBubbles(places) {
  return places.map((p) => {
    const { x, y } = project(p.lng, p.lat);
    return { key: `p:${p.id}`, kind: 'place', id: p.id, label: p.name, count: p.count, x, y, place: p };
  });
}

/** Places → one bubble per state at the state's centre with the summed count. */
export function stateBubbles(places) {
  const byState = new Map();
  for (const p of places) {
    const s = byState.get(p.state) || { count: 0, n: 0 };
    s.count += p.count;
    s.n += 1;
    byState.set(p.state, s);
  }
  return [...byState.entries()]
    .filter(([id]) => STATE_BY_ID[id])
    .map(([id, s]) => ({
      key: `s:${id}`, kind: 'state', id,
      label: stateShortName(id), count: s.count, places: s.n,
      x: STATE_BY_ID[id].cx, y: STATE_BY_ID[id].cy,
    }));
}

/** Rough on-screen bubble size (no text measuring needed for collision tests). */
export function bubbleSize(b) {
  const B = MAP_THEME.bubble;
  if (b.kind === 'place') {
    // photo thumbnail (+ badge overlapping its bottom) with the name underneath
    return { w: Math.max(B.thumbW + 8, b.label.length * B.nameSize * 0.58), h: B.thumbH + 10 + B.nameSize + 6 };
  }
  const chars = b.label.length + formatCount(b.count).length + 3;
  return { w: chars * B.fontSize * 0.62 + B.paddingH * 2 + 14, h: B.height };
}

/** Screen rectangle of a bubble for a given camera (bubble sits above its anchor point). */
export function bubbleRect(b, cam) {
  const { w, h } = bubbleSize(b);
  const ax = b.x * cam.scale + cam.tx;
  const ay = b.y * cam.scale + cam.ty;
  const offset = b.kind === 'place' ? MAP_THEME.bubble.gapAbovePin : -h / 2;
  return { x: ax - w / 2, y: ay - offset - h, w, h };
}

/**
 * Picks which bubbles to show for a camera: only those inside the viewport
 * (plus a margin), highest counts first; a bubble that would overlap an
 * already-placed one is hidden. Returns the visible bubbles.
 */
export function layoutBubbles(candidates, cam, viewW, viewH) {
  const m = MAP_CONFIG.viewportMargin;
  const pad = MAP_CONFIG.collisionPadding;
  const placed = [];
  const sorted = [...candidates].sort((a, b) => b.count - a.count);
  for (const b of sorted) {
    const r = bubbleRect(b, cam);
    if (r.x + r.w < -m || r.x > viewW + m || r.y + r.h < -m || r.y > viewH + m) continue;
    const hit = placed.some(({ r: o }) =>
      r.x < o.x + o.w + pad && r.x + r.w + pad > o.x && r.y < o.y + o.h + pad && r.y + r.h + pad > o.y);
    if (!hit) placed.push({ b, r });
  }
  return placed.map((p) => p.b);
}

/** Topmost visible bubble under a screen point, or null. */
export function hitTestBubble(visible, cam, x, y) {
  for (let i = visible.length - 1; i >= 0; i--) {
    const r = bubbleRect(visible[i], cam);
    if (x >= r.x - 4 && x <= r.x + r.w + 4 && y >= r.y - 4 && y <= r.y + r.h + 4) return visible[i];
  }
  return null;
}
