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
  toBrand,
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

test('SECURITY: homoglyph / IDN / punycode hosts never impersonate a brand', () => {
  // A Unicode lookalike of a brand host is a DIFFERENT byte string than the
  // ASCII suffix, so it must fall through to the default — never inherit the
  // brand it visually mimics.
  const homoglyphs = [
    'luх.network',   // Cyrillic 'х' (U+0445) for ASCII 'x'
    'lüx.network',   // u-umlaut
    'lux.nеtwork',   // Cyrillic 'е' (U+0435) for ASCII 'e'
    'ｌｕｘ.network',   // fullwidth l/u/x
    'zoo.ngο',       // Greek omicron (U+03BF) for ASCII 'o'
    'xn--lux-8cd.network', // a punycode label is not the ASCII suffix
  ]
  for (const host of homoglyphs) {
    assert.equal(brandFromHost(host), DEFAULT_BRAND, `${host} must NOT match a brand suffix`)
    assert.equal(isKnownBrandHost(host), false, `${host} is not a known brand host`)
  }
})

test('SECURITY: control-char / null / injection hosts never impersonate a brand', () => {
  // Trim only strips leading/trailing whitespace; an embedded control char or a
  // null byte keeps the host from matching a suffix -> default (fail-safe).
  const junk = [
    'lux.network\u0000',        // trailing null byte
    'lux.network\u0000.evil.com',
    'lux.network\nevil.com',    // embedded newline (not at an end -> not trimmed)
    'lux.network\revil.com',
    'evil.com\nlux.network',
    'lux.network/evil.com',     // path junk
    'lux.network?x=zoo.ngo',    // query junk
    'lux.network#zoo.ngo',
    'lux.network@evil.com',     // userinfo-looking junk
    'evil.com@lux.network',
    ' lux .network',            // internal space
    'lux\t.network',            // internal tab
    'lux..network',             // empty interior label
  ]
  for (const host of junk) {
    assert.equal(brandFromHost(host), DEFAULT_BRAND, `${JSON.stringify(host)} must fall to default`)
  }
})

test('SECURITY: IP / localhost hosts resolve to the default brand', () => {
  for (const host of ['127.0.0.1', '[::1]', '[::1]:8080', 'localhost', '192.168.1.1:3000', '0x7f.0.0.1']) {
    assert.equal(brandFromHost(host), DEFAULT_BRAND, `${host} -> default`)
  }
})

test('WHITE-LABEL: a trailing-dot FQDN resolves to ITS brand (not the default)', () => {
  // A trailing root dot is a valid FQDN form (browsers/proxies can send it).
  // It must resolve to the real brand — a Lux FQDN must NOT show the Hanzo
  // default on a Lux deployment. normalizeHost strips the root dot(s).
  assert.equal(brandFromHost('lux.network.'), 'lux')
  assert.equal(brandFromHost('zoo.ngo.'), 'zoo')
  assert.equal(brandFromHost('hanzo.ai.'), 'hanzo')
  assert.equal(brandFromHost('cloud.lux.network.'), 'lux')
  assert.equal(brandFromHost('lux.network..'), 'lux')       // tolerate malformed multi-dot
  assert.equal(brandFromHost('lux.network.:8080'), 'lux')   // port strip runs before dot strip
  assert.equal(brandFromHost('LUX.NETWORK.:443'), 'lux')
  assert.equal(normalizeHost('lux.network.:8080'), 'lux.network')
  assert.equal(isKnownBrandHost('lux.network.'), true)
  // ...but a trailing dot must NOT rescue a lookalike into a sibling brand.
  assert.equal(brandFromHost('lux.network.evil.com.'), DEFAULT_BRAND)
  assert.equal(brandFromHost('evillux.network.'), DEFAULT_BRAND)
})

test('WHITE-LABEL: a multi-suffix host resolves to its rightmost controlling domain', () => {
  // Whoever owns lux.network can create the subdomain `hanzo.ai.lux.network`;
  // it is a Lux-controlled host, so it must resolve to Lux. Symmetrically a
  // `lux.network.hanzo.ai` is Hanzo-controlled -> Hanzo. The dot-boundary match
  // ties the brand to the real registrable domain regardless of embedded labels.
  assert.equal(brandFromHost('hanzo.ai.lux.network'), 'lux')
  assert.equal(brandFromHost('zoo.ngo.lux.network'), 'lux')
  assert.equal(brandFromHost('lux.network.hanzo.ai'), 'hanzo')
  assert.equal(brandFromHost('lux.network.zoo.ngo'), 'zoo')
})

