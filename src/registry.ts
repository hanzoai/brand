/**
 * The fleet brand registry — GLOBAL brand settings as data + white-label
 * resolution. ONE home for "who is this brand?" across every surface
 * (console, id, hanzo.ai, chat, insights). Consolidates what used to be
 * duplicated per surface: console's per-brand identity (`src/lib/branding/
 * brands.ts` + the `BRANDS`/`HOST_BRANDS` tables in `src/config`), id's
 * `BrandContract`, and hanzo.ai / insights hardcoded brand strings.
 *
 * DRY + orthogonal:
 *   - host → id           lives in `./brand-id` (the pure resolver).
 *   - mark geometry       lives in `./marks` (Hanzo via `@hanzo/logo`).
 *   - identity data       lives HERE, keyed by the same `BrandId`.
 * A `lux.network` surface resolves to the Lux identity + Lux mark — never
 * Hanzo's. That non-cross-contamination is the white-label invariant.
 */
import { type BrandId, brandFromHost, DEFAULT_BRAND } from './brand-id'
import { type BrandMark, BRAND_MARKS } from './marks'
import type { BrandTheme } from './brand-types'

export type { BrandId }
export { brandFromHost, DEFAULT_BRAND, HOST_BRANDS, isKnownBrandHost, normalizeHost, BRAND_IDS } from './brand-id'
export { type BrandMark, BRAND_MARKS, renderMarkSVG } from './marks'

/** Social links rendered in footers / brand headers. All optional. */
export interface BrandSocial {
  readonly twitter?: string
  readonly github?: string
  readonly discord?: string
  readonly linkedin?: string
  readonly farcaster?: string
}

/**
 * A brand's identity — the cross-surface white-label record. A superset of the
 * fields every surface needs: display + legal names, the primary/admin/docs
 * domains, the accent + light/dark theme tokens, social links, and the inline
 * mark geometry. The `id` is also the IAM org slug.
 */
export interface BrandIdentity {
  /** Stable id — also the IAM org slug. */
  readonly id: BrandId
  /** Display name / wordmark ("Hanzo", "Lux", "Zoo", "Pars"). */
  readonly name: string
  /** Browser-tab / SEO title ("Hanzo AI"). */
  readonly title: string
  /** Short marketing tagline. */
  readonly tagline: string
  /** Legal / org name — footers + copyright ("Hanzo AI Inc."). */
  readonly legalName: string
  /** Primary marketing domain, bare host ("hanzo.ai"). */
  readonly domain: string
  /** Documentation domain ("docs.hanzo.ai"). */
  readonly docsDomain: string
  /**
   * Email domain an operator must hold to reach this brand's admin console —
   * a SECURITY boundary (matches console `adminDomain`). Usually == `domain`.
   */
  readonly adminDomain: string
  /** Signature accent color (spinners, links, focus). Monochrome brands use white. */
  readonly accentColor: string
  /** Light/dark theme tokens (accent1/surface/neutral …). */
  readonly theme: { readonly light: BrandTheme; readonly dark: BrandTheme }
  /** Social links (footer). */
  readonly social: BrandSocial
  /** Inline mark geometry (white-label; Hanzo sourced from `@hanzo/logo`). */
  readonly mark: BrandMark
  /** CDN logo URL — for `<img>` / link consumers (e.g. the id runtime loader). */
  readonly logoUrl: string
  /** CDN favicon URL. */
  readonly faviconUrl: string
}

/**
 * The runtime brand contract every per-org brand package satisfies — the shape
 * `@hanzo/id`'s portal reads via `loadBrand()`. Kept byte-compatible with
 * `@hanzo/id-shared`'s `BrandContract` so id-shared can re-export THIS as the
 * single source. Projected from a `BrandIdentity` by `toBrandContract`.
 */
