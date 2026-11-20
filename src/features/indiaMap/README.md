# India Map ("what's happening across India")

An offline, interactive vector map of India. It uses no Mapbox, Google Maps, tiles or map APIs:
the borders are bundled in the app, and only the pin data will come from your backend.

- **Home:** the `IndiaMapTeaserCard` sits below the carousel and opens the full map.
- **Full screen:** `IndiaMapScreen`, registered as the `IndiaMap` stack route.

## Run it

```bash
cd mobile
npx expo start -c
```

It works in Expo Go. Skia, Reanimated and Gesture Handler are all included in Expo Go.

## How it works

| Piece | File | Notes |
|---|---|---|
| Map asset | `data/indiaMap.json` | Pre-projected state paths, ~260 KB. See `scripts/india-map/README.md` |
| Geometry | `geo/mapGeometry.js` | `project(lng, lat)`, Skia paths parsed **once**, state hit-testing |
| Theme / config | `config/mapTheme.js` | Colours, border widths, bubble style, zoom limits, split threshold |
| Data | `hooks/usePlaces.js` | Mock data now, your API later (see below) |
| Camera + gestures | `hooks/useMapCamera.js` | Pan with momentum, pinch, double-tap, drag limits, camera flights. Runs on the UI thread |
| Map drawing | `components/IndiaMapCanvas.js` | Skia: states, borders, selected-state glow, pins |
| Bubbles | `components/CountBubble.js`, `utils/bubbles.js` | Group by state, compact counts, viewport culling, collision hiding |
| Place card | `components/PlaceSheet.js` | Name, state, count, placeholder image |

**Gestures:**
- Drag to pan, with momentum.
- Pinch to zoom around your fingers.
- Double-tap to zoom ×2. At max zoom, a double-tap goes back to all of India.
- Tap a state to highlight it and zoom in.
- Tap a state bubble to zoom into that state.
- Tap a place bubble to open the Tapes feed (`MainTabs → ReelsTab`, with `{ placeId, placeName, state }` params).
- The ⤢ button returns to all of India.

**Bubbles:**
- At first you only see one light bubble per state ("Himachal · 540 tapes"). No places are pinned yet.
- Tap a state: the camera glides into it and only that state's top places (`MAP_CONFIG.trendingLimit`, by tape count) get a pin and a bubble ("Manali  121 tapes"). Other states' bubbles and pins disappear.
- Tap the sea or the ⤢ button to clear the selection.
- Only bubbles inside the viewport are rendered. Where two overlap, the lower count is hidden.
- Bubbles stay the same size on screen while you zoom.

## Add a place

Add an entry to `data/mockPlaces.json` (or have your API return it):

```json
{ "id": "hampi", "name": "Hampi", "state": "KA", "lat": 15.335, "lng": 76.46, "count": 54 }
```

- `state` must be one of the ids in `scripts/india-map/build.mjs → IDS` (`HP`, `UK`, `KA`, `GA`, …).
- `id` must be unique.
- `count` is the number of tapes, shown in the bubble's badge.
- Optional `image`: a photo URL for the bubble thumbnail. Without one, a bundled photo from `data/placeImages.js` is used if the place has one, otherwise a placeholder tile.

For a nicer zoomed-out label, add a short name in `config/mapTheme.js → STATE_SHORT_NAMES`.

## Connect your real API

In `hooks/usePlaces.js`:

```js
export const PLACES_API_URL = 'https://<your-backend>/api/places';
```

That's the only change. The endpoint must return an array with the same shape as the mock
(`[{ id, name, state, lat, lng, count }]`), or `{ places: [...] }` / `{ data: [...] }`.

- The last good response is cached in AsyncStorage and shown instantly on the next launch.
- `usePlaces()` also returns `refresh()`. Calling it updates counts in the existing bubbles without
  redrawing the map. The map and pins only redraw when places are added, removed or moved.

## Performance notes

- No GeoJSON is parsed at runtime. Paths are pre-projected strings, turned into Skia paths once per session.
- Pan and zoom only change three shared values. Skia redraws on the UI thread without React re-rendering.
- The JS thread recomputes the bubble layout only when the camera moves about 40 px or about 9% zoom,
  plus once when it stops.
- Borders and pins scale inversely with zoom, so they stay a constant on-screen size.
