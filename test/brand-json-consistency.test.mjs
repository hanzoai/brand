/**
 * brand.json ⟷ registry consistency.
 *
 * The Hanzo identity lives in TWO artifacts: the typed registry (for TS
 * consumers) and brand.json (the runtime artifact the id portal fetches). They
 * MUST agree — this test fails if they drift, keeping the single-source promise
 * honest without a fragile cross-boundary import.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { BRANDS, toBrand, brandConfig } from '../dist/index.mjs'

const brandJson = JSON.parse(readFileSync(fileURLToPath(new URL('../brand.json', import.meta.url)), 'utf8'))

test('registry Hanzo entry agrees with brand.json', () => {
  const h = BRANDS.hanzo
  const j = brandJson.brand
  assert.equal(h.name, j.name, 'name')
  assert.equal(h.title, j.title, 'title')
  assert.equal(h.tagline, j.description, 'tagline == brand.json description')
  assert.equal(h.legalName, j.legalEntity, 'legalName == brand.json legalEntity')
  assert.equal(h.domain, j.appDomain, 'domain == brand.json appDomain')
  assert.equal(h.docsDomain, j.docsDomain, 'docsDomain')
  assert.equal(h.social.twitter, j.twitter, 'twitter')
  assert.equal(h.social.github, j.github, 'github')
})

test('all THREE identity sources agree on the socials', () => {
  // brandConfig is the third place Hanzo's identity is written, and it drifted
  // unnoticed because this file pinned only six fields: brand.json said
  // x.com/hanaboroshi, the registry said x.com/hanzoai, and brandConfig still
  // pointed at the dead twitter.com domain. Pin every source, not two of three.
  const h = BRANDS.hanzo
  const j = brandJson.brand
  const c = brandConfig.social
  assert.equal(c.twitter, h.social.twitter, 'brandConfig.social.twitter == registry')
  assert.equal(c.twitter, j.twitter, 'brandConfig.social.twitter == brand.json')
  assert.equal(c.github, h.social.github, 'brandConfig.social.github == registry')
  assert.equal(c.github, j.github, 'brandConfig.social.github == brand.json')
  assert.match(c.twitter, /^https:\/\/x\.com\//, 'x.com, never twitter.com')
})

test('registry Hanzo theme agrees with brand.json theme', () => {
  const h = BRANDS.hanzo
  const j = brandJson.brand.theme
  assert.equal(h.theme.light.accent1, j.light.accent1, 'light accent1')
  assert.equal(h.theme.dark.accent1, j.dark.accent1, 'dark accent1')
  assert.equal(h.theme.light.surface1, j.light.surface1, 'light surface1')
  assert.equal(h.theme.dark.surface1, j.dark.surface1, 'dark surface1')
})

test('brand.json still satisfies the id Brand via toBrand', () => {
  // toBrand(Hanzo) must produce the same identity brand.json advertises.
  const c = toBrand(BRANDS.hanzo)
  assert.equal(c.name, brandJson.brand.name)
  assert.equal(c.appDomain, brandJson.brand.appDomain)
})
