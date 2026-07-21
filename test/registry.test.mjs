/**
 * White-label brand registry + resolver tests — run against the BUILT artifact
 * (dist/index.mjs), so they assert what consumers actually import.
 *
 * The load-bearing property is the WHITE-LABEL INVARIANT: a host for one brand
 * must NEVER resolve to another brand's identity or mark. Cross-contamination
 * (a Lux surface showing the Hanzo H) is the threat these tests exist to catch.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  BRANDS,
  BRAND_IDS,
  BRAND_MARKS,
  HOST_BRANDS,
  brandFromHost,
  getBrand,
  isKnownBrandHost,
  normalizeHost,
  renderMarkSVG,
  toBrandContract,
  DEFAULT_BRAND,
} from '../dist/index.mjs'

test('every brand id has a complete identity record', () => {
  for (const id of BRAND_IDS) {
    const b = BRANDS[id]
    assert.equal(b.id, id, `${id}: id field matches key`)
    for (const f of ['name', 'title', 'tagline', 'legalName', 'domain', 'docsDomain', 'adminDomain', 'accentColor']) {
      assert.ok(typeof b[f] === 'string' && b[f].length > 0, `${id}.${f} is a non-empty string`)
    }
    assert.ok(b.mark && b.mark.viewBox && b.mark.content, `${id} has a mark`)
    assert.ok(b.theme.light && b.theme.dark, `${id} has light+dark theme`)
    assert.ok(b.social && typeof b.social === 'object', `${id} has social`)
  }
})

test('brandFromHost resolves each brand host to ITS brand — never another', () => {
  const cases = [
    ['hanzo.ai', 'hanzo'],
    ['cloud.hanzo.ai', 'hanzo'],
    ['hanzo.id', 'hanzo'],
    ['hanzo.chat', 'hanzo'],
    ['lux.network', 'lux'],
    ['cloud.lux.network', 'lux'],
    ['lux.cloud', 'lux'],
    ['lux.id', 'lux'],
    ['zoo.ngo', 'zoo'],
    ['sub.zoo.ngo', 'zoo'],
    ['zoo.network', 'zoo'],
    ['zoolabs.id', 'zoo'],
    ['pars.network', 'pars'],
    ['pars.id', 'pars'],
    ['7stars.dev', '7stars'],
    ['console.7stars.dev', '7stars'],
    ['yotoda.tech', 'yotoda'],
  ]
  for (const [host, want] of cases) {
    assert.equal(brandFromHost(host), want, `${host} -> ${want}`)
  }
})

test('resolution is port- and case-insensitive', () => {
  assert.equal(brandFromHost('LUX.NETWORK:8443'), 'lux')
  assert.equal(brandFromHost('  Cloud.Zoo.Ngo:3000  '), 'zoo')
  assert.equal(normalizeHost('HANZO.AI:443'), 'hanzo.ai')
})

test('SECURITY: lookalike / suffix-confusion hosts never impersonate a brand', () => {
  // A lookalike domain that merely CONTAINS a brand suffix must fall through to
  // the default — it must not inherit lux/zoo/pars branding.
  const attackers = [
    'lux.network.evil.com', // suffix as a subdomain prefix of an attacker domain
    'evillux.network',      // no dot boundary before the suffix
    'notzoo.ngo',           // no dot boundary
    'zoo.ngo.attacker.io',  // brand suffix buried mid-host
    'hanzo.ai.phish.net',
    'xlux.cloud',
    'pars.networkx',        // suffix is a prefix of the real label
  ]
  for (const host of attackers) {
    assert.equal(brandFromHost(host), DEFAULT_BRAND, `${host} must NOT match a brand suffix`)
    assert.equal(isKnownBrandHost(host), false, `${host} is not a known brand host`)
  }
})

test('unknown / empty host falls back to the default brand', () => {
  assert.equal(brandFromHost('example.com'), DEFAULT_BRAND)
  assert.equal(brandFromHost(''), DEFAULT_BRAND)
  assert.equal(brandFromHost(null), DEFAULT_BRAND)
  assert.equal(brandFromHost(undefined), DEFAULT_BRAND)
  assert.equal(isKnownBrandHost('example.com'), false)
})

test('getBrand(host) returns the full identity for the resolved brand', () => {
  assert.equal(getBrand('lux.network').id, 'lux')
  assert.equal(getBrand('lux.network').name, 'Lux')
  assert.equal(getBrand('zoo.ngo').legalName, 'Zoo Labs Foundation')
  assert.equal(getBrand('example.com').id, DEFAULT_BRAND)
  assert.equal(getBrand().id, DEFAULT_BRAND) // no host, no window -> default
})

test('WHITE-LABEL INVARIANT: distinct brands have distinct marks (no cross-contamination)', () => {
  // Hanzo, Lux, Zoo, Pars must each render a DIFFERENT mark. If any two share
  // geometry, a surface could show the wrong brand's logo.
  const primaries = ['hanzo', 'lux', 'zoo', 'pars']
  const seen = new Map()
  for (const id of primaries) {
    const content = BRAND_MARKS[id].content
    assert.ok(!seen.has(content), `${id} mark is distinct from ${seen.get(content)}`)
    seen.set(content, id)
  }
  // Concretely: the Lux/Zoo/Pars marks do NOT contain the Hanzo H path.
  const hanzoPath = 'M22.21 67V44.6369H0V67H22.21Z'
  for (const id of ['lux', 'zoo', 'pars']) {
    assert.ok(!BRAND_MARKS[id].content.includes(hanzoPath), `${id} mark does not embed the Hanzo H`)
  }
  assert.ok(BRAND_MARKS.hanzo.content.includes(hanzoPath), 'hanzo mark IS the block-H')
})

test('renderMarkSVG produces a themed SVG; the colored Zoo mark keeps its fills', () => {
  const lux = renderMarkSVG('lux', { size: 40, color: '#abc' })
  assert.match(lux, /^<svg /)
  assert.match(lux, /viewBox="0 0 100 100"/)
  assert.match(lux, /fill="#abc"/) // monochrome mark takes the requested color
  assert.match(lux, /width="40" height="40"/)

  const zoo = renderMarkSVG('zoo', { color: '#abc' })
  // The intrinsically-colored Zoo mark must NOT be recolored on the root svg.
  assert.ok(!/<svg[^>]*fill="#abc"/.test(zoo), 'zoo root <svg> has no overriding fill')
  assert.match(zoo, /#01ACF1|#EA018E|#00A652/) // keeps its CMYK fills
})

test('toBrandContract projects a BrandIdentity to the id runtime contract', () => {
  const c = toBrandContract(BRANDS.hanzo)
  assert.equal(c.name, 'Hanzo')
  assert.equal(c.appDomain, 'hanzo.ai')
  assert.equal(c.description, BRANDS.hanzo.tagline)
  assert.ok(c.logoUrl.startsWith('https://'))
  assert.equal(c.github, BRANDS.hanzo.social.github)
  // shape: exactly the id BrandContract keys, no leakage of internal fields
  assert.ok(!('mark' in c), 'contract does not leak the inline mark geometry')
  assert.ok(!('theme' in c), 'contract does not leak theme tokens')
})

test('HOST_BRANDS covers all four primary brands', () => {
  for (const brand of ['hanzo', 'lux', 'zoo', 'pars']) {
    assert.ok(HOST_BRANDS.some((e) => e.brand === brand), `HOST_BRANDS has a ${brand} suffix`)
  }
})
