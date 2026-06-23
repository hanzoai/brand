/**
 * Hanzo brand logos and logo components.
 *
 * The one true mark is the monochrome "blocky-H" (67x67, 7 paths). Do NOT
 * reintroduce the made-up square-in-square H or any hand-drawn H. The favicon
 * is the blocky-H on a black rounded square.
 */

import React from 'react'

// Real brand assets shipped in this package (assets/logo/*).
export const logos = {
  // The blocky-H mark (transparent background, monochrome).
  mark: {
    svg: '/assets/logo/logo.svg',
  },
  // Mark + "Hanzo" wordmark.
  wordmark: {
    svg: '/assets/logo/wordmark.svg',
  },
  // Favicon: blocky-H on a black rounded square.
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
 * Inline SVG of the real blocky-H mark. `fill="currentColor"` (default) so it
 * adapts to the surrounding theme. The two opacity-0.8 paths are the canonical
 * accents.
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
      viewBox="0 0 67 67"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hanzo"
      role="img"
    >
      <path d="M22.21 67V44.6369H0V67H22.21Z" />
      <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" opacity="0.8" />
      <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
      <path d="M22.21 0H0V22.3184H22.21V0Z" />
      <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
      <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" opacity="0.8" />
      <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
    </svg>
  )
}

/**
 * Favicon component: the real blocky-H on a black rounded square (visible on
 * any browser tab background).
 */
export function HanzoFavicon() {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
      `<rect width='64' height='64' rx='8' fill='#000000'/>` +
      `<g transform='translate(8,8) scale(0.716)' fill='#ffffff'>` +
      `<path d='M22.21 67V44.6369H0V67H22.21Z'/>` +
      `<path d='M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z'/>` +
      `<path d='M22.21 0H0V22.3184H22.21V0Z'/>` +
      `<path d='M66.7198 0H44.5098V22.3184H66.7198V0Z'/>` +
      `<path d='M66.7198 67V44.6369H44.5098V67H66.7198Z'/>` +
      `</g></svg>`,
  )
  return (
    <link rel="icon" type="image/svg+xml" href={`data:image/svg+xml,${svg}`} />
  )
}

export default logos
