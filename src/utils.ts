/**
 * Utility functions for brand usage
 */

import { colors } from './colors'
import { tokens } from './tokens'

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0

  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get relative luminance of a color
 */
function getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Check if color meets WCAG AA contrast requirements
 */
export function meetsContrastAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5
}

/**
 * Check if color meets WCAG AAA contrast requirements
 */
export function meetsContrastAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7
}

/**
 * Generate color palette from base color
 */
export function generatePalette(baseColor: string, name = 'custom') {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return null

  const palette: Record<number, string> = {}
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  steps.forEach((step, index) => {
    const factor = 1 - (index / steps.length)
    const r = Math.round(rgb.r + (255 - rgb.r) * factor)
    const g = Math.round(rgb.g + (255 - rgb.g) * factor)
    const b = Math.round(rgb.b + (255 - rgb.b) * factor)
    palette[step] = rgbToHex(r, g, b)
  })
  
  return palette
}

/**
 * Get spacing value
 */
export function spacing(value: keyof typeof tokens.spacing): string {
  return tokens.spacing[value]
}

/**
 * Get radius value
 */
export function radius(value: keyof typeof tokens.radius): string {
  return tokens.radius[value]
}

/**
 * Get shadow value
 */
export function shadow(value: keyof typeof tokens.shadow): string {
  return tokens.shadow[value]
}

/**
 * Class name utility (similar to clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate Open Graph image URL
 */
export function getOgImageUrl(params: {
  title: string
  description?: string
  logo?: boolean
  theme?: 'light' | 'dark'
}): string {
  const baseUrl = 'https://hanzo.ai/api/og'
  const searchParams = new URLSearchParams({
    title: params.title,
    ...(params.description && { description: params.description }),
    ...(params.logo !== false && { logo: 'true' }),
    theme: params.theme || 'light',
  })
  
  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * Load brand fonts
 */
export function loadFonts() {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = 'https://fonts.googleapis.com'
  document.head.appendChild(link)

  const link2 = document.createElement('link')
  link2.rel = 'preconnect'
  link2.href = 'https://fonts.gstatic.com'
  link2.crossOrigin = 'anonymous'
  document.head.appendChild(link2)

  const fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
  document.head.appendChild(fontLink)
}

export default {
  hexToRgb,
  rgbToHex,
  getContrastRatio,
  meetsContrastAA,
  meetsContrastAAA,
  generatePalette,
  spacing,
  radius,
  shadow,
  cn,
  getOgImageUrl,
  loadFonts,
}