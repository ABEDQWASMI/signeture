// ─── DARK MODE — Deep espresso / OLED black ────────────────────────────────
export const DarkColors = {
  // Core
  primary:        '#C5A36D',   // Signature gold
  primaryLight:   '#D4B98A',
  primaryDark:    '#A07840',
  accent:         '#E8C97A',   // Bright gold highlight

  // Surfaces
  background:     '#0A0805',   // Near-OLED black with warm undertone
  cardBg:         '#141008',   // Elevated card
  cardBorder:     'rgba(197,163,109,0.14)',
  surfaceBg:      '#1A1408',
  surfaceElevated:'#221C0E',

  // Text
  secondary:      '#F2EDE4',   // Off-white — warm
  textMuted:      '#8A7A62',
  textSubtle:     '#5A4E3A',

  // Semantic
  success:        '#4CAF50',
  error:          '#E53935',
  warning:        '#FF9800',
  white:          '#FFFFFF',
  overlay:        'rgba(0,0,0,0.6)',

  // Glow
  glowPrimary:    'rgba(197,163,109,0.18)',
  glowAccent:     'rgba(232,201,122,0.10)',
};

// ─── LIGHT MODE — Warm cream / editorial luxury ─────────────────────────────
export const LightColors = {
  // Core
  primary:        '#8B6332',   // Deeper brown for contrast on white
  primaryLight:   '#A67C52',
  primaryDark:    '#6B4C24',
  accent:         '#C5A36D',   // Gold

  // Surfaces
  background:     '#FDFAF5',   // Warm cream paper
  cardBg:         '#FFFFFF',
  cardBorder:     'rgba(139,99,50,0.12)',
  surfaceBg:      '#F5F0E8',
  surfaceElevated:'#FFFFFF',

  // Text
  secondary:      '#1A1208',   // Near-black warm
  textMuted:      '#7A6A54',
  textSubtle:     '#A89880',

  // Semantic
  success:        '#2E7D32',
  error:          '#C62828',
  warning:        '#E65100',
  white:          '#FFFFFF',
  overlay:        'rgba(0,0,0,0.08)',

  // Glow
  glowPrimary:    'rgba(139,99,50,0.10)',
  glowAccent:     'rgba(197,163,109,0.15)',
};

// Default export (overridden by context)
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  green: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};
