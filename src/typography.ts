/**
 * Hanzo brand typography
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
    display: ['Inter Display', 'Inter', 'system-ui', 'sans-serif'],
  },

  // Font sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
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
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.875em',
      fontWeight: '500',
      backgroundColor: '#F5F5F5',
      padding: '0.125rem 0.25rem',
      borderRadius: '0.25rem',
    },
    block: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      backgroundColor: '#F5F5F5',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  },
} as const

// Font face declarations for custom fonts
export const fontFaces = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
}

@font-face {
  font-family: 'Inter Display';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/inter-display-var.woff2') format('woff2-variations');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 100 800;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-var.woff2') format('woff2-variations');
}
`

export default typography