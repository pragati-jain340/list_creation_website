---
name: Warm Planner Dark
colors:
  surface: '#151312'
  surface-dim: '#151312'
  surface-bright: '#3c3837'
  surface-container-lowest: '#100e0d'
  surface-container-low: '#1d1b1a'
  surface-container: '#221f1e'
  surface-container-high: '#2c2928'
  surface-container-highest: '#373433'
  on-surface: '#e8e1df'
  on-surface-variant: '#d1c5b2'
  inverse-surface: '#e8e1df'
  inverse-on-surface: '#33302e'
  outline: '#9a8f7e'
  outline-variant: '#4e4638'
  surface-tint: '#ecc06a'
  primary: '#ecc06a'
  on-primary: '#412d00'
  primary-container: '#b58e3d'
  on-primary-container: '#3c2a00'
  inverse-primary: '#7a5907'
  secondary: '#d1c4bc'
  on-secondary: '#362f2a'
  secondary-container: '#4e453f'
  on-secondary-container: '#bfb3ab'
  tertiary: '#cec5c1'
  on-tertiary: '#342f2d'
  tertiary-container: '#9a928f'
  on-tertiary-container: '#302b29'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea3'
  primary-fixed-dim: '#ecc06a'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#ede0d8'
  secondary-fixed-dim: '#d1c4bc'
  on-secondary-fixed: '#211a16'
  on-secondary-fixed-variant: '#4e453f'
  tertiary-fixed: '#eae1dd'
  tertiary-fixed-dim: '#cec5c1'
  on-tertiary-fixed: '#1f1b19'
  on-tertiary-fixed-variant: '#4b4643'
  background: '#151312'
  on-background: '#e8e1df'
  surface-variant: '#373433'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is a sophisticated, dark-mode evolution of a warm, productivity-focused interface. It targets professionals and organizers who seek a focused, low-eye-strain environment without sacrificing the richness of a premium lifestyle brand.

The aesthetic blends **Modern Minimalism** with **Tonal Layering**. It moves away from the stark coldness of typical dark modes, opting instead for a palette rooted in deep charcoals and dark chocolate. The emotional response should be one of "calm focus" and "refined organization"—evoking the feeling of a quiet, high-end study at night. The gold accent provides a singular point of prestige and direction within the deep, dark canvas.

## Colors
The color palette is built on a foundation of warm, dark neutrals to maintain the "Warm Planner" heritage in a dark-mode context.

- **Primary (Gold):** `#B58E3D` is used sparingly for interactive states, progress indicators, and primary actions. It must maintain a high contrast ratio against the dark backgrounds.
- **Surface Foundations:** The base background is a near-black chocolate (`#0F0D0C`). Secondary and tertiary surfaces use `#1A1614` and `#2C2520` to create subtle depth.
- **Functional Colors:** Success states use a desaturated sage green, while errors use a muted terracotta to remain consistent with the warm temperature of the system.
- **Text:** Primary text should be an off-white (`#F5F2F0`) to reduce the harshness of pure white-on-black, while secondary text uses a warm grey (`#99918C`).

## Typography
The typography uses **Plus Jakarta Sans** across all levels to maintain a friendly yet professional tone. The soft curves of the typeface balance the deep, moody color palette.

For dark mode, font weights are slightly adjusted to ensure legibility against dark backgrounds; avoid using "Thin" or "Light" weights for body text. Headlines use tighter letter spacing and bold weights to command attention. High-hierarchy labels (like navigation items) use a medium-bold weight to ensure they remain distinct when colored in the secondary text shade.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain a sense of structured planning, while transitioning to a fluid model for mobile.

- **Grid:** A 12-column grid is used for desktop. Components should align to the 8px base unit.
- **Padding:** Content containers use generous internal padding (24px - 32px) to allow the dark surfaces to "breathe," preventing the UI from feeling cramped.
- **Reflow:** On mobile, side-by-side card layouts should stack vertically. Margins reduce to 16px to maximize screen real estate for task lists and schedules.

## Elevation & Depth
In this dark mode system, hierarchy is communicated through **Tonal Layers** rather than heavy shadows.

- **Surface Tiers:** The further an object "rises" toward the user, the lighter its surface becomes. Level 0 is the deepest background (`#0F0D0C`), Level 1 (Cards/Inputs) is `#1A1614`, and Level 2 (Modals/Popovers) is `#2C2520`.
- **Inner Glows:** Instead of traditional drop shadows, use a subtle 1px top-border or an inner-glow effect (opacity 10% white) on elevated components to define their edges against the dark background.
- **Overlays:** Full-screen overlays for modals should use a 60% opacity of the base neutral color with a subtle backdrop blur (8px) to maintain context.

## Shapes
The shape language is **Rounded**, echoing the friendly geometry of Plus Jakarta Sans.

- **Standard Radius:** 0.5rem (8px) for buttons, input fields, and small cards.
- **Large Radius:** 1rem (16px) for main content containers and dashboard widgets.
- **Interactive Elements:** Use the standard radius consistently. Avoid pill-shapes for buttons to maintain a "structured" planner feel, unless they are floating action buttons.

## Components
- **Buttons:** Primary buttons are solid Gold (`#B58E3D`) with black text for maximum contrast. Secondary buttons use a subtle outline in Gold with Gold text. Ghost buttons use secondary text color.
- **Input Fields:** Backgrounds should be Level 1 (`#1A1614`) with a 1px border of `#2C2520`. On focus, the border transitions to Gold.
- **Cards:** Cards use the Level 1 surface. They should have no visible shadow; instead, use a subtle border or a slight tonal difference to separate them from the background.
- **Chips/Tags:** Used for categorization. These should have a low-opacity Gold background (15%) with solid Gold text to stand out without being overwhelming.
- **Lists:** List items are separated by thin `#2C2520` dividers. Active items in a list should use a subtle vertical Gold bar on the left edge.
- **Progress Bars:** Use a deep neutral background with a solid Gold fill.