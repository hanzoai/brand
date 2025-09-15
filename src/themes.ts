/**
 * Theme management for Hanzo brand
 */

import { colors } from './colors'
import { getCSSVariables } from './colors'

export interface Theme {
  name: string
  colors: typeof colors
  cssVariables: Record<string, string>
}

// Light theme
export const lightTheme: Theme = {
  name: 'light',
  colors: colors,
  cssVariables: getCSSVariables('hanzo'),
}

// Dark theme colors (modified)
const darkColors = {
  ...colors,
  primary: {
    ...colors.primary,
    DEFAULT: '#FFFFFF',
  },
  background: {
    DEFAULT: '#0A0A0B',
    secondary: '#171717',
    tertiary: '#262626',
    dark: '#FFFFFF',
    darkSecondary: '#FAFAFA',
    darkTertiary: '#F5F5F5',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    disabled: '#525252',
    inverse: '#0A0A0B',
    link: '#60A5FA',
    linkHover: '#93C5FD',
  },
  border: {
    DEFAULT: '#262626',
    light: '#171717',
    dark: '#404040',
    focus: '#60A5FA',
  },
}

export const darkTheme: Theme = {
  name: 'dark',
  colors: darkColors,
  cssVariables: getCSSVariables('hanzo'),
}

// Available themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const

// Apply theme to document
export function applyTheme(theme: keyof typeof themes | Theme = 'light') {
  if (typeof window === 'undefined') return

  const themeConfig = typeof theme === 'string' ? themes[theme] : theme
  const root = document.documentElement

  // Apply CSS variables
  Object.entries(themeConfig.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Set theme attribute
  root.setAttribute('data-theme', themeConfig.name)
  
  // Store preference
  localStorage.setItem('hanzo-theme', themeConfig.name)
}

// Get current theme
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return lightTheme

  const stored = localStorage.getItem('hanzo-theme')
  if (stored && stored in themes) {
    return themes[stored as keyof typeof themes]
  }

  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? darkTheme : lightTheme
}

// Create custom theme
export function createTheme(config: Partial<Theme>): Theme {
  return {
    name: config.name || 'custom',
    colors: config.colors || colors,
    cssVariables: config.cssVariables || getCSSVariables('hanzo'),
  }
}

// Theme switcher hook for React
export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(getCurrentTheme)

  React.useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? darkTheme : lightTheme
      setThemeState(newTheme)
      applyTheme(newTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = (theme: keyof typeof themes | Theme) => {
    const themeConfig = typeof theme === 'string' ? themes[theme] : theme
    setThemeState(themeConfig)
    applyTheme(themeConfig)
  }

  return { theme, setTheme }
}

export default themes