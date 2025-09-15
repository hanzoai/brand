# Hanzo Brand

Official brand assets, design system, and guidelines for Hanzo AI.

<div align="center">
  <img src="assets/logo/hanzo-logo.svg" alt="Hanzo Logo" width="120" />
  
  **Building the future of AI infrastructure**
  
  [![npm version](https://img.shields.io/npm/v/@hanzo/brand)](https://www.npmjs.com/package/@hanzo/brand)
  [![License](https://img.shields.io/github/license/hanzoai/brand)](LICENSE)
  [![Downloads](https://img.shields.io/npm/dm/@hanzo/brand)](https://www.npmjs.com/package/@hanzo/brand)
</div>

## 🎨 Quick Start

### Installation

```bash
# npm
npm install @hanzo/brand

# pnpm
pnpm add @hanzo/brand

# yarn
yarn add @hanzo/brand
```

### Usage

```typescript
import { 
  colors, 
  logos, 
  typography, 
  HanzoLogo,
  applyTheme 
} from '@hanzo/brand'

// Use the logo component
<HanzoLogo size="medium" variant="dark" />

// Apply brand colors
const primaryColor = colors.primary.DEFAULT
const backgroundColor = colors.background.DEFAULT

// Apply complete theme
applyTheme('dark')
```

## 📁 Repository Structure

```
@hanzo/brand/
├── assets/              # Raw brand assets
│   ├── logo/           # Logo variations (SVG, PNG)
│   ├── icons/          # Brand icons
│   ├── images/         # Brand images and illustrations
│   └── graphics/       # Other graphics
├── fonts/              # Brand typography
│   ├── inter/          # Primary font
│   └── mono/           # Monospace font
├── styles/             # CSS and design tokens
│   ├── colors.css      # Color variables
│   ├── typography.css  # Typography styles
│   └── themes/         # Theme variations
├── src/                # Source code
│   ├── index.ts        # Main export
│   ├── colors.ts       # Color definitions
│   ├── typography.ts   # Typography config
│   ├── logos.tsx       # Logo components
│   └── utils.ts        # Helper functions
└── guidelines/         # Brand guidelines
    ├── visual.md       # Visual guidelines
    ├── voice.md        # Voice and tone
    └── usage.md        # Usage examples
```

## 🎨 Brand Colors

### Primary Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#0A0A0B` | Main brand color, CTAs |
| **Secondary** | `#F5F5F5` | Supporting elements |
| **Accent** | `#3B82F6` | Interactive elements |
| **Success** | `#10B981` | Success states |
| **Warning** | `#F59E0B` | Warning states |
| **Error** | `#EF4444` | Error states |

### Using Colors

```javascript
import { colors } from '@hanzo/brand'

// In CSS-in-JS
const styles = {
  color: colors.primary.DEFAULT,
  backgroundColor: colors.background.light
}

// CSS Variables
// Automatically injected when using applyTheme()
// var(--hanzo-primary)
// var(--hanzo-secondary)
// var(--hanzo-background)
```

## 🔤 Typography

### Font Stack

- **Primary**: Inter, system-ui, sans-serif
- **Monospace**: 'JetBrains Mono', 'Fira Code', monospace
- **Display**: Inter Display, Inter, sans-serif

### Usage

```javascript
import { typography } from '@hanzo/brand'

// Get font family
const { fontFamily, fontSize, fontWeight } = typography

// Apply typography styles
const headingStyle = typography.heading.h1
const bodyStyle = typography.body.large
```

## 🖼️ Logo Usage

### Logo Variants

The Hanzo logo is available in multiple variants:

- **Full Logo**: Complete logo with text
- **Mark Only**: Icon mark without text
- **Horizontal**: Horizontal layout
- **Stacked**: Vertical stacked layout

### React Component

```tsx
import { HanzoLogo } from '@hanzo/brand'

// Basic usage
<HanzoLogo />

// With options
<HanzoLogo 
  variant="full"      // full | mark | horizontal | stacked
  size="medium"       // small | medium | large | xl
  theme="dark"        // light | dark | auto
  className="my-logo"
/>
```

### Static Assets

```javascript
import { logos } from '@hanzo/brand'

// Get logo URLs
const logoUrl = logos.full.dark.svg
const markUrl = logos.mark.light.png
```

## 🎯 Design Tokens

```javascript
import { tokens } from '@hanzo/brand'

// Spacing
tokens.spacing.xs  // 4px
tokens.spacing.sm  // 8px
tokens.spacing.md  // 16px
tokens.spacing.lg  // 24px
tokens.spacing.xl  // 32px

// Border radius
tokens.radius.sm   // 4px
tokens.radius.md   // 8px
tokens.radius.lg   // 16px
tokens.radius.full // 9999px

// Shadows
tokens.shadow.sm
tokens.shadow.md
tokens.shadow.lg
```

## 🌙 Theming

### Apply Theme

```javascript
import { applyTheme, themes } from '@hanzo/brand'

// Apply default theme
applyTheme()

// Apply specific theme
applyTheme('dark')
applyTheme('light')

// Get theme configuration
const darkTheme = themes.dark
const lightTheme = themes.light
```

### Custom Theme

```javascript
import { createTheme } from '@hanzo/brand'

const customTheme = createTheme({
  colors: {
    primary: '#custom-color',
    // ... other colors
  },
  typography: {
    // ... typography config
  }
})

applyTheme(customTheme)
```

## 📋 Brand Guidelines

### Voice and Tone

- **Professional**: Clear, concise communication
- **Innovative**: Forward-thinking and cutting-edge
- **Accessible**: Inclusive and easy to understand
- **Trustworthy**: Reliable and transparent

### Visual Guidelines

1. **Logo Clear Space**: Maintain minimum clear space equal to the height of the 'H' in Hanzo
2. **Minimum Size**: Logo should not be displayed smaller than 24px in height
3. **Color Usage**: Use approved brand colors only
4. **Typography**: Use Inter for all text, weights 400-700

### Do's and Don'ts

✅ **DO**
- Use official brand assets
- Maintain proper contrast ratios
- Follow spacing guidelines
- Keep consistent styling

❌ **DON'T**
- Modify logo proportions
- Use off-brand colors
- Create unofficial variations
- Compress or stretch logos

## 🔗 Related Packages

- [@hanzo/ui](https://github.com/hanzoai/ui) - UI component library
- [@hanzo/cli](https://github.com/hanzoai/cli) - Command-line tools
- [@hanzo/sdk](https://github.com/hanzoai/sdk) - JavaScript SDK

## 📚 Resources

- [Brand Portal](https://brand.hanzo.ai)
- [Design System](https://design.hanzo.ai)
- [Component Library](https://ui.hanzo.ai)
- [Documentation](https://docs.hanzo.ai)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © Hanzo AI

---

<div align="center">
  Made with ❤️ by the Hanzo team
  
  [Website](https://hanzo.ai) • [GitHub](https://github.com/hanzoai) • [Twitter](https://twitter.com/hanzoai)
</div>