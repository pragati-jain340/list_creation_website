---
name: Warm Planner
colors:
  surface: '#fbf9f7'
  surface-dim: '#dcdad8'
  surface-bright: '#fbf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f1'
  surface-container: '#f0edeb'
  surface-container-high: '#eae8e6'
  surface-container-highest: '#e4e2e0'
  on-surface: '#1b1c1b'
  on-surface-variant: '#4e4638'
  inverse-surface: '#30302f'
  inverse-on-surface: '#f3f0ee'
  outline: '#807666'
  outline-variant: '#d1c5b2'
  surface-tint: '#7a5907'
  primary: '#7a5907'
  on-primary: '#ffffff'
  primary-container: '#b58e3d'
  on-primary-container: '#3c2a00'
  inverse-primary: '#ecc06a'
  secondary: '#625e50'
  on-secondary: '#ffffff'
  secondary-container: '#e6dfcd'
  on-secondary-container: '#676354'
  tertiary: '#645e49'
  on-tertiary: '#ffffff'
  tertiary-container: '#9b947c'
  on-tertiary-container: '#312d1b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea3'
  primary-fixed-dim: '#ecc06a'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#e9e2d0'
  secondary-fixed-dim: '#ccc6b4'
  on-secondary-fixed: '#1e1c10'
  on-secondary-fixed-variant: '#4a4739'
  tertiary-fixed: '#ebe2c8'
  tertiary-fixed-dim: '#cec6ad'
  on-tertiary-fixed: '#1f1c0b'
  on-tertiary-fixed-variant: '#4c4733'
  background: '#fbf9f7'
  on-background: '#1b1c1b'
  surface-variant: '#e4e2e0'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-base:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-mono:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 32px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is rooted in the "Digital Notebook" aesthetic—functional, airy, and grounded. It targets organized travelers who appreciate a Notion-like clarity but desire a warmer, more tactile emotional response. 

The style is **Minimalist** with a **Tactile** undertone. It avoids sterile corporate grays in favor of a sun-bleached, sandy palette that evokes the feeling of a physical travel journal. Visual hierarchy is achieved through structured layouts and subtle containment rather than aggressive ornamentation. The goal is to make the act of packing feel like the beginning of an adventure rather than a chore.

## Colors

The palette is inspired by natural, earthy tones found in a travel sketchbook.

*   **Primary:** A muted, golden-sand ochre used for high-level headers and key interactions.
*   **Secondary:** A very light, cream-based "paper" color used for prominent call-outs or highlighted sections.
*   **Tertiary:** A slightly deeper sand tone used for subtle backgrounds and grouping containers.
*   **Neutral:** A warm, charcoal-brown for typography, ensuring readability while maintaining a softer contrast than pure black.
*   **Background:** The canvas is a crisp white or near-white (#FCFCFB) to keep the "Planner" feel modern and clean.

## Typography

This design system uses a pairing of **Plus Jakarta Sans** for headlines and **Work Sans** for all functional text.

The typography mirrors a digital planner:
*   **Headlines** are bold and geometric to provide clear section anchors.
*   **Body Text** is set in Work Sans for its exceptional legibility and neutral, reliable character.
*   **Labels** use a slightly heavier weight and tracking to distinguish them from standard list items.
*   **Links** and small metadata should maintain the same warm-neutral color to avoid distracting from the list content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain the "page" feel, centering a max-width container (approx. 1100px) on the screen.

*   **Rhythm:** A base-8 spacing scale is used for consistency.
*   **Grid:** A 12-column grid is used for the desktop view, typically grouping categories into 4-column cards (3 columns of cards per row).
*   **Mobile:** On mobile devices, the grid collapses into a single column. Margin width reduces from 32px to 16px to maximize horizontal space for checklist items.
*   **Cards:** Use a consistent 24px gutter between category cards to ensure clear separation and breathing room.

## Elevation & Depth

To maintain a minimal and clean look, this design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

*   **Surface Containers:** Use a very light gray or tertiary-sand outline (1px) to define cards.
*   **Highlight Layers:** Important call-outs (like the Intro or Bio) use the Secondary color as a solid background fill rather than a shadow.
*   **Interactive Elements:** Hover states for cards should trigger a subtle, extra-diffused ambient shadow (e.g., 4px blur, 4% opacity) to provide tactile feedback without breaking the flat "paper" aesthetic.

## Shapes

The shape language is **Soft**. All containers, including category cards and the personal bio section, use a 0.25rem (4px) corner radius. This provides just enough softness to feel approachable without appearing overly "bubbly" or informal. Checkboxes maintain this same 4px radius to harmonize with the container shapes.

## Components

### Checklist Items
*   **Checkboxes:** Square with a 4px corner radius. Border should be 1.5px thick in the neutral-color. When checked, the background fills with the primary-color.
*   **Text:** Body-base typography. When checked, the text should transition to a 50% opacity neutral-color with a subtle strikethrough.

### Category Cards
*   **Header:** Features an icon/emoji followed by a Label-Bold title. A thin horizontal rule separates the header from the checklist content.
*   **Padding:** 24px internal padding on all sides.

### Bio Section
*   **Profile Image:** Circular (fully rounded) to contrast against the soft-square geometry of the rest of the UI.
*   **Background:** Use the Tertiary or Secondary color to wrap the entire bio section, visually separating the "Author" from the "Content."

### Information Callouts
*   **Banner:** A full-width horizontal bar using the Secondary color background. Use an icon on the left to indicate the type of information (e.g., tip, warning, note).

### Input Fields (Add New Item)
*   **Style:** Minimalist. A simple underline or a very light 1px border. Focus state should highlight the border in the Primary-color.