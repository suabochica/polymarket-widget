------
name: Synthetic Forecast
colors:
  surface: '#07122a'
  surface-dim: '#07122a'
  surface-bright: '#2f3952'
  surface-container-lowest: '#030d25'
  surface-container-low: '#101b33'
  surface-container: '#151f37'
  surface-container-high: '#1f2942'
  surface-container-highest: '#2a344e'
  on-surface: '#d9e2ff'
  on-surface-variant: '#c5c6cd'
  inverse-surface: '#d9e2ff'
  inverse-on-surface: '#263049'
  outline: '#8f9097'
  outline-variant: '#44474d'
  surface-tint: '#b9c7e4'
  primary: '#b9c7e4'
  on-primary: '#233148'
  primary-container: '#0a192f'
  on-primary-container: '#74829d'
  inverse-primary: '#515f78'
  secondary: '#4cd6fb'
  on-secondary: '#003642'
  secondary-container: '#00b2d6'
  on-secondary-container: '#003f4e'
  tertiary: '#ffb3b1'
  on-tertiary: '#680011'
  tertiary-container: '#3c0006'
  on-tertiary-container: '#ee3f4b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#b3ebff'
  secondary-fixed-dim: '#4cd6fb'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001c'
  background: '#07122a'
  on-background: '#d9e2ff'
  surface-variant: '#2a344e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-stakes fintech environments, specifically prediction markets where data density and real-time decision-making are paramount. The brand personality is clinical, precise, and authoritative, evoking a sense of institutional-grade intelligence.

The visual style employs a **Sophisticated Glassmorphism** approach tailored for dark mode. This involves multiple layers of translucency to manage information hierarchy without visual clutter. Surfaces are treated as physical glass panes with subtle specular highlights, allowing the vibrant primary colors to serve as "light sources" that guide the user's eye toward actionable market data. The emotional response is one of calm control amidst volatile data streams.

## Colors

The palette is anchored in a deep-space navy to provide maximum contrast for data visualization. 

