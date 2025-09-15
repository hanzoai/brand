/**
 * @hanzo/brand - Official brand assets and design system for Hanzo AI
 */

export * from './colors'
export * from './typography'
export * from './logos'
export * from './tokens'
export * from './themes'
export * from './utils'

// Main brand configuration
export { brandConfig } from './config'

// Quick access exports
export { default as colors } from './colors'
export { default as typography } from './typography'
export { default as logos } from './logos'
export { default as tokens } from './tokens'

// Theme management
import { applyTheme } from './themes'
export { applyTheme }

// Default initialization
if (typeof window !== 'undefined') {
  // Auto-apply theme based on system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(prefersDark ? 'dark' : 'light')
}