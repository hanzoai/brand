/**
 * Hanzo brand colors
 *
 * Official Hanzo Red: rgb(216, 28, 54) = #d81c33
 */

// Official brand color - Hanzo Red
export const hanzoRed = {
  DEFAULT: '#d81c33',    // rgb(216, 28, 54) - Primary brand red
  50: '#fdf2f3',         // Lightest tint
  100: '#fce4e6',
  200: '#fbcdd2',
  300: '#f7a8b1',
  400: '#f17485',
  500: '#e6475c',
  600: '#d81c33',        // Base color
  700: '#b5152b',
  800: '#961528',
  900: '#7d1626',
  950: '#450710',        // Darkest shade
} as const

// RGB values for programmatic use
export const hanzoRedRGB = {
  r: 216,
  g: 28,
  b: 54,
  css: 'rgb(216, 28, 54)',
  cssA: (alpha: number) => `rgba(216, 28, 54, ${alpha})`,
} as const

export const colors = {
  // Hanzo brand red
  hanzo: hanzoRed,

  // Primary colors
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

  // Accent colors (Hanzo Red)
  accent: {
    DEFAULT: '#d81c33',  // Hanzo Red
    light: '#e6475c',    // hanzoRed.500
    dark: '#b5152b',     // hanzoRed.700
    hover: '#c01830',    // Darker for hover states
  },

  // Semantic colors
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
    link: '#d81c33',
    linkHover: '#b5152b',
  },

  // Border colors
  border: {
    DEFAULT: '#E5E5E5',
    light: '#F5F5F5',
    dark: '#D4D4D4',
    focus: '#d81c33',
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

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0A0A0B 0%, #262626 100%)',
    accent: 'linear-gradient(135deg, #d81c33 0%, #b5152b 100%)',
    hanzo: 'linear-gradient(135deg, #e6475c 0%, #d81c33 100%)',
    sunset: 'linear-gradient(135deg, #F59E0B 0%, #d81c33 100%)',
    ocean: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
  },
} as const

// CSS variable generator
export function getCSSVariables(prefix = 'hanzo') {
  const cssVars: Record<string, string> = {}
  
  // Flatten the color object
  function flatten(obj: any, parentKey = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}-${key}` : key
      if (typeof value === 'object' && !value.includes?.('gradient')) {
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