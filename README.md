<p align="center">
  <img src=".github/hero.svg" alt="@hanzo/brand" width="100%" />
</p>

# @hanzo/brand

The single source of truth for Hanzo brand identity — design tokens, logos,
themes, docs theming, and a README/og:image **hero generator** — shared across
every Hanzo, Lux, and Zoo repo so they all look and feel the same.

```bash
npm install @hanzo/brand
```

## Tokens

```ts
import { colors, typography, brand } from '@hanzo/brand';

brand.name;           // from brand.json — the single source of truth
brand.docsDomain;     // 'docs.hanzo.ai'
```

The Hanzo palette is **pure monochrome** (black + white, Vercel/Linear style) —
no color accent. `brand.json` is canonical: names, domains, socials, theme.

## Social-card toolkit

One layout engine, **any brand**. Zero-dependency SVG — no browser/canvas. Same
code generates a repo README hero, an og:image, and blog/announcement/quote
cards. The mark is sourced from [`@hanzo/logo`](../logo) (single source).

| Function | Card |
|---|---|
| `renderHero` | README hero / og banner |
| `renderPost` | blog post (tag, title, author · date) |
| `renderAnnouncement` | launch / big statement |
| `renderQuote` | pull-quote |

### Monochrome by default; colorful per brand

Every function defaults to **monochrome** — white mark + text, white accent
(Hanzo and Lux). A brand goes colorful by passing its own `Palette`:

| Brand | Palette |
|---|---|
| **Hanzo** | monochrome — white block-H, white accent |
| **Lux** | monochrome — white triangle, white accent |
| **Zoo** | colorful — prism mark + `accentColors` prism gradient |

```ts
interface Palette {
  accent?: string          // highlight; default WHITE (monochrome)
  accentColors?: string[]  // multi-color accent → gradient rule (Zoo prism)
  fg?: string; bg?: string // text / canvas (default white / near-black)
  markInner?: string       // a brand's own mark SVG (from @<org>/logo)
  markViewBox?: string
}
```

### Rip it into a README (per repo)

```bash
npx @hanzo/brand hero \
  --title "@hanzo/ai" \
  --tagline "The AI app as one declarative component" \
  --out .github/hero.svg
```

```md
<p align="center"><img src=".github/hero.svg" alt="@hanzo/ai" width="100%" /></p>
```

The CLI fills defaults from the nearest `brand.json`, so each repo gets a unique,
on-brand hero with one command.

### Programmatic (og:image route, any brand)

```ts
import { renderHero, renderPost } from '@hanzo/brand';

// Hanzo / Lux — monochrome (no palette needed):
renderHero({ title: 'Lux Node', tagline: 'GPU-native multichain consensus',
             github: 'github.com/luxfi', docs: 'docs.lux.network' });

// Zoo — colorful: pass the prism mark (from @zooai/logo) + accent colors:
renderPost({ title: 'Proof-of-AI', tag: 'DeSci', author: 'Zoo Labs',
             accent: '#00A652',
             accentColors: ['#ED1C24','#FCF006','#00A652','#01ACF1','#2E3192'],
             markInner: zooPrismSvg, markViewBox: '222 221 580 580' });
// Rasterize to PNG for og:image with resvg-js / satori / sharp / rsvg-convert.
```

## Docs theming

`@hanzo/brand` ships a Fumadocs-compatible theme so every product's docs site
inherits the brand automatically:

```ts
import { docsTheme } from '@hanzo/brand';   // CSS variables for fumadocs
```

## Exports

`.` (tokens, themes, `brand`, `renderHero`, `renderPost`, `renderAnnouncement`,
`renderQuote`) · `./hero` · `./loader` (`loadBrand`, `getDocsUrl`, …) ·
`./brand.json` · `./assets/*` · `./styles/*`. Mark geometry comes from
[`@hanzo/logo`](../logo) (`MARK_PATHS`).

## License

MIT © Hanzo AI Inc.
