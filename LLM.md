# @hanzo/brand

Official brand assets and design system for Hanzo AI. Published as `@hanzo/brand` on npm. Exports colors, typography, themes, design tokens, logo references, and CSS variables.

## Stack
- TypeScript 5, tsup (CJS + ESM + DTS output)
- No runtime dependencies
- Outputs: `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`

## Structure
```
src/
  index.ts       # Main entry - re-exports all modules, auto-applies theme in browser
  colors.ts      # Color palette: Hanzo Red (#d81c33), primary, semantic, neutral, gradients
  typography.ts  # Font families (Inter, JetBrains Mono), sizes, weights, line heights
  themes.ts      # Light/dark theme definitions, applyTheme() helper
  tokens.ts      # Design tokens (spacing, radius, shadows, transitions)
  logos.tsx       # Logo component references
  config.ts      # Company info, social links, domains, SEO defaults
  utils.ts       # Brand utility functions
  docs.ts        # Documentation helpers
styles/
  variables.css  # CSS custom properties (importable or linkable via unpkg)
```

## Commands
```bash
npm install                  # Install dev deps
npm run build                # Build with tsup (CJS + ESM + DTS)
npm run dev                  # Watch mode
npm run lint                 # ESLint
npm run type-check           # tsc --noEmit
```

## Key Values
- Hanzo Red: `#d81c33` / `rgb(216, 28, 54)` -- the primary brand color
- Accent hover: `#c01830`
- Dark background: `#0A0A0B`
- Sans font: Inter
- Mono font: JetBrains Mono
- CSS variables are prefixed with `--hanzo-`

## Notes
- Auto-applies dark/light theme on import in browser environments
- CSS variables file at `styles/variables.css` can be used standalone without JS
- Published with public access to npm registry
- `CLAUDE.md`, `AGENTS.md`, `QWEN.md`, `GEMINI.md` are all symlinks to this file
