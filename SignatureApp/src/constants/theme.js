// ─── Brand Color Palette (Premium Light Mode) ──────────────────────────────
export const DarkColors = {
  primary: '#8B6F47',       // Warm Brown – Logo, Icons, Buttons
  background: '#FFFFFF',   // Pure White – App background
  secondary: '#1A1A1A',    // Dark Text
  accent: '#D4AF37',       // Gold Accent – Hover states & highlights

  // Derived shades
  primaryLight: '#A68A5F',
  primaryDark: '#6B5436',
  cardBg: '#FFFFFF',
  cardBorder: '#E8E8E8',
  surfaceBg: '#F9F9F9',
  surfaceElevated: '#FFFFFF',
  textMuted: '#777777',
  textSubtle: '#999999',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.1)',
};

export const LightColors = {
  primary: '#8B6F47',       // Warm Brown
  background: '#FFFFFF',   // Pure White
  secondary: '#1A1A1A',    // Dark Text
  accent: '#D4AF37',       // Gold Accent

  // Derived shades
  primaryLight: '#A68A5F',
  primaryDark: '#6B5436',
  cardBg: '#FFFFFF',
  cardBorder: '#E8E8E8',
  surfaceBg: '#F9F9F9',
  surfaceElevated: '#FFFFFF',
  textMuted: '#777777',
  textSubtle: '#999999',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.1)',
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
  green: {
    shadowColor: '#00704A',
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
