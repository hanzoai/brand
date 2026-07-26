/**
 * Hanzo brand colors.
 *
 * Hanzo is MONOCHROME + ONE accent. The base is black, white, and a neutral
 * grayscale; the primary action is white (max-contrast ink that flips b/w with
 * the scheme). The single brand/interactive accent is PURPLE (`purple`) — links,
 * active, focus, selection — NO blue/green/orange in chrome. Palette: White ·
 * Gray · Purple. Surfaces are LAYERED near-blacks (`surface`), never gray panels.
 * White-label tenants override the accent per host (lux/zoo/pars ≠ Hanzo purple).
 * Status semantics (success/warning/error/info) are functional indicators only.
 */

// The two named brand poles.
export const hanzoBlack = '#0A0A0B' as const
export const hanzoWhite = '#FFFFFF' as const

// The monochrome brand scale (Hanzo Black → Hanzo White).
export const hanzoMono = {
  DEFAULT: hanzoBlack,
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
  1000: '#000000',
} as const

export const colors = {
  // Monochrome brand scale.
  hanzo: hanzoMono,

  // Primary colors (ink)
  primary: {
    DEFAULT: '#0A0A0B',
    50: '#F5F5F5',
    100: '#E5E5E5',
    200: '#C4C4C4',
    300: '#A3A3A3',
    400: '#737373',
    500: '#525252',
    600: '#404040',
    700: '#262626',
    800: '#171717',
    900: '#0A0A0B',
    950: '#050505',
  },

  // Secondary colors
  secondary: {
    DEFAULT: '#F5F5F5',
    dark: '#E5E5E5',
    darker: '#C4C4C4',
  },

  // Accent — monochrome ink (max contrast). Flips to white in dark mode via theme.
  accent: {
    DEFAULT: '#0A0A0B',
    light: '#262626',
    dark: '#000000',
    hover: '#171717',
  },

  // The ONE brand accent — PURPLE (palette = White · Gray · Purple). The
  // monochrome base stays: the primary action is white (see `accent`, flips
  // b/w). Purple is the single interactive/brand accent — links, active, focus,
  // selection. NO blue/green/orange in chrome. White-label tenants override the
  // accent per host so lux/zoo/pars never inherit Hanzo purple.
  purple: {
    DEFAULT: '#8B5CF6', // violet-500
    hover: '#7C3AED', // violet-600
    muted: '#A78BFA', // violet-400 — accent text on dark
    soft: 'rgba(139, 92, 246, 0.12)',
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Layered surface blacks (Builder v2 — no gray panels; each subtly different).
  surface: {
    0: '#080808', // app background
    1: '#0D0D0D', // panels
    2: '#111111', // raised
    3: '#171717', // controls / hover
  },

  // Semantic status colors (functional indicators — not brand)
  success: {
    DEFAULT: '#10B981',
    light: '#34D399',
    dark: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },

  warning: {
    DEFAULT: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },

  error: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },

  info: {
    DEFAULT: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },

  // Neutral colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
    1000: '#000000',
  },

  // Background colors
  background: {
    DEFAULT: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    dark: '#0A0A0B',
    darkSecondary: '#171717',
    darkTertiary: '#262626',
  },

  // Text colors
  text: {
    primary: '#0A0A0B',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#A3A3A3',
    inverse: '#FFFFFF',
    link: '#0A0A0B',
    linkHover: '#404040',
  },

  // Border colors
  border: {
    DEFAULT: '#E5E5E5',
    light: '#F5F5F5',
    dark: '#D4D4D4',
    focus: '#0A0A0B',
  },

  // Special colors
  code: {
    bg: '#F5F5F5',
    text: '#0A0A0B',
    border: '#E5E5E5',
    darkBg: '#1E1E1E',
    darkText: '#D4D4D4',
    darkBorder: '#404040',
  },

  // Gradients — monochrome only
  gradients: {
    primary: 'linear-gradient(135deg, #0A0A0B 0%, #262626 100%)',
    subtle: 'linear-gradient(135deg, #171717 0%, #404040 100%)',
    paper: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
  },
} as const

// CSS variable generator
export function getCSSVariables(prefix = 'hanzo') {
  const cssVars: Record<string, string> = {}

  // Flatten the color object
  function flatten(obj: any, parentKey = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}-${key}` : key
      if (value !== null && typeof value === 'object') {
        flatten(value, newKey)
      } else {
        const varName = `--${prefix}-${newKey.toLowerCase().replace(/_/g, '-')}`
        cssVars[varName] = value as string
      }
    })
  }

  flatten(colors)
  return cssVars
}

export default colors