- **Primary (#0a192f):** Used for base surfaces and deep containers.
- **Secondary / Yes (#00b4d8):** A vibrant cyan signifying growth, positive outcomes, and "Yes" positions.
- **Tertiary / No (#e63946):** A sharp crimson for risk, negative outcomes, and "No" positions.
- **Neutral (#8892b0):** Used for secondary text and metadata to reduce visual noise.

Use additive color blending for interactive states: "Yes" buttons should have a cyan outer glow when hovered, while "No" buttons should emit a subtle crimson pulse.

## Typography

This design system utilizes **Inter** for all UI and narrative elements due to its exceptional legibility at small sizes and high x-height. For numerical data, price tickers, and probability percentages, **JetBrains Mono** is employed to ensure tabular alignment and a technical, "terminal" aesthetic.

- **Headlines:** Use tight letter spacing and bold weights to anchor market cards.
- **Data Labels:** Always use JetBrains Mono in uppercase for "Yes/No" percentages and "Volume" metrics to differentiate them from descriptive text.
- **Mobile Scaling:** Headlines above 24px should scale down by 20% on mobile devices to preserve horizontal space for data tables.

## Layout & Spacing

The layout follows a **Strict 4px Grid System** to maintain mathematical alignment, essential for data-heavy fintech widgets. 

- **Grid Model:** A 12-column fluid grid for desktop dashboards, collapsing to a single-column stack for the widget view.
- **Margins:** 16px internal padding for market cards ensures content doesn't feel cramped despite high information density.
- **Responsive Behavior:** On mobile, secondary data points (like 24h Volume) are hidden or moved to an expandable "Details" chevron to prioritize the Price/Probability bar.

## Elevation & Depth

Hierarchy is achieved through **Backdrop Blurring** and **Layered Strokes** rather than traditional shadows.

1.  **Level 0 (Background):** Solid `#020c1b`.
2.  **Level 1 (Cards):** Surface `rgba(16, 33, 65, 0.7)` with a 1px border of `white/10%` and a `20px` backdrop blur.
3.  **Level 2 (Modals/AI Panel):** Surface `rgba(20, 45, 90, 0.85)` with a 1px border of `white/20%` and a subtle cyan outer glow (40px spread, 5% opacity) to indicate active AI computation.

Avoid heavy black shadows; use "Inner Glows" (1px white at 5-10% opacity) on the top edge of elements to simulate a light source from above.

## Shapes

The shape language is **Soft-Industrial**. We use a consistent 4px (0.25rem) corner radius for most functional elements to maintain a professional, sharp look. Larger containers like market cards use 8px (0.5rem) to feel distinct from the smaller buttons they contain. 

- **Interactive Elements:** Buttons and input fields use the `rounded` (4px) spec.
- **Data Bars:** Probability bars use sharp (0px) or very slight (2px) radii to maximize the visual horizontal "fill" area.

## Components

### Market Cards
The core component. Features a 1px border. The top section contains the market question. The middle section contains the **Probability Bar**, a horizontal track where the left side fills Cyan (Yes) and the right side fills Crimson (No), meeting in the center with a dynamic percentage label.

### Betting Controls (Segmented Toggle)
A two-state control for "Buy Yes" and "Buy No". When "Yes" is selected, the segment is filled with a Cyan gradient. When "No" is selected, it fills with a Crimson gradient. Text should remain white for legibility.

### AI Prediction Assistant Panel
A docked side-panel or expandable section. It uses a different backdrop blur intensity (32px) and features a persistent, pulsing Cyan border (2px) to signal "Active Intelligence." Data inside this panel uses `label-caps` for all headers.

### Search & Filters
Search bars use a `white/5%` fill with a `white/15%` border. Icons are monochromatic (Neutral #8892b0) and switch to Secondary (#00b4d8) on focus.

### Status Indicators
- **Live:** A pulsing Cyan dot next to a `label-caps` text.
- **Resolved:** A static Neutral icon.
- **High Volatility:** A flickering Crimson warning icon.
version: alpha
name: Predictor
description: Design file for the predictor app.
colors:
  primary: "#0A192F"
  secondary: "#00B4D8"
  tertiary: "#E63946"
  neutral: "#8892B0"
  surface: "#EEF0FF"
typography:
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 700
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 600
  label-md:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: 500
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.tertiary}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 20px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Heritage

## Overview

Architectural minimalism meets journalistic gravitas. The UI evokes a premium matte finish — a high-end broadsheet or contemporary gallery.

## Colors

The palette is rooted in semantic tokens. Use the role (e.g. `{colors.primary}`) — never the hex literal — when authoring components.

- **primary (#0A192F)**
- **secondary (#00B4D8)**
- **tertiary (#E63946)**
- **neutral (#8892B0)**
- **surface (#EEF0FF)**

## Typography

| Token | Font | Size | Weight |
| --- | --- | --- | --- |
| `h1` | Inter | 3rem | 700 |
| `body-md` | Inter | 1rem | 400 |
| `label-caps` | Space Grotesk | 0.75rem | 600 |

## Layout

Spacing scale (use the named scale; avoid arbitrary values):

- `spacing.sm` — 8px
- `spacing.md` — 16px
- `spacing.lg` — 24px

## Elevation & Depth

Depth is conveyed through tonal layering and subtle borders rather than drop shadows. Cards lift from the warm neutral background through pure-white surfaces and a single hairline border.

## Shapes

Corner radius scale:

- `rounded.sm` — 4px
- `rounded.md` — 8px

## Components

### button-primary
- backgroundColor: `{colors.tertiary}`
- textColor: `{colors.surface}`
- rounded: `{rounded.sm}`
- padding: `12px 20px`

### button-secondary
- backgroundColor: `transparent`
- textColor: `{colors.tertiary}`
- rounded: `{rounded.sm}`
- padding: `12px 20px`

### card
- backgroundColor: `{colors.surface}`
- textColor: `{colors.primary}`
- rounded: `{rounded.md}`
- padding: `20px`

### input
- backgroundColor: `{colors.surface}`
- textColor: `{colors.primary}`
- rounded: `{rounded.sm}`
- padding: `10px 14px`

## Do's and Don'ts

- Do use the tertiary color sparingly — only for the highest-emphasis action.
- Don't combine more than two type families on a single screen.
- Don't use full-width images without a generous bottom margin.
- Do default to the warm neutral background; reserve pure white for cards.

