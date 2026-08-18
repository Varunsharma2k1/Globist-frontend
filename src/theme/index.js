import { Platform } from 'react-native';

export const COLORS = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F5F4F1',
  text: '#201E1B',
  textMuted: 'rgba(32, 30, 27, 0.55)',
  ink: '#161311',
  divider: 'rgba(32, 30, 27, 0.12)',
  white: '#FFFFFF',
  black: '#000000',
  success: '#1D9E75',
  successBg: 'rgba(29, 158, 117, 0.12)',
  error: '#E24B4A',
  errorBg: 'rgba(226, 75, 74, 0.12)',
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

export const FONTS = {
  heading: 'Archivo_800ExtraBold',
  body: 'Archivo_400Regular',
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
};

export const LAYOUT = {
  contentMaxWidth: 520,
};

export const SHADOW = {
  shadowColor: COLORS.ink,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

export const TYPOGRAPHY = {
  h1: { fontFamily: FONTS.heading, fontSize: 34, color: COLORS.ink },
  h2: { fontFamily: FONTS.heading, fontSize: 26, color: COLORS.ink },
  h3: { fontFamily: FONTS.heading, fontSize: 18, color: COLORS.ink },
  body: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.text },
  caption: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted },
  button: { fontFamily: FONTS.heading, fontSize: 16, color: COLORS.white },
};
