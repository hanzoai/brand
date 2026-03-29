import type { BrandConfig, BrandTheme, RuntimeConfig } from './brand-types'

/**
 * Mutable brand singleton — populated by loadBrand() from /brand.json.
 * Import this in your app to read brand values after loading.
 *
 * Usage (in any Lux/Zoo app — exchange, bridge, explorer, wallet):
 *   import { brand, loadBrand } from '@luxfi/brand/loader'
 *   await loadBrand()
 *   console.log(brand.name) // "Lux Exchange"
 */
export const brand: BrandConfig = {
  name: '',
  title: '',
  description: '',
  shortName: '',
  labsName: '',
  legalEntity: '',
  walletName: '',
  protocolName: '',
  copyrightHolder: '',
  appDomain: '',
  docsDomain: '',
  infoDomain: '',
  gatewayDomain: '',
  wsDomain: '',
  helpUrl: '',
  termsUrl: '',
  privacyUrl: '',
  downloadUrl: '',
  complianceEmail: '',
  supportEmail: '',
  twitter: '',
  farcaster: '',
  linkedin: '',
  tiktok: '',
  github: '',
  discord: '',
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  primaryColor: '#FFFFFF',
  defaultChainId: 1,
  supportedChainIds: [],
  walletConnectProjectId: '',
  insightsHost: '',
  insightsApiKey: '',
}

export let runtimeConfig: RuntimeConfig | null = null

/**
 * Load brand config from /brand.json. Call once before rendering.
 * Works identically in exchange, bridge, explorer, wallet.
 */
export async function loadBrand(): Promise<RuntimeConfig> {
  const res = await fetch('/brand.json')
  if (!res.ok) throw new Error(`Failed to load /brand.json: ${res.status}`)
  const config: RuntimeConfig = await res.json()

  // Apply brand overrides
  if (config.brand) {
    Object.assign(brand, config.brand)
  }

  // Derive convenience fields
  const baseName = brand.name.replace(/\s*exchange\s*|\s*bridge\s*|\s*explorer\s*|\s*wallet\s*/i, '').trim()
  if (!brand.shortName && baseName) {
    brand.shortName = baseName.length <= 3 ? baseName.toUpperCase() : baseName
  }
  if (!brand.labsName && baseName) brand.labsName = baseName + ' Labs'
  if (!brand.walletName && baseName) brand.walletName = brand.shortName + ' Wallet'
  if (!brand.protocolName && baseName) brand.protocolName = brand.shortName + ' Protocol'
  if (!brand.copyrightHolder) brand.copyrightHolder = brand.legalEntity

  // Apply chain config
  if (config.chains) {
    brand.defaultChainId = config.chains.defaultChainId ?? brand.defaultChainId
    brand.supportedChainIds = config.chains.supported ?? brand.supportedChainIds
  }

  if (config.walletConnect?.projectId) brand.walletConnectProjectId = config.walletConnect.projectId
  if (config.api?.insights) brand.insightsHost = config.api.insights

  // Update document title + favicon
  if (typeof document !== 'undefined') {
    if (config.brand?.title) document.title = config.brand.title
    if (config.brand?.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
      if (link) link.href = config.brand.faviconUrl
    }
  }

  // Inject theme CSS variables (works for any Tamagui/Spore-based UI)
  if (typeof document !== 'undefined' && brand.theme) {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const bt = prefersDark ? brand.theme.dark : brand.theme.light
    if (bt) {
      const root = document.documentElement
      const set = (prop: string, val?: string) => { if (val) root.style.setProperty(prop, val) }
      set('--accent1', bt.accent1)
      set('--accent1Hovered', bt.accent1Hovered)
      set('--accent2', bt.accent2)
      set('--accent3', bt.accent3)
      set('--surface1', bt.surface1)
      set('--surface2', bt.surface2)
      set('--surface3', bt.surface3)
      set('--neutral1', bt.neutral1)
      set('--neutral2', bt.neutral2)
      set('--neutral3', bt.neutral3)
      if (bt.background || bt.surface1) {
        root.style.setProperty('background', bt.background || bt.surface1 || '')
      }
    }
  }

  runtimeConfig = config
  return config
}

// URL helpers
export function getBrandUrl(path: string): string { return `https://${brand.appDomain}${path}` }
export function getDocsUrl(path: string): string { return `https://${brand.docsDomain}${path}` }
export function getGatewayUrl(path: string): string { return `https://${brand.gatewayDomain}${path}` }
export function getWsUrl(path: string): string { return `wss://${brand.wsDomain}${path}` }
export function getRpcUrl(chainId: number): string | undefined { return runtimeConfig?.rpc?.[String(chainId)] }
