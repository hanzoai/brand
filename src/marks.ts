/**
 * Per-brand mark geometry — the white-label logo layer.
 *
 * ONE source per mark. The Hanzo mark is NEVER re-typed here: it is imported
 * from `@hanzo/logo` (`MARK_PATHS` / `MARK_VIEWBOX`, the canonical home of the
 * block-H geometry). The Lux / Zoo / Pars marks are inline, build-time-trusted
 * constants (the console v1 registry marks, tuned for `currentColor` + small
 * nav sizes). A `lux.network` / `zoo.ngo` / `pars.network` surface renders ITS
 * mark — never the Hanzo H. That non-cross-contamination is the white-label
 * invariant (see registry.ts + registry.test).
 *
 * Marks are pure SVG-inner markup (paths/defs) + a viewBox — no framework. The
 * React `<BrandMark>` (logos.tsx) and the string `renderMarkSVG` (below) both
 * consume this one table, so the geometry lives in exactly one place.
 */
// Main entry re-exports the logos module (`export * from './logos.js'`), so the
// mark geometry resolves under classic `node` moduleResolution (no subpath map).
import { MARK_PATHS, MARK_VIEWBOX } from '@hanzo/logo'

import type { BrandId } from './brand-id'

export interface BrandMark {
  /** viewBox for the inline logo SVG. */
  readonly viewBox: string
  /**
   * Inner SVG markup for the mark (multi-path; a build-time-trusted package
   * constant, NEVER user input — safe to inline as raw SVG).
   */
  readonly content: string
  /**
   * When true the mark carries its own intrinsic fills (e.g. the Zoo CMYK
   * circles) and MUST NOT be recolored by `currentColor`. When false/undefined
   * the mark inherits `currentColor` so it adapts to light/dark chrome.
   */
  readonly colored?: boolean
}

// Hanzo — the canonical block-H from @hanzo/logo (`MARK_PATHS`: five currentColor
// body blocks + two shade slivers). The ONE home of the geometry; never re-type it.
const HANZO_MARK: BrandMark = {
  viewBox: MARK_VIEWBOX,
  content: MARK_PATHS,
}

// Lux — downward triangle (console v1 registry mark, currentColor).
const LUX_MARK: BrandMark = {
  viewBox: '0 0 100 100',
  content: '<path d="M50 85 L15 25 L85 25 Z"/>',
}

// Zoo — interlocking CMYK circles (console v1 registry mark; intentional
// full-color fills, NOT currentColor).
const ZOO_MARK: BrandMark = {
  viewBox: '0 0 1024 1024',
  colored: true,
  content:
    '<defs>' +
    '<clipPath id="zooClip"><circle cx="512" cy="511" r="270"/></clipPath>' +
    '<clipPath id="zooGClip"><circle cx="513" cy="369" r="234"/></clipPath>' +
    '<clipPath id="zooRClip"><circle cx="365" cy="595" r="234"/></clipPath>' +
    '</defs>' +
    '<g clip-path="url(#zooClip)">' +
    '<circle cx="513" cy="369" r="234" fill="#00A652"/>' +
    '<circle cx="365" cy="595" r="234" fill="#ED1C24"/>' +
    '<circle cx="643" cy="595" r="234" fill="#2E3192"/>' +
    '<g clip-path="url(#zooGClip)">' +
    '<circle cx="365" cy="595" r="234" fill="#FCF006"/>' +
    '<circle cx="643" cy="595" r="234" fill="#01ACF1"/>' +
    '</g>' +
    '<g clip-path="url(#zooRClip)">' +
    '<circle cx="643" cy="595" r="234" fill="#EA018E"/>' +
    '</g>' +
    '<g clip-path="url(#zooGClip)">' +
    '<g clip-path="url(#zooRClip)">' +
    '<circle cx="643" cy="595" r="234" fill="#FFFFFF"/>' +
    '</g></g></g>',
}

// Pars — Persian 8-pointed star (console v1 registry mark, currentColor).
const PARS_MARK: BrandMark = {
  viewBox: '-120 -120 240 240',
  content:
    '<path d="M0,-100 L30,-60 L100,-40 L60,0 L100,40 L30,60 L0,100 L-30,60 L-100,40 L-60,0 L-100,-40 L-30,-60 Z"' +
    ' fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M0,-70 L22,-42 L70,-28 L42,0 L70,28 L22,42 L0,70 L-22,42 L-70,28 L-42,0 L-70,-28 L-22,-42 Z"' +
    ' fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle r="55" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>' +
    '<circle r="35" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>' +
    '<circle r="8" fill="currentColor"/>',
}

/**
 * The brand marks, keyed by id. White-label tenants without a bespoke mark
 * (7stars, yotoda) fall back to the Hanzo geometry — their name/domain still
 * apply; only the mark is shared until a real one ships.
 */
export const BRAND_MARKS: Record<BrandId, BrandMark> = {
  hanzo: HANZO_MARK,
  lux: LUX_MARK,
  zoo: ZOO_MARK,
  pars: PARS_MARK,
  '7stars': HANZO_MARK,
  yotoda: HANZO_MARK,
}

/**
 * Render a brand mark as a standalone inline SVG string (framework-agnostic).
 * A colored mark (Zoo) keeps its intrinsic fills; every other mark inherits the
 * requested `color` (default `currentColor`) so it adapts to the theme.
 */
export function renderMarkSVG(
  id: BrandId,
  opts: { size?: number | string; color?: string; title?: string } = {},
): string {
  const mark = BRAND_MARKS[id]
  const { size = 32, color = 'currentColor', title } = opts
  const fill = mark.colored ? '' : ` fill="${color}"`
  const label = title ?? id
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}"` +
    ` width="${size}" height="${size}"${fill} role="img" aria-label="${label}">` +
    mark.content +
    `</svg>`
  )
}