export interface BrandContract {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly appDomain: string
  readonly logoUrl: string
  readonly faviconUrl: string
  /**
   * CDN wordmark URL — the logotype, where a brand has one distinct from its
   * mark. Optional because most do not: Hanzo, Zoo and Pars all ship a square
   * mark and nothing else, and a wordmark faked by scaling one is not a wordmark.
   * A consumer that wants a logotype and will settle for a mark reads
   * `wordmarkUrl ?? logoUrl`; one that wants the mark reads `logoUrl` and gets it.
   *
   * The two are different pictures and they were the same URL on Lux, which is
   * how "the Lux logo" resolved to a 63x17 wordmark on every surface that asked
   * for a mark. @luxfi/brand 1.1.2 separates them.
   */
  readonly wordmarkUrl?: string
  readonly accentColor?: string
  readonly twitter?: string
  readonly github?: string
  readonly discord?: string
}

// Monochrome theme shared by the monochrome brands (Hanzo, Lux) — mirrors
// brand.json's Hanzo theme (accent flips black↔white with the scheme).
const MONO_LIGHT: BrandTheme = { accent1: '#000000', surface1: '#FFFFFF', surface2: '#FAFAFA', neutral1: '#0A0A0A', neutral2: 'rgba(10, 10, 10, 0.6)' }
const MONO_DARK: BrandTheme = { accent1: '#FFFFFF', surface1: '#000000', surface2: '#111111', neutral1: '#FAFAFA', neutral2: 'rgba(250, 250, 250, 0.6)' }

/** jsDelivr CDN base for a brand package's shipped asset. */
const cdn = (pkg: string, path: string) => `https://cdn.jsdelivr.net/npm/${pkg}@latest/${path}`

// Hanzo — canonical. Identity mirrors `brand.json` (kept in sync by
// test/brand-json-consistency.test.mjs); mark is the `@hanzo/logo` block-H.
const HANZO: BrandIdentity = {
  id: 'hanzo',
  name: 'Hanzo',
  title: 'Hanzo AI',
  tagline: 'Enterprise AI infrastructure and frontier models',
  legalName: 'Hanzo AI Inc.',
  domain: 'hanzo.ai',
  docsDomain: 'docs.hanzo.ai',
  adminDomain: 'hanzo.ai',
  accentColor: '#FFFFFF',
  theme: { light: MONO_LIGHT, dark: MONO_DARK },
  social: {
    twitter: 'https://x.com/hanzoai',
    github: 'https://github.com/hanzoai',
    discord: 'https://discord.gg/CJCyAsm9Vr',
    linkedin: 'https://linkedin.com/company/hanzoai',
  },
  mark: BRAND_MARKS.hanzo,
  logoUrl: cdn('@hanzo/brand', 'assets/logo/logo.svg'),
  faviconUrl: cdn('@hanzo/brand', 'assets/logo/favicon.svg'),
}

// Lux — Lux Industries Inc. (lux.network). Monochrome mark (downward triangle).
const LUX: BrandIdentity = {
  id: 'lux',
  name: 'Lux',
  title: 'Lux Network',
  tagline: 'High-performance, post-quantum blockchain infrastructure',
  legalName: 'Lux Industries Inc.',
  domain: 'lux.network',
  docsDomain: 'docs.lux.network',
  adminDomain: 'lux.network',
  accentColor: '#FFFFFF',
  theme: { light: MONO_LIGHT, dark: MONO_DARK },
  social: {
    twitter: 'https://x.com/luxdefi',
    github: 'https://github.com/luxfi',
    discord: 'https://discord.gg/lux',
  },
  mark: BRAND_MARKS.lux,
  logoUrl: cdn('@luxfi/brand', 'assets/logo/logo.svg'),
  faviconUrl: cdn('@luxfi/brand', 'assets/logo/favicon.svg'),
}

// Zoo — Zoo Labs Foundation (zoo.ngo). The one full-color mark (CMYK circles).
const ZOO: BrandIdentity = {
  id: 'zoo',
  name: 'Zoo',
  title: 'Zoo',
  tagline: 'Open, decentralized AI & science research network',
  legalName: 'Zoo Labs Foundation',
  domain: 'zoo.ngo',
  docsDomain: 'docs.zoo.ngo',
  adminDomain: 'zoo.ngo',
  accentColor: '#01ACF1',
  theme: {
    light: { ...MONO_LIGHT, accent1: '#01ACF1' },
    dark: { ...MONO_DARK, accent1: '#01ACF1' },
  },
  social: {
    twitter: 'https://x.com/zoo_labs',
    github: 'https://github.com/zooai',
    discord: 'https://discord.gg/zoo',
  },
  mark: BRAND_MARKS.zoo,
  logoUrl: cdn('@zooai/brand', 'assets/logo/logo.svg'),
  faviconUrl: cdn('@zooai/brand', 'assets/logo/logo.svg'),
}

