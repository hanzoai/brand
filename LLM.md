# @hanzo/brand

Official brand assets, design system, AND the fleet white-label registry for
Hanzo. Published as `@hanzo/brand` on npm. Exports the multi-brand registry +
host resolver (hanzo / lux / zoo / pars + white-label tenants), colors,
typography, themes, design tokens, logo components, and CSS variables.

## How this ships

One way, and it runs on our own stack:

    push  ->  github.com/hanzoai/brand         (a mirror)
              .github/workflows/sync.yml        carries refs onward
      ->  git.hanzo.ai/hanzoai/brand            CANONICAL
              .hanzo/workflows/publish.yml      publishes @hanzo/brand to npm
              .hanzo/workflows/deploy.yml       builds ghcr.io/hanzoai/brand
      ->  hanzoai/universe crs/brand.yaml       names the tag that is live
      ->  hanzoai/operator                      reconciles the App
      ->  hanzoai/static behind hanzoai/ingress serves brand.hanzo.ai

**git.hanzo.ai is canonical; GitHub is a mirror.** `.github/workflows/` holds
exactly one file, `sync.yml`, and its only job is getting refs to the forge. Every
build, check and publish is a workflow under `.hanzo/workflows/`, which the forge
reads. `.hanzo/workflows` uses GitHub Actions syntax, so a workflow moves between
the two by changing directory and nothing else.

`publish.yml` is the SOLE publisher of `@hanzo/brand`. It fires when the `version`
field in `package.json` changes on `main`, no-ops when that version is already on
the registry, and builds `dist/` first — `dist/` is gitignored, so a publish
without the build ships a package whose every subpath 404s (that shipped once, as
1.4.0). It needs `NPM_TOKEN` as a forge secret.

### The site

`index.html` is the whole site: one self-contained page, inline CSS, no scripts
and no subresources. `Dockerfile` copies it into `ghcr.io/hanzoai/static` — no
build stage, because there is nothing to build. No GitHub Pages and no Cloudflare
Pages: the repo used to push this page to a `gh-pages` branch, Pages never built
it, and `brand.hanzo.ai` has answered 404 from our own ingress ever since.

A build never deploys itself. `deploy.yml` publishes
`ghcr.io/hanzoai/brand:<sha>`; a human then sets `spec.image.tag` in
`hanzoai/universe` `infra/k8s/operator/crs/brand.yaml` and adds `- brand.yaml` to
that directory's `kustomization.yaml`. The CR is inert until both are done, which
is deliberate: an App promoted with an empty tag takes the host down instead of
leaving it alone.

Order: publish an image -> set the tag -> add the line -> confirm the pod is
Running.

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
