/**
 * Social-card toolkit — one layout system, any brand. Each function renders a
 * self-contained 1200×630 SVG. The look is monochrome by default (black canvas,
 * white mark + text); a brand supplies its own `Palette` (accent, optional
 * multi-color accent, custom mark) so Hanzo/Lux stay monochrome and Zoo (etc.)
 * can be colorful — the geometry never changes.
 *
 * Card types: hero (see ./hero) · post · announcement · quote.
 * Rasterize to PNG for og:image with any SVG→PNG renderer (resvg-js, sharp,
 * rsvg-convert). Add new card types here, not per-repo.
 */
import { MARK_PATHS, MARK_VIEWBOX } from '@hanzo/logo'
import { svgFontStack } from './typography'

const W = 1200
const H = 630
const PAD = 88
const FONT = svgFontStack
const MARK_SIZE = Number(MARK_VIEWBOX.split(' ')[2]) || 67

/** Per-brand palette. Defaults are pure monochrome — no brand is hardcoded. */
export interface Palette {
  /** Highlight color for the rule + kicker. Default white (monochrome). */
  accent?: string
  /** If set, the accent rule renders as a left-to-right gradient (e.g. Zoo's
   *  prism). The kicker uses the first color. */
  accentColors?: string[]
  /** Canvas background. Default near-black. */
  bg?: string
  /** Text color. Default white. */
  fg?: string
  /** Mark fill for the default block-H. Default = fg. */
  markFill?: string
  /** Override the mark with custom inner SVG (e.g. a colored logo). */
  markInner?: string
  /** viewBox for `markInner`. Default = the @hanzo/logo mark viewBox. */
  markViewBox?: string
}

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const accentOf = (p: Palette) => p.accent ?? (p.accentColors && p.accentColors[0]) ?? '#FFFFFF'
const fgOf = (p: Palette) => p.fg ?? '#FFFFFF'
const bgOf = (p: Palette) => p.bg ?? '#0A0A0A'

/** Mark at (x,y), scaled to `size`. Block-H from @hanzo/logo, or a custom mark. */
export function mark(
  x: number,
  y: number,
  size: number,
  fillOrPalette: string | Palette = '#FFFFFF',
  opacity = 1,
): string {
  const p: Palette = typeof fillOrPalette === 'string' ? { markFill: fillOrPalette } : fillOrPalette
  if (p.markInner) {
    const vb = p.markViewBox ?? MARK_VIEWBOX
    return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${vb}" opacity="${opacity}">${p.markInner}</svg>`
  }
  const s = size / MARK_SIZE
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${p.markFill ?? '#FFFFFF'}" opacity="${opacity}">${MARK_PATHS}</g>`
}

const frame = (inner: string, bg: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>${inner}</svg>`

const text = (
  x: number,
  y: number,
  s: string,
  { size = 30, weight = 400, fill = '#FFFFFF', opacity = 1, anchor = 'start', spacing = 0 } = {},
) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}>${esc(s)}</text>`

// Wrap a title to ~N chars/line, max `lines`, returning rows.
function wrapTitle(title: string, max = 26, lines = 3): string[] {
  const words = title.split(/\s+/)
  const out: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      out.push(cur)
      cur = w
    } else cur = (cur + ' ' + w).trim()
    if (out.length === lines - 1 && cur.length > max) break
  }
  if (cur) out.push(cur)
  if (out.length > lines) {
    out.length = lines
    out[lines - 1] = out[lines - 1].replace(/\s+\S*$/, '') + '…'
  }
  return out
}

export interface PostCard extends Palette {
  title: string
  author?: string
  date?: string
  tag?: string
  site?: string
}

/** Blog-post card: kicker (tag), wrapped headline, author · date footer. */
export function renderPost(o: PostCard): string {
  const fg = fgOf(o)
  const rows = wrapTitle(o.title, 24, 3)
  const titleSize = rows.length >= 3 ? 62 : 76
  const top = 296
  const tspans = rows
    .map((r, i) => `<tspan x="${PAD}" dy="${i === 0 ? 0 : titleSize * 1.12}">${esc(r)}</tspan>`)
    .join('')
  const meta = [o.author, o.date].filter(Boolean).join('  ·  ')
  return frame(`
    ${mark(PAD, PAD, 64, o)}
    ${o.tag ? text(PAD, 212, o.tag.toUpperCase(), { size: 22, weight: 700, fill: accentOf(o), spacing: 2 }) : ''}
    <text x="${PAD}" y="${top}" font-family="${FONT}" font-size="${titleSize}" font-weight="800" letter-spacing="-1.5" fill="${fg}">${tspans}</text>
    <line x1="${PAD}" y1="${H - PAD - 40}" x2="${W - PAD}" y2="${H - PAD - 40}" stroke="${fg}" stroke-opacity="0.12"/>
    ${meta ? text(PAD, H - PAD, meta, { size: 24, weight: 500, fill: fg, opacity: 0.7 }) : ''}
    ${o.site ? text(W - PAD, H - PAD, o.site, { size: 24, weight: 500, fill: fg, opacity: 0.7, anchor: 'end' }) : ''}`,
    bgOf(o))
}

