/**
 * Hanzo brand logos + the white-label brand mark.
 *
 * The one true Hanzo mark is the block-H — and its geometry lives in exactly
 * ONE place, `@hanzo/logo` (`MARK_PATHS` / `MARK_VIEWBOX`). This module NO
 * LONGER re-types those paths; it consumes them. The white-label `<BrandLogo>`
 * renders the resolved brand's mark (Hanzo H, Lux triangle, Zoo circles, Pars
 * star) so a lux/zoo/pars surface never shows the Hanzo H.
 */

import React from 'react'
import { MARK_PATHS, MARK_VIEWBOX, getFaviconSVG } from '@hanzo/logo'

import type { BrandId } from './brand-id'
import { BRAND_MARKS } from './marks'
import { getBrand } from './registry'

// Real brand assets shipped in this package (assets/logo/*).
export const logos = {
  // The block-H mark (transparent background, monochrome).
  mark: {
    svg: '/assets/logo/logo.svg',
  },
  // Mark + "Hanzo" wordmark.
  wordmark: {
    svg: '/assets/logo/wordmark.svg',
  },
  // Favicon: block-H on a black rounded square.
  favicon: {
    svg: '/assets/logo/favicon.svg',
    png: '/assets/logo/favicon.png',
  },
} as const

// Logo component props
export interface HanzoLogoProps {
  variant?: 'mark' | 'wordmark'
  size?: 'small' | 'medium' | 'large' | 'xl' | number
  className?: string
  style?: React.CSSProperties
}

// Size mappings
const sizeMap = {
  small: 24,
  medium: 32,
  large: 48,
  xl: 64,
}

// Logo React component (renders a shipped asset by <img>).
export function HanzoLogo({
  variant = 'mark',
  size = 'medium',
  className = '',
  style = {},
}: HanzoLogoProps) {
  const height = typeof size === 'number' ? size : sizeMap[size]
  const logoSrc = logos[variant].svg

  return (
    <img
      src={logoSrc}
      alt="Hanzo Logo"
      height={height}
      className={`hanzo-logo hanzo-logo--${variant} ${className}`}
      style={{
        height: `${height}px`,
        width: 'auto',
        ...style,
      }}
    />
  )
}

/**
 * Inline SVG of the Hanzo block-H mark. Geometry comes from `@hanzo/logo`
 * (`MARK_PATHS`), so there is one source. `fill="currentColor"` (default) so it
 * adapts to the surrounding theme.
 */
export function HanzoLogoSVG({
  size = 32,
  color = 'currentColor',
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hanzo"
      role="img"
      // MARK_PATHS is a build-time-trusted `@hanzo/logo` constant — never user input.
      dangerouslySetInnerHTML={{ __html: MARK_PATHS }}
    />
  )
}

/**
 * Favicon component: the block-H favicon SVG from `@hanzo/logo` (block-H on a
 * black rounded square), inlined as a data URI.
 */
export function HanzoFavicon() {
  const svg = encodeURIComponent(getFaviconSVG())
  return <link rel="icon" type="image/svg+xml" href={`data:image/svg+xml,${svg}`} />
}

export interface BrandLogoProps {
  /**
   * Which brand's mark to render. Omit to auto-resolve by hostname
   * (white-label): the browser resolves `window.location.hostname`, so a
   * lux/zoo/pars host renders ITS mark, a Hanzo host the Hanzo H.
   */
  brand?: BrandId
  size?: number | string
  /** Fill for currentColor marks; ignored by the intrinsically-colored Zoo mark. */
  color?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * The white-label brand mark. Renders the resolved brand's inline SVG mark. The
 * Hanzo geometry is `@hanzo/logo`; Lux/Zoo/Pars are the registry marks. This is
 * the ONE component surfaces use for "the current brand's logo" — it never
 * cross-contaminates (a Lux host never shows the Hanzo H).
 */
export function BrandLogo({ brand, size = 32, color = 'currentColor', className, style }: BrandLogoProps) {
  const mark = brand ? BRAND_MARKS[brand] : getBrand().mark
  return (
    <svg
      width={size}
      height={size}
      viewBox={mark.viewBox}
      // Colored marks (Zoo) carry their own fills; monochrome marks inherit `color`.
      fill={mark.colored ? undefined : color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      role="img"
      aria-label={brand ?? getBrand().name}
      // Mark content is a build-time-trusted package constant — never user input.
      dangerouslySetInnerHTML={{ __html: mark.content }}
    />
  )
}

export default logos
