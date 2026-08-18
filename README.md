# Globist Mobile App 🌐📱

The **Globist Mobile Application** — a React Native (Expo) app for discovering travel packages, watching creator reels, and booking trips. This README covers everything a new developer needs to clone the repo and get the app running end-to-end.

---

## 🧱 Tech Stack

- **React Native + Expo** (managed workflow — no Xcode/Android Studio required to run in dev)
- **React Navigation** (native-stack + bottom-tabs)
- **Axios** for HTTP, with a centralized client + interceptors
- **AsyncStorage** for local persistence (auth session, settings, theme)
- **Express + MongoDB** backend (in `../server`), with a zero-setup in-memory database by default

---

## ✅ Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | Check with `node -v` |
| npm | 9+ | Ships with Node |
| Expo Go app | latest | Install on your phone from the App Store / Play Store — this is the fastest way to run the app, no native build needed |
| A Mac/PC and phone on the **same Wi-Fi network** | — | Required so your phone can reach the backend server on your machine's LAN IP |

You do **not** need Xcode, Android Studio, or a paid Apple Developer account for local development — the app runs entirely inside Expo Go.

---

## 🚀 Setup & Run (first time)

The app is two pieces that both need to be running: the **backend** (`server/`) and the **mobile app** (`mobile/`, this folder).

### 1. Start the backend

```bash
cd server
npm install
npm start
```

You should see:
```
🚀 Globist API running on http://localhost:5001
   Health: http://localhost:5001/api/health
```

No database setup needed — by default the server spins up an **in-memory MongoDB** instance and seeds it with demo data automatically on every start. (To point at a real MongoDB instead, set `MONGO_URI` in `server/.env` — see `server/config/db.js`.)

Leave this running in its own terminal tab.

### 2. Find your machine's LAN IP

Your phone (running Expo Go) needs to reach your computer's IP address, not `localhost`.

```bash
# macOS
ipconfig getifaddr en0
```

Note the result (e.g. `192.168.29.4`).

### 3. Configure the mobile app's API URL

```bash
cd mobile
cp .env.example .env.local
```

Edit `.env.local` and set `EXPO_PUBLIC_API_URL` to your machine's IP from step 2:
```
EXPO_PUBLIC_API_URL=http://192.168.29.4:5001/api
```

