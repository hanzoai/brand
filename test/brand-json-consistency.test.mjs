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

import { BRANDS, toBrandContract } from '../dist/index.mjs'

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
})

test('registry Hanzo theme agrees with brand.json theme', () => {
  const h = BRANDS.hanzo
  const j = brandJson.brand.theme
  assert.equal(h.theme.light.accent1, j.light.accent1, 'light accent1')
  assert.equal(h.theme.dark.accent1, j.dark.accent1, 'dark accent1')
  assert.equal(h.theme.light.surface1, j.light.surface1, 'light surface1')
  assert.equal(h.theme.dark.surface1, j.dark.surface1, 'dark surface1')
})

test('brand.json still satisfies the id BrandContract via toBrandContract', () => {
  // toBrandContract(Hanzo) must produce the same identity brand.json advertises.
  const c = toBrandContract(BRANDS.hanzo)
  assert.equal(c.name, brandJson.brand.name)
  assert.equal(c.appDomain, brandJson.brand.appDomain)
})
