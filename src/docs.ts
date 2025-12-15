/**
 * Documentation theme configuration for Fumadocs
 * Hanzo brand - Dark theme with blue accent
 */

import { colors } from './colors'

/**
 * Fumadocs-compatible CSS variables
 */
export interface DocsThemeVariables {
  '--color-fd-background': string
  '--color-fd-foreground': string
  '--color-fd-muted': string
  '--color-fd-muted-foreground': string
  '--color-fd-popover': string
  '--color-fd-popover-foreground': string
  '--color-fd-card': string
  '--color-fd-card-foreground': string
  '--color-fd-border': string
  '--color-fd-primary': string
  '--color-fd-primary-foreground': string
  '--color-fd-secondary': string
  '--color-fd-secondary-foreground': string
  '--color-fd-accent': string
  '--color-fd-accent-foreground': string
  '--color-fd-ring': string
}

/**
 * Documentation theme configuration
 */
export interface DocsTheme {
  name: string
  description: string
  light: DocsThemeVariables
  dark: DocsThemeVariables
  css: string
}

/**
 * Light mode variables - Clean white with blue accent
 */
export const lightDocsVariables: DocsThemeVariables = {
  '--color-fd-background': 'hsl(0, 0%, 100%)',
  '--color-fd-foreground': 'hsl(0, 0%, 4%)',
  '--color-fd-muted': 'hsl(0, 0%, 96%)',
  '--color-fd-muted-foreground': 'hsl(0, 0%, 45%)',
  '--color-fd-popover': 'hsl(0, 0%, 100%)',
  '--color-fd-popover-foreground': 'hsl(0, 0%, 4%)',
  '--color-fd-card': 'hsl(0, 0%, 100%)',
  '--color-fd-card-foreground': 'hsl(0, 0%, 4%)',
  '--color-fd-border': 'hsl(0, 0%, 90%)',
  '--color-fd-primary': 'hsl(217, 91%, 60%)',       // Blue #3B82F6
  '--color-fd-primary-foreground': 'hsl(0, 0%, 100%)',
  '--color-fd-secondary': 'hsl(0, 0%, 96%)',
  '--color-fd-secondary-foreground': 'hsl(0, 0%, 4%)',
  '--color-fd-accent': 'hsl(217, 91%, 95%)',        // Light blue tint
  '--color-fd-accent-foreground': 'hsl(217, 91%, 45%)',
  '--color-fd-ring': 'hsl(217, 91%, 60%)',
}

/**
 * Dark mode variables - Near-black with blue accent
 */
export const darkDocsVariables: DocsThemeVariables = {
  '--color-fd-background': 'hsl(0, 0%, 4%)',        // #0A0A0B
  '--color-fd-foreground': 'hsl(0, 0%, 98%)',
  '--color-fd-muted': 'hsl(0, 0%, 9%)',             // #171717
  '--color-fd-muted-foreground': 'hsl(0, 0%, 60%)',
  '--color-fd-popover': 'hsl(0, 0%, 7%)',
  '--color-fd-popover-foreground': 'hsl(0, 0%, 98%)',
  '--color-fd-card': 'hsl(0, 0%, 7%)',
  '--color-fd-card-foreground': 'hsl(0, 0%, 98%)',
  '--color-fd-border': 'hsl(0, 0%, 15%)',
  '--color-fd-primary': 'hsl(217, 91%, 60%)',       // Blue #3B82F6
  '--color-fd-primary-foreground': 'hsl(0, 0%, 100%)',
  '--color-fd-secondary': 'hsl(0, 0%, 12%)',
  '--color-fd-secondary-foreground': 'hsl(0, 0%, 98%)',
  '--color-fd-accent': 'hsl(217, 91%, 15%)',        // Dark blue tint
  '--color-fd-accent-foreground': 'hsl(217, 91%, 70%)',
  '--color-fd-ring': 'hsl(217, 91%, 50%)',
}

/**
 * Generate CSS string from variables
 */
function generateCSS(light: DocsThemeVariables, dark: DocsThemeVariables): string {
  const lightVars = Object.entries(light)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  const darkVars = Object.entries(dark)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `/* Hanzo Documentation Theme - Dark with Blue Accent */
:root {
${lightVars}

  /* Brand colors */
  --color-brand: hsl(217, 91%, 60%);
  --color-brand-foreground: white;

  /* Layout */
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(0, 0%, 4%);
  --muted: hsl(0, 0%, 96%);
  --muted-foreground: hsl(0, 0%, 45%);
  --border: hsl(0, 0%, 90%);
  --sidebar: hsl(0, 0%, 98%);
}

.dark {
${darkVars}

  /* Brand colors */
  --color-brand: hsl(217, 91%, 60%);
  --color-brand-foreground: white;

  /* Layout */
  --background: hsl(0, 0%, 4%);
  --foreground: hsl(0, 0%, 98%);
  --muted: hsl(0, 0%, 9%);
  --muted-foreground: hsl(0, 0%, 60%);
  --border: hsl(0, 0%, 15%);
  --sidebar: hsl(0, 0%, 4%);
}
`
}

/**
 * Hanzo Documentation Theme
 * Near-black with blue accent
 */
export const hanzoDocsTheme: DocsTheme = {
  name: 'hanzo',
  description: 'Dark theme with blue accent for Hanzo documentation',
  light: lightDocsVariables,
  dark: darkDocsVariables,
  css: generateCSS(lightDocsVariables, darkDocsVariables),
}

/**
 * Get CSS variables as a style object (for inline styles)
 */
export function getDocsStyleObject(mode: 'light' | 'dark' = 'light'): Record<string, string> {
  return mode === 'dark' ? darkDocsVariables : lightDocsVariables
}

/**
 * Apply docs theme to document
 */
export function applyDocsTheme(mode: 'light' | 'dark' = 'light') {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const variables = mode === 'dark' ? darkDocsVariables : lightDocsVariables

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

export default hanzoDocsTheme