See [Environment Variables](#-environment-variables) below for what else can be configured.

### 4. Install and start the mobile app

```bash
npm install
npm start
```

This opens the Expo dev server with a QR code in your terminal / browser.

### 5. Open it on your phone

- **iOS**: open the Camera app and scan the QR code, or open it directly in Expo Go.
- **Android**: open Expo Go and use its built-in QR scanner.

The app should load, hit your local backend, and you're in.

> **Physical device required for full functionality** — the app uses the camera roll (`expo-image-picker`) for posting reels, which doesn't work in Expo Go's web preview. A simulator/emulator works for everything else.

---

## 📁 Directory Structure & Architecture

```text
mobile/
├── App.js                     # Root providers (Auth, Theme, Settings) + navigation container
├── app.json                   # Expo config
├── .env.example                # Documents every recognized environment variable
├── .eslintrc.js / .prettierrc  # Lint & format rules
├── src/
│   ├── api/                   # Centralized HTTP layer
│   │   ├── client.js          # Single Axios instance — JWT interceptor, logging, error handling
│   │   ├── auth.js / trips.js / regions.js / reels.js / agencies.js
│   │   └── index.js           # Re-exports every API module
│   ├── config/
│   │   ├── env.js             # Validated, typed access to EXPO_PUBLIC_* env vars — import ENV from here, never process.env directly
│   │   └── index.js           # App-level constants (CONFIG, STORAGE_KEYS) derived from env.js
│   ├── components/            # Small, reusable, theme-aware UI primitives (Button, Card, Input, Tag, Header, ...)
│   ├── context/                # Global providers: AuthContext, ThemeContext, SettingsContext
│   ├── hooks/                  # useAuth, useTheme, useSettings — thin wrappers around the contexts above
│   ├── navigation/              # AppNavigator (auth-gated stack) + BottomTabNavigator
│   ├── theme/                   # Design tokens: light/dark color palettes, spacing, radius, typography, fonts
│   ├── data/                    # Static/curated data (e.g. featured region ordering)
│   ├── screens/                  # ⚠️ Thin re-export shims only — see below
│   └── features/                 # 👉 Where actual screen code lives, organized by feature
│       ├── auth/          (Sign in / Sign up)
│       ├── home/          (Home tab)
│       ├── explore/       (Explore tab)
│       ├── reels/         (Reels tab + the ReelItem component used elsewhere too)
│       ├── postReel/      (Post Reel flow)
│       ├── inbox/         (Inbox tab — notifications / chat / communities)
│       ├── profile/       (Profile tab)
│       ├── settings/      (Settings screen)
│       ├── booking/       (Checkout flow)
│       └── tripDetail/    (Trip detail screen)
```

### Why `src/screens/` still exists

Every screen used to live directly in `src/screens/`. They were later split into `src/features/<name>/` (each with its own `hooks/`, `components/`, and `screens/` subfolder) so no single file grows unmanageably large. To avoid touching every import across the app, **`src/screens/*.js` are now one-line re-export shims** pointing at the real implementation:

```js
// src/screens/HomeScreen.js
export { default } from '../features/home/screens/HomeScreen';
```

**When adding a new screen**, build it directly under `src/features/<feature>/screens/` — there's no need to add a new shim unless something outside the app still expects the old flat path.

A handful of screens (`CreatorProfileScreen`, `MenuScreen`, `MyTripsScreen`, `RegionDetailScreen`, `SplashScreen`) are small enough that they were left as-is directly in `src/screens/` — not every screen needs the feature-folder treatment, only ones that grow past a single readable file.

---

## ⚙️ Environment Variables

All environment variables are documented in [`.env.example`](./.env.example) and consumed through **`src/config/env.js`** — never read `process.env` directly in app code; import `ENV` from `config/env.js` instead, so every consumer gets a validated value with one documented source of truth.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `EXPO_PUBLIC_API_URL` | No | Hardcoded LAN IP fallback in `env.js` | Backend base URL — **set this to your machine's IP** (see setup step 3) |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | No | `10000` | HTTP request timeout |
| `EXPO_PUBLIC_APP_ENV` | No | Inferred from `__DEV__` | `'development'` \| `'production'` |
| `EXPO_PUBLIC_DEFAULT_DEMO_VIDEO` | No | A sample video URL | Fallback reel video when a post has no uploaded media |

Expo automatically loads `.env`, `.env.local`, `.env.development`, `.env.production` and inlines any `EXPO_PUBLIC_*` variable at build time — no extra plugin needed. Use `.env.local` for your personal machine-specific values (like your LAN IP); it's meant to be gitignored.

### Storage keys

AsyncStorage keys are centralized in `STORAGE_KEYS` (`src/config/index.js`) to avoid typos/collisions:

```js
import { STORAGE_KEYS } from '../config';
await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

---

## 🎨 Theming

The app supports **Light / Dark / System** appearance, controlled from Profile → Settings → Language & App Theme.

- `src/theme/index.js` — exports `LIGHT_COLORS` / `DARK_COLORS` and the shared design tokens (`SPACING`, `RADIUS`, `FONTS`, `LAYOUT`).
- `src/context/ThemeContext.js` + `src/hooks/useTheme.js` — the live theme state, persisted to `AsyncStorage`.

**When styling a component**, always pull colors from the hook, not the static export:

```js
import { useTheme } from '../hooks/useTheme';
import { SPACING, FONTS } from '../theme'; // layout tokens are theme-independent, fine to import directly

function MyComponent() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors); // StyleSheet.create() called per-render, reading live colors

  return <Text style={typography.h2}>Hello</Text>;
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { backgroundColor: colors.background },
  });
}
```

Importing `COLORS` directly from `src/theme` still works (it's the light palette, for back-compat), but it **won't react to the user's dark mode setting** — always prefer `useTheme()` in anything user-facing.

---

## 🚀 How to Add a New Feature or API Endpoint

1. **Add your API function in `src/api/<module>.js`**:
   ```js
   import client from './client';

   export const getNewFeatureData = async () => {
     const response = await client.get('/new-endpoint');
     return response.data;
   };
   ```
2. **Export it in `src/api/index.js`**.
3. **Build the screen under `src/features/<feature>/`**:
   - `hooks/useXController.js` — state, effects, API calls
   - `components/*.js` — presentational pieces, each under ~150 lines
   - `screens/MyScreen.js` — thin layout that wires the hook + components together
4. **Register the route** in `src/navigation/AppNavigator.js` (or the relevant tab navigator).

---

## 🛠️ Code Quality & Formatting Commands

```bash
npm run lint        # Check for lint errors/warnings
npm run lint:fix     # Auto-fix what ESLint can
npm run format        # Prettier — format the whole codebase
```

ESLint enforces (see `.eslintrc.js`):
- `react-hooks/rules-of-hooks` / `exhaustive-deps` — catches invalid hook usage and stale closures
- `max-lines` (warn at 200) — a nudge to split a file into hooks/sub-components once it grows past screen-sized
- `no-unused-vars` (errors on unused imports/variables; prefix an intentionally-unused arg with `_` to opt out, e.g. `(_event) => {...}`)

---

## 💡 Best Practices

1. **Never read `process.env` directly** — import `ENV` from `src/config/env.js`.
2. **Never hardcode colors/spacing** — use `useTheme()` + `src/theme` tokens.
3. **Keep screens thin** — network calls and state logic belong in a `hooks/useXController.js`, not inline in a screen component.
4. **One responsibility per component** — if a component is doing three visually distinct things, split it.
5. **All HTTP calls go through `src/api/client.js`** (via the feature-specific `src/api/*.js` modules) — never call `axios`/`fetch` directly from a screen.
6. **Use the shared hooks**: `useAuth()`, `useTheme()`, `useSettings()` instead of reaching into `useContext(...Context)` directly.
