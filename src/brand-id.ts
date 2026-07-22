/**
 * Brand identity + hostname → brand resolution — the white-label core.
 *
 * ONE home for "which brand is this host?". Every surface (console, id,
 * hanzo.ai, chat, insights) resolves the active brand through `brandFromHost`
 * so a face NEVER crosses brands: a `lux.network` host is the Lux brand, a
 * `zoo.ngo` host is the Zoo brand — never Hanzo. That non-cross-contamination
 * is the white-label invariant.
 *
 * Pure module: no React, no brand data, no `@hanzo/logo`. A consumer that only
 * needs host → id (a server route, a middleware) imports just this. The brand
 * id is also the IAM org slug (hanzo/lux/zoo/pars), so it keys the registry,
 * the marks, and the org scope alike.
 */

/** Every brand id. Also the IAM org slug. */
export type BrandId = 'hanzo' | 'lux' | 'zoo' | 'pars' | '7stars' | 'yotoda'

/** The default brand when a host matches nothing (the canonical primary). */
export const DEFAULT_BRAND: BrandId = 'hanzo'

/** Every brand id, in registry order. */
export const BRAND_IDS: readonly BrandId[] = ['hanzo', 'lux', 'zoo', 'pars', '7stars', 'yotoda']

/**
 * Hostname suffix → brand. First match wins. One suffix covers every subdomain
 * (`cloud.lux.network`, `id.lux.network`, …) via the `endsWith('.'+suffix)`
 * match. The suffix set is the single source of the host→brand mapping across
 * the fleet — do not re-implement it per surface.
 */
export const HOST_BRANDS: ReadonlyArray<{ readonly suffix: string; readonly brand: BrandId }> = [
  { suffix: 'hanzo.ai', brand: 'hanzo' },
  { suffix: 'hanzo.id', brand: 'hanzo' },
  { suffix: 'hanzo.chat', brand: 'hanzo' },
  { suffix: 'hanzo.cloud', brand: 'hanzo' },
  { suffix: 'lux.network', brand: 'lux' },
  { suffix: 'lux.cloud', brand: 'lux' },
  { suffix: 'lux.id', brand: 'lux' },
  { suffix: 'lux.exchange', brand: 'lux' },
  { suffix: 'zoo.ngo', brand: 'zoo' },
  { suffix: 'zoo.network', brand: 'zoo' },
  { suffix: 'zoo.cloud', brand: 'zoo' },
  { suffix: 'zoolabs.id', brand: 'zoo' },
  { suffix: 'pars.network', brand: 'pars' },
  { suffix: 'pars.cloud', brand: 'pars' },
  { suffix: 'pars.id', brand: 'pars' },
  { suffix: 'pars.vote', brand: 'pars' },
  // White-label cloud tenants seeded as orgs in the Hanzo IAM. One suffix each
  // covers every subdomain. `adminDomain` is a security boundary.
  { suffix: '7stars.dev', brand: '7stars' },
  { suffix: 'yotoda.tech', brand: 'yotoda' },
]

/** Normalize a host for matching: trim, lowercase, strip trailing port, strip
 *  the FQDN root dot(s).
 *  Order is load-bearing: trim BEFORE the port strip so a padded `"host:port "`
 *  still loses its port (the `:\d+$` anchor would otherwise miss past trailing
 *  space); strip the port BEFORE the trailing dot so an FQDN-with-port
 *  (`"lux.network.:8080"`) collapses to the bare host. Stripping the trailing
 *  root dot(s) is semantically neutral — `lux.network.` and `lux.network` are
 *  the same host — so it resolves a real brand FQDN to ITS brand (not the
 *  default) without ever widening a match to a sibling brand: whatever a host's
 *  registrable domain is, removing trailing root dots cannot change it. */
export function normalizeHost(host?: string | null): string {
  return (host ?? '').trim().toLowerCase().replace(/:\d+$/, '').replace(/\.+$/, '')
}

/**
 * Resolve the brand id from a hostname (port/case-insensitive). Exact suffix or
 * dot-boundary subdomain match only — `lux.network.evil.com` does NOT match
 * `lux.network` (it is neither equal nor `.lux.network`-suffixed), so a lookalike
 * host can never impersonate a brand. An unrecognized host resolves to the
 * default (`hanzo`).
 */
export function brandFromHost(host?: string | null): BrandId {
  const hostname = normalizeHost(host)
  if (hostname) {
    for (const e of HOST_BRANDS) {
      if (hostname === e.suffix || hostname.endsWith('.' + e.suffix)) return e.brand
    }
  }
  return DEFAULT_BRAND
}

/** True when the host maps to an explicitly-registered brand (not the default fallback). */
export function isKnownBrandHost(host?: string | null): boolean {
  const hostname = normalizeHost(host)
  if (!hostname) return false
  return HOST_BRANDS.some((e) => hostname === e.suffix || hostname.endsWith('.' + e.suffix))
}
