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

export const LIGHT_COLORS = {
  ...SHARED,
  mode: 'light',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F5F4F1',
  text: '#201E1B',
  textMuted: 'rgba(32, 30, 27, 0.55)',
  ink: '#161311',
  inkContrast: '#FFFFFF', // text/icon color to use on top of an `ink`-filled surface
  divider: 'rgba(32, 30, 27, 0.12)',
};

export const DARK_COLORS = {
  ...SHARED,
  mode: 'dark',
  background: '#121110',
  surface: '#1C1A18',
  surfaceMuted: '#26231F',
  text: '#F2EFEA',
  textMuted: 'rgba(242, 239, 234, 0.6)',
  ink: '#F2EFEA', // "ink" = primary emphasis fill; inverted in dark mode (light-on-dark)
  inkContrast: '#161311',
  divider: 'rgba(242, 239, 234, 0.14)',
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

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
};

// Named font-family per weight — always paired with the exact matching
// weight's font file, never with a separate `fontWeight` style override.
// Android (unlike iOS) won't synthesize bold/semibold from a Regular custom
// font file, so mixing e.g. FONTS.body with fontWeight:'700' silently falls
// back to the system font on Android while iOS fakes it — this is why type
// weight differences were invisible on Android. Use FONTS.semibold/bold/
// heading directly instead of layering fontWeight on FONTS.body.
export const FONTS = {
  heading: 'Archivo_800ExtraBold',
  bold: 'Archivo_700Bold',
  semibold: 'Archivo_600SemiBold',
  body: 'Archivo_400Regular',
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
};

export const LAYOUT = {
  contentMaxWidth: 520,
};

// Given a palette (LIGHT_COLORS or DARK_COLORS), builds the SHADOW/TYPOGRAPHY
// tokens that bake in colors. Call via useTheme() to get theme-aware
// versions; the static SHADOW/TYPOGRAPHY exports below remain as light-mode
// fallbacks for any call site not yet using the hook.
export const buildShadow = (colors) => ({
  shadowColor: colors.mode === 'dark' ? '#000000' : colors.ink,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: colors.mode === 'dark' ? 0.35 : 0.08,
  shadowRadius: 12,
  elevation: 3,
});

export const buildTypography = (colors) => ({
  h1: { fontFamily: FONTS.heading, fontSize: 34, color: colors.ink },
  h2: { fontFamily: FONTS.heading, fontSize: 26, color: colors.ink },
  h3: { fontFamily: FONTS.heading, fontSize: 18, color: colors.ink },
  body: { fontFamily: FONTS.body, fontSize: 15, color: colors.text },
  caption: { fontFamily: FONTS.body, fontSize: 12, color: colors.textMuted },
  button: { fontFamily: FONTS.heading, fontSize: 16, color: colors.inkContrast },
});

export const SHADOW = buildShadow(LIGHT_COLORS);
export const TYPOGRAPHY = buildTypography(LIGHT_COLORS);
