# @hanzo/brand

Official brand assets, design system, AND the fleet white-label registry for
Hanzo. Published as `@hanzo/brand` on npm. Exports the multi-brand registry +
host resolver (hanzo / lux / zoo / pars + white-label tenants), colors,
typography, themes, design tokens, logo components, and CSS variables.

## Stack
- TypeScript 5, tsup (CJS + ESM + DTS output)
- Runtime dep: `@hanzo/logo` (the ONE home of the Hanzo block-H geometry —
  consumed via `MARK_PATHS` / `MARK_VIEWBOX`; never re-typed here)
- React is an OPTIONAL peer (only the logo components need it)
- Outputs: `dist/index.{js,mjs,d.ts}`, plus `./loader`, `./hero`

## White-label registry (the multi-brand layer)
ONE home for "who is this brand?" across every surface. A `lux.network` /
`zoo.ngo` / `pars.network` host resolves to ITS brand + mark — NEVER Hanzo's.
That non-cross-contamination is the white-label invariant (test/registry.test.mjs).

```
src/brand-id.ts   # BrandId + HOST_BRANDS suffix table + brandFromHost(host)
                  #   the pure resolver (no React, no data). Exact suffix /
                  #   dot-boundary match — lookalike hosts can't impersonate.
src/marks.ts      # BRAND_MARKS: per-brand inline mark geometry. Hanzo mark =
                  #   @hanzo/logo MARK_PATHS. renderMarkSVG(id) string helper.
src/registry.ts   # BrandIdentity + BRANDS registry + getBrand(host) +
                  #   toBrandContract() (projects to @hanzo/id's BrandContract).
```

Key API:
```ts
import { getBrand, brandFromHost, BRANDS, BrandLogo, renderMarkSVG, toBrandContract } from '@hanzo/brand'

getBrand('lux.network')      // -> BrandIdentity { id:'lux', name:'Lux', mark, ... }
brandFromHost('zoo.ngo')     // -> 'zoo'
<BrandLogo />                // React: auto-resolves the mark by window.location.hostname
<BrandLogo brand="lux" />    // React: explicit brand mark
renderMarkSVG('pars')        // framework-agnostic inline SVG string
toBrandContract(BRANDS.zoo)  // -> the @hanzo/id runtime BrandContract shape
```

## Structure
```
src/
  index.ts        # Main entry - re-exports all modules, auto-applies theme in browser
  brand-id.ts     # BrandId, HOST_BRANDS, brandFromHost, isKnownBrandHost, normalizeHost
  marks.ts        # BRAND_MARKS (hanzo/lux/zoo/pars marks), renderMarkSVG
  registry.ts     # BrandIdentity, BRANDS, getBrand, toBrandContract, BrandContract
  logos.tsx       # HanzoLogo/HanzoLogoSVG/HanzoFavicon (consume @hanzo/logo) + BrandLogo
  colors.ts       # Monochrome palette: Hanzo Black (#0a0a0b) ↔ Hanzo White (#fff), neutral scale, status semantics
  typography.ts   # Font families (Geist Sans, Geist Mono), sizes, weights, line heights
  themes.ts       # Light/dark theme definitions, applyTheme() helper
  tokens.ts       # Design tokens (spacing, radius, shadows, transitions)
  config.ts       # Company info, social links, domains, SEO defaults
  hero.ts, cards.ts, cli.ts  # README hero + social-card toolkit + `hanzo-brand` CLI
  utils.ts, docs.ts
brand.json        # Hanzo runtime BrandContract (id portal fetches this; kept in
                  #   sync with the registry Hanzo entry by a consistency test)
test/             # node:test suites run against the BUILT dist (npm test)
styles/variables.css
```

## Commands
```bash
npm install        # Install dev deps
npm run build      # Build with tsup (CJS + ESM + DTS)
npm run type-check # tsc --noEmit  (the real static gate)
npm test           # build + node --test (13 tests: white-label invariant, suffix
                   #   confusion, brand.json consistency)
```

## Notes
- `@hanzo/logo` is the single source of the Hanzo mark; this package NEVER
  re-types the block-H path data (marks.ts / logos.tsx both consume it).
- The registry's Hanzo entry and `brand.json` are kept in sync by
  test/brand-json-consistency.test.mjs.
- `npm run lint` is currently a no-op error (no ESLint config in-repo); use
  `type-check`.
- Auto-applies dark/light theme on import in browser environments.
- Published with public access to npm registry.
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file.
