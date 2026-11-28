import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { getExploreTrips, getRegions, getFeaturedRegions } from '../api';
import { getCoverImage } from '../data/coverImages';

/**
 * App-wide "stale-while-revalidate" cache for the public catalogue
 * (trips, regions, featured regions).
 *
 * - On launch `warmCatalog()` loads the last snapshot from disk instantly,
 *   then fetches fresh data from the API in parallel, in the background.
 * - Every cover photo in that data is prefetched into expo-image's memory +
 *   disk cache, so cards show their photo immediately instead of fading in.
 * - Screens read with `peek()` for the first render (no skeleton when warm)
 *   and `load()` to get fresh data; `subscribe()` tells them when it changes.
 *
 * Only public catalogue data is cached here — nothing user-specific or secret,
 * so it is fine in plain AsyncStorage.
 */

const STORE_KEY = 'triptape.catalog.v1';
const MAX_AGE_MS = 5 * 60 * 1000; // refetch in the background after 5 min

const FETCHERS = {
  trips: () => getExploreTrips().then((d) => d.trips || []),
  regions: () => getRegions(),
  featured: () => getFeaturedRegions(),
};

const mem = {}; // key -> { data, at }
const inflight = {};
const listeners = new Set();
let diskLoaded = null;

function loadDisk() {
  if (!diskLoaded) {
    diskLoaded = AsyncStorage.getItem(STORE_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : {};
        for (const k of Object.keys(FETCHERS)) if (saved[k] && !mem[k]) mem[k] = saved[k];
      })
      .catch(() => {});
  }
  return diskLoaded;
}

function persist() {
  AsyncStorage.setItem(STORE_KEY, JSON.stringify(mem)).catch(() => {});
}

function imageUrlsOf(key, data) {
  if (!Array.isArray(data)) return [];
  if (key === 'trips') return data.map(getCoverImage);
  return data.map((r) => r.imageUrl);
}

function prefetchImages(urls) {
  const list = [...new Set(urls.filter((u) => typeof u === 'string' && /^https?:/.test(u)))];
  if (list.length) Image.prefetch(list, 'memory-disk').catch(() => {});
}

function fetchFresh(key) {
  if (!inflight[key]) {
    inflight[key] = FETCHERS[key]()
      .then((data) => {
        mem[key] = { data, at: Date.now() };
        persist();
        prefetchImages(imageUrlsOf(key, data));
        listeners.forEach((fn) => fn(key));
        return data;
      })
      .finally(() => {
        delete inflight[key];
      });
  }
  return inflight[key];
}

/** Cached data right now (memory only), or undefined. */
export const peek = (key) => mem[key]?.data;

/** Cached data if fresh enough; otherwise fetches. Stale data is returned at once and refreshed behind it. */
export async function load(key, { force = false } = {}) {
  await loadDisk();
  const hit = mem[key];
  if (hit && !force) {
    if (Date.now() - hit.at > MAX_AGE_MS) fetchFresh(key).catch(() => {});
    return hit.data;
  }
  try {
    return await fetchFresh(key);
  } catch (e) {
    if (hit) return hit.data; // offline: keep showing the last good copy
    throw e;
  }
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Call once at launch: disk snapshot first, then everything fresh in parallel + image prefetch. */
export async function warmCatalog() {
  await loadDisk();
  for (const k of Object.keys(FETCHERS)) prefetchImages(imageUrlsOf(k, mem[k]?.data));
  await Promise.allSettled(Object.keys(FETCHERS).map(fetchFresh));
}