export interface AnnouncementCard extends Palette {
  kicker?: string
  headline: string
  site?: string
}

/** Announcement / launch card: big centered statement with kicker. */
export function renderAnnouncement(o: AnnouncementCard): string {
  const fg = fgOf(o)
  const rows = wrapTitle(o.headline, 18, 3)
  const size = rows.length >= 3 ? 88 : 104
  const top = rows.length >= 3 ? 300 : 348
  const tspans = rows
    .map((r, i) => `<tspan x="${W / 2}" dy="${i === 0 ? 0 : size * 1.05}">${esc(r)}</tspan>`)
    .join('')
  return frame(`
    ${mark(W / 2 - 30, 100, 60, o)}
    ${o.kicker ? text(W / 2, 218, o.kicker.toUpperCase(), { size: 24, weight: 700, fill: accentOf(o), anchor: 'middle', spacing: 3 }) : ''}
    <text x="${W / 2}" y="${top}" font-family="${FONT}" font-size="${size}" font-weight="800" letter-spacing="-3" fill="${fg}" text-anchor="middle">${tspans}</text>
    ${o.site ? text(W / 2, H - PAD, o.site, { size: 24, weight: 500, fill: fg, opacity: 0.6, anchor: 'middle' }) : ''}`,
    bgOf(o))
}

export interface ShowcaseCard extends Palette {
  /** Product / repo name. */
  title: string
  tagline?: string
  /** Screenshot as a data URI (data:image/png;base64,…) — embedded inline. */
  image: string
  site?: string
  /** Native aspect of the screenshot (default 16:10) — keeps it undistorted. */
  imageAspect?: number
}

/** Showcase card: brand text on the left, a framed product screenshot on the
 *  right bleeding off the edge. Great for launch posts / "see it" og images. */
export function renderShowcase(o: ShowcaseCard): string {
  const fg = fgOf(o)
  const aspect = o.imageAspect ?? 16 / 10
  // Window frame, right side, bleeding off the right edge for momentum.
  const fx = 560, fy = 96, fw = 720, fh = Math.round(fw / aspect) + 34
  const bar = 34
  const rows = wrapTitle(o.title, 16, 2)
  const tspans = rows
    .map((r, i) => `<tspan x="${PAD}" dy="${i === 0 ? 0 : 70}">${esc(r)}</tspan>`)
    .join('')
  return frame(`
    <defs>
      <clipPath id="winclip"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="16"/></clipPath>
      <clipPath id="shotclip"><rect x="${fx}" y="${fy + bar}" width="${fw}" height="${fh - bar}" rx="2"/></clipPath>
    </defs>
    <g clip-path="url(#winclip)">
      <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="#161616"/>
      <circle cx="${fx + 24}" cy="${fy + 17}" r="6" fill="#ff5f57"/>
      <circle cx="${fx + 44}" cy="${fy + 17}" r="6" fill="#febc2e"/>
      <circle cx="${fx + 64}" cy="${fy + 17}" r="6" fill="#28c840"/>
      <image href="${o.image}" x="${fx}" y="${fy + bar}" width="${fw}" height="${fh - bar}" preserveAspectRatio="xMidYMid slice" clip-path="url(#shotclip)"/>
    </g>
    <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="16" fill="none" stroke="${fg}" stroke-opacity="0.14"/>
    ${mark(PAD, PAD, 60, o)}
    <text x="${PAD}" y="312" font-family="${FONT}" font-size="64" font-weight="800" letter-spacing="-2" fill="${fg}">${tspans}</text>
    ${o.tagline ? text(PAD, 312 + rows.length * 70 - 8, o.tagline, { size: 28, weight: 400, fill: fg, opacity: 0.62 }) : ''}
    ${o.site ? text(PAD, H - PAD, o.site, { size: 24, weight: 500, fill: fg, opacity: 0.7 }) : ''}`,
    bgOf(o))
}

export interface QuoteCard extends Palette {
  quote: string
  attribution?: string
  site?: string
}

/** Pull-quote card: oversized accent quote mark, statement, attribution. */
export function renderQuote(o: QuoteCard): string {
  const fg = fgOf(o)
  const rows = wrapTitle(o.quote, 30, 4)
  const size = 52
  const tspans = rows
    .map((r, i) => `<tspan x="${PAD}" dy="${i === 0 ? 0 : size * 1.2}">${esc(r)}</tspan>`)
    .join('')
  return frame(`
    <text x="${PAD - 6}" y="210" font-family="${FONT}" font-size="160" font-weight="800" fill="${accentOf(o)}">“</text>
    <text x="${PAD}" y="300" font-family="${FONT}" font-size="${size}" font-weight="600" letter-spacing="-1" fill="${fg}">${tspans}</text>
    ${o.attribution ? text(PAD, H - PAD, `— ${o.attribution}`, { size: 26, weight: 500, fill: fg, opacity: 0.7 }) : ''}
    ${mark(W - PAD - 48, H - PAD - 48, 48, { ...o, markFill: fg }, 0.5)}`,
    bgOf(o))
}
