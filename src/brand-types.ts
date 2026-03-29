/**
 * Brand configuration types for white-label exchange deployments.
 * These types define the shape of brand.json — the single source of truth
 * for all branding, theming, chain config, and service endpoints.
 *
 * Used by:
 * - @luxfi/brand and @zooai/brand (brand packages)
 * - @l.x/config in the exchange app (runtime consumer)
 * - K8s ConfigMaps (generated from brand.json)
 */

/** Theme color overrides for a single color scheme (light or dark).
 * All fields optional — only override what you want to customize.
 * The exchange UI is monochrome by default; accent1 is the primary brand color.
 */
export interface BrandTheme {
  /** Primary accent color (buttons, links, active states) */
  accent1?: string
  /** Accent hover state */
  accent1Hovered?: string
  /** Secondary accent (auto-derived from accent1 + surface1 if not set) */
  accent2?: string
  /** Tertiary accent */
  accent3?: string
  /** Primary background */
  surface1?: string
  /** Secondary background (cards, panels) */
  surface2?: string
  /** Tertiary background (inputs, wells) */
  surface3?: string
  /** Primary text */
  neutral1?: string
  /** Secondary text */
  neutral2?: string
  /** Tertiary text */
  neutral3?: string
  /** Text on accent backgrounds (auto-derived from accent1 if not set) */
  neutralContrast?: string
  /** Page background (defaults to surface1) */
  background?: string
  /** Success color */
  statusSuccess?: string
  /** Error color */
  statusCritical?: string
  /** Warning color */
  statusWarning?: string
  /** Overlay/scrim color */
  scrim?: string
}

/** Full brand identity configuration. */
export interface BrandConfig {
  name: string
  title: string
  description: string
  shortName: string
  labsName: string
  legalEntity: string
  walletName: string
  protocolName: string
  copyrightHolder: string

  // Domains
  appDomain: string
  docsDomain: string
  infoDomain: string
  gatewayDomain: string
  wsDomain: string

  // Links
  helpUrl: string
  termsUrl: string
  privacyUrl: string
  downloadUrl: string

  // Contact
  complianceEmail: string
  supportEmail: string

  // Social
  twitter: string
  farcaster: string
  linkedin: string
  tiktok: string
  github: string
  discord: string

  // Assets
  logoUrl: string
  faviconUrl: string
  primaryColor: string

  // Chain defaults
  defaultChainId: number
  supportedChainIds: number[]

  // Third-party
  walletConnectProjectId: string
  insightsHost: string
  insightsApiKey: string

  // Theme overrides (dark + light)
  theme?: {
    light?: BrandTheme
    dark?: BrandTheme
  }
}

/** Runtime configuration loaded from brand.json / config.json */
export interface RuntimeConfig {
  brand: Partial<BrandConfig>
  chains: {
    defaultChainId: number
    supported: number[]
  }
  rpc: Record<string, string>
  api: {
    graphql: string
    gateway: string
    insights: string
  }
  iam?: {
    provider: string
    clientId: string
  }
  walletConnect: {
    projectId: string
  }
}
