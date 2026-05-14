// ─── Brand Color Palette (Starbucks Inspired) ──────────────────────────────
export const DarkColors = {
  primary: '#00704A',       // Starbucks Green – Logo, Icons, Buttons
  background: '#1E1C1C',    // Deep Brown      – App background
  secondary: '#F5F5F5',     // Off-White       – Primary text
  accent: '#D4AF37',        // Gold Accent     – Hover states & highlights

  // Derived shades
  primaryLight: '#00A862',
  primaryDark: '#004E2D',
  cardBg: '#2B2928',
  cardBorder: '#3D3A38',
  surfaceBg: '#262321',
  surfaceElevated: '#322F2D',
  textMuted: '#9B9B9B',
  textSubtle: '#6F6F6F',
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.75)',
};

export const LightColors = {
  primary: '#00704A',       // Starbucks Green
  background: '#FDFBF7',    // Cream off-white
  secondary: '#1E1C1C',     // Deep brown text
  accent: '#D4AF37',        // Gold Accent

  // Derived shades
  primaryLight: '#00A862',
  primaryDark: '#004E2D',
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
