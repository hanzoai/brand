/**
 * @hanzo/brand - Official brand assets and design system for Hanzo AI
 */

export * from './colors'
export { hanzoRed, hanzoRedRGB } from './colors'
export * from './typography'
export * from './logos'
export * from './tokens'
export * from './themes'
export * from './utils'
export * from './docs'

// README hero + social (og:image) card generator
export { renderHero } from './hero'
export type { HeroOptions } from './hero'

// Social-card toolkit — post / announcement / quote / showcase cards
export { renderPost, renderAnnouncement, renderQuote, renderShowcase, mark } from './cards'
export type { Palette, PostCard, AnnouncementCard, QuoteCard, ShowcaseCard } from './cards'

// Brand runtime config (brand.json) — single source of truth
export { brand } from './brand'
export type { BrandConfig, BrandTheme, RuntimeConfig } from './brand-types'
export { loadBrand, getBrandUrl, getDocsUrl, getGatewayUrl, getWsUrl, getRpcUrl } from './loader'

// White-label brand registry + host resolver — the multi-brand layer
// (hanzo / lux / zoo / pars + white-label tenants). `getBrand(host)` resolves
// the active brand by hostname; a lux/zoo/pars host never resolves to Hanzo.
export * from './registry'

// Legacy brand config (company info, SEO, social)
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