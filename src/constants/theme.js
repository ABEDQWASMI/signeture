// ─── Brand Color Palette ───────────────────────────────────────────────────
export const DarkColors = {
  primary: '#C5A36D',       // Gold / Bronze  – Logo, Icons, Buttons
  background: '#000000',    // Deep Black     – App background
  secondary: '#F5F5F5',     // Off-White      – Primary text
  accent: '#3D2B1F',        // Coffee Brown   – Hover states

  // Derived shades
  primaryLight: '#D4B98A',
  primaryDark: '#A8885A',
  cardBg: '#0F0F0F',
  cardBorder: '#1C1C1C',
  surfaceBg: '#111111',
  surfaceElevated: '#181818',
  textMuted: '#8A8A8A',
  textSubtle: '#555555',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.75)',
};

export const LightColors = {
  primary: '#C5A36D',       // Gold stays the same
  background: '#FAFAF8',    // Warm off-white
  secondary: '#1A1A1A',     // Dark text
  accent: '#F5EDE0',        // Warm cream

  // Derived shades
  primaryLight: '#D4B98A',
  primaryDark: '#A8885A',
  cardBg: '#FFFFFF',
  cardBorder: '#F0EBE3',
  surfaceBg: '#F5F2EE',
  surfaceElevated: '#FFFFFF',
  textMuted: '#7A7A7A',
  textSubtle: '#AAAAAA',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
  white: '#FFFFFF',
  overlay: 'rgba(255,255,255,0.85)',
};

// Default export (will be overridden by context)
export const Colors = DarkColors;

// ─── Typography ────────────────────────────────────────────────────────────
export const Typography = {
  // Font families – will fall back to system fonts on device
  fontDisplay: 'System',
  fontBody: 'System',

  // Scale
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 48,

  // Weight
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',

  // Letter spacing
  tight: -0.5,
  normal: 0,
  wide: 1.5,
  wider: 2.5,
  widest: 4,
};

// ─── Spacing ───────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ─── Radii ─────────────────────────────────────────────────────────────────
export const Radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 36,
  pill: 999,
};

// ─── Shadows ───────────────────────────────────────────────────────────────
export const Shadows = {
  gold: {
    shadowColor: '#C5A36D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
