/**
 * README hero + social (og:image) generator.
 *
 * One layout, any brand. Monochrome by default (black canvas, white mark + text)
 * — no brand is hardcoded. A brand supplies its accent (or a multi-color accent),
 * and optionally a custom mark, so Hanzo/Lux stay monochrome and Zoo can be
 * colorful. 1200×630 — the universal social size; also a clean GitHub README
 * hero (referenced via `<img>`). Rasterize to PNG for `og:image` with any
 * SVG→PNG renderer (resvg-js, satori, sharp, rsvg-convert).
 */
import { MARK_PATHS, MARK_VIEWBOX } from '@hanzo/logo'

export interface HeroOptions {
  /** Repo / product / package name, e.g. `@hanzo/ai` or `Hanzo Node`. */
  title: string
  /** One-line description shown under the title. */
  tagline?: string
  /** Left footer (defaults to the GitHub org URL). */
  github?: string
  /** Right footer (defaults to the docs domain). */
  docs?: string
  /** Accent for the rule. Default white (monochrome — Hanzo/Lux). */
  accent?: string
  /** If set, the rule renders as a gradient (e.g. Zoo's prism colors). */
  accentColors?: string[]
  /** Foreground (text + default mark) color. Default white. */
  fg?: string
  /** Background color. Default near-black. */
  bg?: string
  /** Mark fill for the default block-H. Default = fg. */
  markFill?: string
  /** Override the block-H with custom inner SVG (e.g. a colored logo). */
  markInner?: string
  /** viewBox for `markInner`. Default = the @hanzo/logo mark viewBox. */
  markViewBox?: string
  /** Legacy alias for the default mark's raw paths. */
  markPaths?: string
  /** Background treatment (hanzo.app aesthetic): a subtle architectural grid,
   *  a soft radial glow, a dot matrix, or plain. Stays monochrome. */
  backdrop?: 'plain' | 'grid' | 'glow' | 'dots'
  width?: number
  height?: number
}

/** A subtle background layer (architectural grid / glow / dots) in `fg` at low
 *  opacity — depth without color, the hanzo.app blueprint look. */
function backdropLayer(kind: string, fg: string, accent: string, w: number, h: number): string {
  if (kind === 'grid') {
    return `<defs><pattern id="bd-grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M50 0H0V50" fill="none" stroke="${fg}" stroke-opacity="0.05" stroke-width="1"/></pattern></defs>
      <rect width="${w}" height="${h}" fill="url(#bd-grid)"/>
      <rect width="${w}" height="${h}" fill="none" stroke="${fg}" stroke-opacity="0.06"/>`
  }
  if (kind === 'glow') {
    return `<defs><radialGradient id="bd-glow" cx="22%" cy="28%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#bd-glow)"/>`
  }
  if (kind === 'dots') {
    return `<defs><pattern id="bd-dots" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${fg}" fill-opacity="0.07"/></pattern></defs>
      <rect width="${w}" height="${h}" fill="url(#bd-dots)"/>`
  }
  return ''
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const MARK_NATIVE = Number(MARK_VIEWBOX.split(' ')[2]) || 67

/** Render a brand hero/og card as a self-contained SVG string. */
export function renderHero(opts: HeroOptions): string {
  const {
    title,
    tagline = '',
    github = 'github.com/hanzoai',
    docs = 'docs.hanzo.ai',
    accent = '#FFFFFF',
    accentColors,
    fg = '#FFFFFF',
    bg = '#0A0A0A',
    markFill,
    markInner,
    markViewBox = MARK_VIEWBOX,
    markPaths = MARK_PATHS,
    backdrop = 'plain',
    width = 1200,
    height = 630,
  } = opts

  const pad = 88
  const markSize = 76
  const font = `'Inter','SF Pro Display','Helvetica Neue',Arial,sans-serif`
  const titleSize = title.length > 26 ? 64 : 80
  void accentColors // accent now reads only via the glow backdrop, not a rule

  // Mark: custom colored inner SVG, or the default block-H filled with markFill/fg.
  const markEl = markInner
    ? `<svg x="${pad}" y="${pad}" width="${markSize}" height="${markSize}" viewBox="${markViewBox}">${markInner}</svg>`
    : `<g transform="translate(${pad},${pad}) scale(${markSize / MARK_NATIVE})" fill="${markFill ?? fg}">${markPaths}</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  ${backdropLayer(backdrop, fg, accent, width, height)}
  ${markEl}
  <text x="${pad}" y="${height / 2 + 34}" font-family="${font}" font-size="${titleSize}" font-weight="800" letter-spacing="-2" fill="${fg}">${esc(title)}</text>
  ${tagline ? `<text x="${pad}" y="${height / 2 + 92}" font-family="${font}" font-size="30" font-weight="400" fill="${fg}" opacity="0.62">${esc(tagline)}</text>` : ''}
  <line x1="${pad}" y1="${height - pad - 40}" x2="${width - pad}" y2="${height - pad - 40}" stroke="${fg}" stroke-opacity="0.12"/>
  <text x="${pad}" y="${height - pad}" font-family="${font}" font-size="24" font-weight="500" fill="${fg}" opacity="0.7">${esc(github)}</text>
  <text x="${width - pad}" y="${height - pad}" font-family="${font}" font-size="24" font-weight="500" fill="${fg}" opacity="0.7" text-anchor="end">${esc(docs)}</text>
</svg>`
}

export default renderHero
