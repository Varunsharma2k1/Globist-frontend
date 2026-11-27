import { Platform } from 'react-native';

// Two full palettes, same shape, so any screen can switch between them by
// swapping which object it reads from (via useTheme()) without touching
// layout code. Semantic/content tokens (pastel category colors, reelTone)
// are intentionally shared across both — those represent trip categories,
// not light/dark UI chrome.
const SHARED = {
  white: '#FFFFFF',
  black: '#000000',
  success: '#1D9E75',
  successBg: 'rgba(29, 158, 117, 0.12)',
  error: '#E24B4A',
  errorBg: 'rgba(226, 75, 74, 0.12)',
  verified: '#1D9BF0', // blue tick for verified agencies
  pastel: {
    mountain: { bg: '#DFE9DA', fg: '#3F5C3A' },
    beach: { bg: '#DBE6F2', fg: '#2F4D6E' },
    desert: { bg: '#F8E6C2', fg: '#7A5A1E' },
    luxury: { bg: '#F0EAE0', fg: '#6B5A3E' },
    peach: { bg: '#FBE9DD', fg: '#8A4A26' },
  },
  reelTone: {
    mountain: '#1B2A18',
    beach: '#141F2B',
    desert: '#2B2013',
    luxury: '#211C16',
    default: '#161311',
  },
};

// Minimal brand palette from the TripTape logo, 60/30/10:
//   60% neutral base (background/surface), 30% deep green ink (text,
//   primary buttons), 10% gold accent (active states, small highlights).
// Text hierarchy comes from opacity of the ink, not extra colours.
export const LIGHT_COLORS = {
  ...SHARED,
  mode: 'light',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F4EF', // warm cream tint (logo background)
  text: 'rgba(23, 39, 30, 0.88)',
  textMuted: 'rgba(23, 39, 30, 0.56)',
  ink: '#17271E', // TripTape deep green
  inkContrast: '#FFFFFF', // text/icon color to use on top of an `ink`-filled surface
  accent: '#B8955A', // TripTape gold — use sparingly (≈10%)
  accentSoft: 'rgba(184, 149, 90, 0.12)',
  divider: 'rgba(23, 39, 30, 0.08)',
};

export const DARK_COLORS = {
  ...SHARED,
  mode: 'dark',
  background: '#0E1411',
  surface: '#151D18',
  surfaceMuted: '#1C2620',
  text: 'rgba(247, 244, 239, 0.88)',
  textMuted: 'rgba(247, 244, 239, 0.56)',
  ink: '#F7F4EF', // "ink" = primary emphasis fill; inverted in dark mode (cream-on-green-black)
  inkContrast: '#0E1411',
  accent: '#CDAE77',
  accentSoft: 'rgba(205, 174, 119, 0.14)',
  divider: 'rgba(247, 244, 239, 0.08)',
};

// Back-compat static export — anything importing COLORS directly (instead
// of via useTheme()) keeps working and renders in the light palette.
export const COLORS = LIGHT_COLORS;

// Maps trip/region category strings to a pastel token above.
export const CATEGORY_PASTEL = {
  Mountains: 'mountain',
  Mountain: 'mountain',
  Treks: 'mountain',
  Beaches: 'beach',
  Beach: 'beach',
  Backwaters: 'beach',
  Deserts: 'desert',
  Desert: 'desert',
  Luxury: 'luxury',
};

// 8-point grid. Related things sit closer; groups are ~2× further apart.
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

// The ONLY four font sizes in the app (caption / body / title / display).
export const FONT_SIZE = {
  caption: 12,
  body: 14,
  title: 18,
  display: 28,
};

// Named font-family per weight — always paired with the exact matching
// weight's font file, never with a separate `fontWeight` style override.
// Android (unlike iOS) won't synthesize bold/semibold from a Regular custom
// font file, so mixing e.g. FONTS.body with fontWeight:'700' silently falls
// back to the system font on Android while iOS fakes it — this is why type
// weight differences were invisible on Android. Use FONTS.semibold/bold/
// heading directly instead of layering fontWeight on FONTS.body.
// Typeface: Inter — clean geometric sans with big LIGHT headlines and tight
// tracking (editorial look). `display` is for large titles; the other tokens keep
// their old roles so every screen picks up the new font automatically.
// Minimal type: ONE family, TWO weights — Regular (400) and SemiBold (600).
// Old token names are kept so every screen maps onto the two weights.
export const FONTS = {
  display: 'Inter_600SemiBold',  // large titles (h1/h2)
  heading: 'Inter_600SemiBold',  // emphasis: buttons, numbers, card titles
  bold: 'Inter_600SemiBold',
  semibold: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  light: 'Inter_400Regular',
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
};

export const LAYOUT = {
  contentMaxWidth: 520,
};

// Given a palette (LIGHT_COLORS or DARK_COLORS), builds the SHADOW/TYPOGRAPHY
// tokens that bake in colors. Call via useTheme() to get theme-aware
// versions; the static SHADOW/TYPOGRAPHY exports below remain as light-mode
// fallbacks for any call site not yet using the hook.
// Soft, green-tinted shadow (never harsh grey/black on light surfaces).
export const buildShadow = (colors) => ({
  shadowColor: colors.mode === 'dark' ? '#000000' : colors.ink,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: colors.mode === 'dark' ? 0.3 : 0.06,
  shadowRadius: 24,
  elevation: 2,
});

export const buildTypography = (colors) => ({
  h1: { fontFamily: FONTS.display, fontSize: FONT_SIZE.display, lineHeight: 34, letterSpacing: -0.6, color: colors.ink },
  h2: { fontFamily: FONTS.display, fontSize: FONT_SIZE.display, lineHeight: 34, letterSpacing: -0.6, color: colors.ink },
  h3: { fontFamily: FONTS.semibold, fontSize: FONT_SIZE.title, lineHeight: 24, letterSpacing: -0.2, color: colors.ink },
  body: { fontFamily: FONTS.body, fontSize: FONT_SIZE.body, lineHeight: 20, color: colors.text },
  caption: { fontFamily: FONTS.body, fontSize: FONT_SIZE.caption, lineHeight: 16, color: colors.textMuted },
  button: { fontFamily: FONTS.semibold, fontSize: FONT_SIZE.body, letterSpacing: 0.1, color: colors.inkContrast },
});

export const SHADOW = buildShadow(LIGHT_COLORS);
export const TYPOGRAPHY = buildTypography(LIGHT_COLORS);
