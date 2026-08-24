/**
 * Hanzo brand typography
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Zen', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['Zen Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
    display: ['Zen', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },

  // Font sizes
  // TIGHT app-first scale (mirrors styles/variables.css --font-size-*): the compact
  // developer-app register (linear.app / vercel.com). Base 14px, nav 13px, labels
  // 11px. Line-heights kept snug for density. This is the Hanzo default everywhere.
  fontSize: {
    xs: ['0.6875rem', { lineHeight: '1rem' }], // 11px
    sm: ['0.8125rem', { lineHeight: '1.15rem' }], // 13px
    base: ['0.875rem', { lineHeight: '1.35rem' }], // 14px
    lg: ['0.9375rem', { lineHeight: '1.4rem' }], // 15px
    xl: ['1.0625rem', { lineHeight: '1.55rem' }], // 17px
    '2xl': ['1.3125rem', { lineHeight: '1.7rem' }], // 21px
    '3xl': ['1.625rem', { lineHeight: '1.95rem' }], // 26px
    '4xl': ['2rem', { lineHeight: '2.25rem' }], // 32px
    '5xl': ['2.5rem', { lineHeight: '1.05' }], // 40px
    '6xl': ['3.25rem', { lineHeight: '1.03' }], // 52px
    '7xl': ['4rem', { lineHeight: '1' }], // 64px
    '8xl': ['5.25rem', { lineHeight: '1' }], // 84px
    '9xl': ['7rem', { lineHeight: '1' }], // 112px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text styles
  heading: {
    h1: {
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },

  body: {
    large: {
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.75',
    },
    base: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    tiny: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
  },

  // Code styles
  code: {
    inline: {
      fontFamily: 'Zen Mono, ui-monospace, monospace',
      fontSize: '0.875em',
      fontWeight: '500',
      backgroundColor: '#F5F5F5',
      padding: '0.125rem 0.25rem',
      borderRadius: '0.25rem',
    },
    block: {
      fontFamily: 'Zen Mono, ui-monospace, monospace',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      backgroundColor: '#F5F5F5',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  },
} as const

/**
 * The stack the SVG card renderers ask for, as a CSS value rather than an array.
 * It lived twice — `cards.ts` and `hero.ts` each declared the same string, both
 * leading with Inter, which is not a face this brand has ever owned.
 *
 * Zen leads. @hanzo/font ships the woff2, so a rasterizer resolves it by being
 * pointed at that package (resvg-js takes `fontFiles`/`fontDirs`); a host that
 * cannot falls through the tail exactly as it did before, so naming Zen here
 * cannot render worse than the string it replaced.
 */
export const svgFontStack = `Zen,'SF Pro Display','Helvetica Neue',Arial,sans-serif`

// The FACES are @hanzo/font's — it ships Zen, Zen Mono and the five Zen Pixel
// variants as woff2 with the @font-face rules to match. This package names the
// family a surface should ask for; it does not declare one, and it used to:
// `fontFaces` pointed two @font-face rules at /fonts/geist-*-var.woff2, files
// this package has never shipped, so it could only ever paint the fallback.

export default typography