test('SECURITY: a broad lookalike sweep never yields a non-default sibling brand', () => {
  // The load-bearing property: for ANY host, brandFromHost either returns the
  // brand of the host's genuine dot-boundary/exact suffix match, or the default.
  // Recompute the intended answer independently and assert brandFromHost never
  // returns a DIFFERENT non-default brand (that would be cross-contamination).
  const suffixes = HOST_BRANDS.map((e) => [e.suffix, e.brand])
  const intended = (raw) => {
    const h = (raw ?? '').trim().toLowerCase().replace(/:\d+$/, '').replace(/\.+$/, '')
    if (!h) return DEFAULT_BRAND
    for (const [suf, brand] of suffixes) if (h === suf || h.endsWith('.' + suf)) return brand
    return DEFAULT_BRAND
  }
  const corpus = [
    'lux.network.evil.com', 'evillux.network', 'notzoo.ngo', 'zoo.ngo.attacker.io',
    'hanzo.ai.phish.net', 'xlux.cloud', 'pars.networkx', 'faketlux.network',
    'myhanzo.ai', 'ahanzo.chat', 'superzoo.ngo', '7stars.dev.evil.com', 'not7stars.dev',
    'luxxnetwork.com', 'lux-network.com', 'lux_network.evil.com', '.lux.network',
    'hanzo.ai.lux.network', 'lux.network.hanzo.ai', 'zoo.ngo.lux.network',
    'lux.network.', 'zoo.ngo.', 'cloud.lux.network.', 'a.b.c.lux.network',
    'a'.repeat(300) + '.lux.network', 'lux.network' + '.x'.repeat(200),
  ]
  for (const host of corpus) {
    const got = brandFromHost(host)
    const want = intended(host)
    // Never leak a non-default brand that disagrees with the independent model.
    assert.ok(
      got === want || got === DEFAULT_BRAND,
      `${JSON.stringify(host)}: got ${got}, intended ${want} (a non-default mismatch is cross-contamination)`,
    )
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

test('toBrand projects a BrandIdentity to the id runtime contract', () => {
  const c = toBrand(BRANDS.hanzo)
  assert.equal(c.name, 'Hanzo')
  assert.equal(c.appDomain, 'hanzo.ai')
  assert.equal(c.description, BRANDS.hanzo.tagline)
  assert.ok(c.logoUrl.startsWith('https://'))
  assert.equal(c.github, BRANDS.hanzo.social.github)
  // shape: exactly the id Brand keys, no leakage of internal fields
  assert.ok(!('mark' in c), 'contract does not leak the inline mark geometry')
  assert.ok(!('theme' in c), 'contract does not leak theme tokens')
})

test('HOST_BRANDS covers all four primary brands', () => {
  for (const brand of ['hanzo', 'lux', 'zoo', 'pars']) {
    assert.ok(HOST_BRANDS.some((e) => e.brand === brand), `HOST_BRANDS has a ${brand} suffix`)
  }
})

// Every asset URL names its own version. `@latest` resolves when the browser
// asks, so the bytes behind a login page can change with no release here — and
// jsDelivr keeps serving a file from a version that no longer ships it, which
// no explicit version reproduces. A pinned specifier is the whole guard.
test('asset URLs pin a version', () => {
  for (const b of Object.values(BRANDS)) {
    for (const url of [b.logoUrl, b.faviconUrl]) {
      assert.ok(url.startsWith('https://'), `${b.id}: ${url} is not absolute`)
      assert.ok(!url.includes('@latest'), `${b.id}: ${url} floats on @latest`)
      const spec = url.slice('https://cdn.jsdelivr.net/npm/'.length)
      assert.match(spec, /^@[a-z0-9-]+\/[a-z0-9-]+@\d+\.\d+\.\d+\//,
        `${b.id}: ${url} does not name a version`)
    }
  }
})