// Pars — Parsis Foundation (pars.network). Persian 8-pointed star, gold accent.
const PARS: BrandIdentity = {
  id: 'pars',
  name: 'Pars',
  title: 'Pars Network',
  tagline: 'A sovereign, verifiable identity layer for the Pars community',
  legalName: 'Parsis Foundation',
  domain: 'pars.network',
  docsDomain: 'docs.pars.network',
  adminDomain: 'pars.network',
  accentColor: '#caa24a',
  theme: {
    light: { ...MONO_LIGHT, accent1: '#caa24a' },
    dark: { ...MONO_DARK, accent1: '#caa24a' },
  },
  social: {
    twitter: 'https://x.com/parsnetwork',
    github: 'https://github.com/parsdao',
  },
  mark: BRAND_MARKS.pars,
  logoUrl: cdn('@parsdao/brand', 'assets/logo/logo.svg'),
  faviconUrl: cdn('@parsdao/brand', 'assets/logo/logo.svg'),
}

// White-label Hanzo-cloud tenants seeded as orgs in the Hanzo IAM. Own
// name/legal/domain (adminDomain is a security boundary); the Hanzo mark is a
// stand-in until a bespoke one ships.
const SEVENSTARS: BrandIdentity = {
  id: '7stars',
  name: '7Stars',
  title: '7Stars',
  tagline: 'Cloud, powered by Hanzo',
  legalName: '7Stars',
  domain: '7stars.dev',
  docsDomain: 'docs.7stars.dev',
  adminDomain: '7stars.dev',
  accentColor: '#FFFFFF',
  theme: { light: MONO_LIGHT, dark: MONO_DARK },
  social: {},
  mark: BRAND_MARKS['7stars'],
  logoUrl: HANZO.logoUrl,
  faviconUrl: HANZO.faviconUrl,
}

const YOTODA: BrandIdentity = {
  id: 'yotoda',
  name: 'Yotoda',
  title: 'Yotoda',
  tagline: 'Cloud, powered by Hanzo',
  legalName: 'Yotoda',
  domain: 'yotoda.tech',
  docsDomain: 'docs.yotoda.tech',
  adminDomain: 'yotoda.tech',
  accentColor: '#FFFFFF',
  theme: { light: MONO_LIGHT, dark: MONO_DARK },
  social: {},
  mark: BRAND_MARKS.yotoda,
  logoUrl: HANZO.logoUrl,
  faviconUrl: HANZO.faviconUrl,
}

/** Every brand, keyed by id. The id is also the IAM org slug. */
export const BRANDS: Record<BrandId, BrandIdentity> = {
  hanzo: HANZO,
  lux: LUX,
  zoo: ZOO,
  pars: PARS,
  '7stars': SEVENSTARS,
  yotoda: YOTODA,
}

/**
 * Resolve the active brand identity from a hostname. With an explicit `host`
 * (server routes pass the request Host header) it matches via `brandFromHost`;
 * with no argument it reads `window.location.hostname` in the browser and falls
 * back to the default brand for SSR/build. Host matching is never
 * re-implemented — `./brand-id` owns the one suffix table.
 */
export function getBrand(host?: string | null): BrandIdentity {
  if (host === undefined && typeof window !== 'undefined') {
    return BRANDS[brandFromHost(window.location.hostname)]
  }
  return BRANDS[host === undefined ? DEFAULT_BRAND : brandFromHost(host)]
}

/** Project a `BrandIdentity` to the runtime `BrandContract` (@hanzo/id loader). */
export function toBrandContract(b: BrandIdentity): BrandContract {
  return {
    name: b.name,
    title: b.title,
    description: b.tagline,
    appDomain: b.domain,
    logoUrl: b.logoUrl,
    faviconUrl: b.faviconUrl,
    accentColor: b.accentColor,
    twitter: b.social.twitter,
    github: b.social.github,
    discord: b.social.discord,
  }
}
