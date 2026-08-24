# DESIGN.md — Hanzo brand

> Enterprise AI infrastructure and frontier models

A short, opinionated design spec. Mirrors the spirit of Material 3 / Google
Web Design Spec, sized to the Hanzo brand. Lives next to `LLM.md` —
`LLM.md` describes what's built, this file describes how it should look.

The canonical brand JSON for Hanzo is `brand.json` in this repo. That
file is the source of truth for tokens; this file is the source of truth
for **how to use them**.

---

## 1. Foundation

### 1.1 Voice
Direct, technical, understated. Numbers over adjectives. No exclamations, no emoji.

### 1.2 Brand atom
Strict monochrome — black surface, white type. Color is reserved for state, not decoration.

### 1.3 Layout grid
- Max content width: `max-w-7xl` (1280px) for grids, `max-w-3xl` (768px) for centered text blocks
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Vertical rhythm: `py-20 lg:py-32` for hero sections, `py-16` to `py-20` for content sections, `py-16` for the final CTA

### 1.4 Density
Generous. If a section feels crowded, remove a component before reducing spacing.

---

## 2. Color tokens

### 2.1 Source of truth
All color tokens live in `brand.json` (this repo). CSS variables are derived
at runtime from those tokens. Never hardcode hex literals in component files
unless the file IS the brand reference (color swatches, logo SVG).

### 2.2 Palette

| Token | Value | Use |
|---|---|---|
| `--background` | `#000000` | Page surface |
| `--foreground` | `#ffffff` | Primary type |
| `--brand` | `#e4e4e7` | Active accent (rare) |
| `--brand-muted` | `#a3a3a3` | Hover / muted accent |


### 2.3 Opacity ladder
Use opacity steps in 5-point increments (`/5`, `/10`, `/15`, `/20`, `/30`,
`/40`, `/60`, `/80`, full). Higher opacity = higher rank. Avoid arbitrary
values like `/12` or `/37`.

### 2.4 Semantic colors (the *only* reserved hued exceptions for brands without a saturated primary)

| Where | Color | Reason |
|---|---|---|
| Error / destructive | `red-500` family | User-blocking error or destructive confirmation |
| Success / online | `green-400/500` | Live-status, "online" affordance |
| Pricing — "Free" / "Save N%" callouts | `green-400` text | Positive financial callout |
| macOS window-chrome dot trio | red/yellow/green @ 60% | OS affordance reproduction |
| External brand logos | brand's official hex | Recognizing third-party identity |

For brands with a saturated primary (Zoo, Pars, Osage, Zen, MIGA, Cyrus),
prefer the brand's own palette over the generic Tailwind red/green above
where the brand maps cleanly (e.g. Osage red `#b8312f` for errors, Zoo
green `#00A652` for success).

---

## 3. Typography

### 3.1 Family
Zen + Zen Mono, self-hosted by `@hanzo/font` (no third-party font host)

### 3.2 Type scale (Tailwind classes)

| Class | Use |
|---|---|
| `text-5xl lg:text-7xl font-bold` | Hero `<h1>` |
| `text-4xl font-bold` | Section `<h2>` |
| `text-2xl font-bold` | Subsection `<h3>` |
| `text-xl text-muted-foreground` | Hero tagline, lead paragraph |
| `text-sm text-muted-foreground` | Body |
| `text-xs text-muted-foreground` | Helper, footnote, badge label |
| `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground` | Category eyebrow |

---

## 4. Components

### 4.1 Card

```tsx
<div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
  <Icon className="h-6 w-6 mb-3 text-foreground/80" />
  <h3 className="font-semibold mb-2">Title</h3>
  <p className="text-sm text-muted-foreground">Body…</p>
</div>
```

### 4.2 Button (primary / secondary)

NEVER use `<Button asChild>` — it expects exactly one child element and
breaks the build under React 18 strict children. Use plain `<a>` or
`<Link>` with className strings.

```tsx
<Link href="/x" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-sm font-medium">
  Get started
</Link>
```

### 4.3 Hero pattern (every product page starts with this)

```tsx
<section className="py-20 lg:py-32 relative">
  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-5xl lg:text-7xl font-bold mb-6">Product Title</h1>
      <p className="text-xl text-muted-foreground mb-8">Tagline ≤140 chars.</p>
    </div>
  </div>
</section>
```

### 4.4 Final resources block (every product page ends with this)

```tsx
<section className="py-16 border-t border-neutral-800">
  <div className="max-w-3xl mx-auto px-4 text-center">
    <h2 className="text-2xl font-bold mb-4">Get started</h2>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="<docs URL>" target="_blank" rel="noopener noreferrer">Read the docs</a>
      <a href="<github URL>" target="_blank" rel="noopener noreferrer">View on GitHub</a>
    </div>
  </div>
</section>
```

---

## 5. Motion

- Library: `framer-motion`
- Hero entry: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with `duration: 0.5` and `delay: 0.05 * index` stagger
- Hover: pure CSS via `transition-colors` (no JS)
- Background: a single radial gradient pulse, 8s ease-in-out infinite
- No bouncy springs, no carousel auto-play, no parallax

---

## 6. Iconography

- Library: `lucide-react`. No other icon set.
- Sizing: `h-3 w-3` (inline body), `h-4 w-4` (CTA), `h-6 w-6` (card eyebrow), `h-10 w-10` (section accent)

---

## 7. Page rules

### 7.1 Every product page MUST
1. Live at a flat `/<slug>` URL
2. Have a unique `<h1>` — no two product pages share a title
3. Have a unique first-600-char body signature
4. End with the resources block (§ 4.4)
5. Carry only the colors permitted by § 2.2 / § 2.4

### 7.2 Forbidden
- `<Button asChild>` — breaks build
- Hardcoded hex literals (use brand.json tokens)
- Decorative hue outside the brand palette
- Multiple typefaces
- Multiple URL schemes for the same product

---

## 8. Accessibility (non-negotiable)

- Contrast: every body-text on background combination clears WCAG AA at 16px
- Focus rings: visible — never `outline-none` without a custom ring
- Keyboard: every dropdown / dialog / mobile menu reachable via Tab; closeable via Escape
- Reduced motion: honor `prefers-reduced-motion`
- Alt text: every `<img>` and decorative SVG either has alt or `aria-hidden="true"`

---

## 9. Verification

Build clean, run e2e, visual-diff against the canonical pages of the
primary app (hanzo.ai). If a page reads visibly different from the
canonical reference, something is wrong.

---

## 10. When in doubt

The brand atom (§ 1.2) is the test. Every component, every page, every
copy decision should reinforce that atom. If your work doesn't, change
your work — not the atom.
