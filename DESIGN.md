---
name: "SECERA"
description: "Effortlessly classy, calm confidence, effortlessly sharp."
colors:
  primary: "#722f38"
  primary-deep: "#5a252d"
  paper: "#f6f2ec"
  ink: "#261f1f"
  muted: "#7b6f6b"
  offwhite: "#f9f9f9"
typography:
  display:
    fontFamily: "\"Libre Caslon Display\", serif"
    fontSize: "clamp(2.5rem, 8vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "\"Libre Caslon Display\", serif"
    fontSize: "clamp(2rem, 6vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "\"Plus Jakarta Sans\", sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.0360em"
  label:
    fontFamily: "\"Plus Jakarta Sans\", sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.0560em"
rounded:
  none: "0"
spacing:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-cta:
    backgroundColor: "transparent"
    textColor: "{colors.offwhite}"
    rounded: "{rounded.none}"
    padding: "12px 40px"
  button-cta-hover:
    backgroundColor: "{colors.offwhite}"
    textColor: "{colors.primary-deep}"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
---

# Design System: SECERA

## 1. Overview

**Creative North Star: "The Editorial Sanctuary"**

SECERA is a space of calm confidence and high-fashion aspiration. The interface feels like a premium print magazine: spacious, typographically driven, and intentionally sharp. It avoids the soft, rounded "friendliness" of modern SaaS in favor of a sophisticated, architectural precision that honors the craft of the garments it showcases.

The system is built on a "Zero Radius" doctrine, where every edge is a clean 90-degree angle, creating a sense of formal structure that contrasts beautifully with the soft, flowing photography of the products.

**Key Characteristics:**
- **High-Fashion Typography**: Strong serif displays paired with modern, breathable sans.
- **Atmospheric Palette**: Warm, tactile neutrals ("Paper") accented by deep, confident Wine.
- **Architectural Sharpness**: A strict refusal of rounded corners to maintain a premium, custom-tailored feel.
- **Spacious Rhythm**: Large margins and deliberate whitespace to let the products breathe.

## 2. Colors

The palette is aspirational and tactile, moving away from "digital" blues and grays toward the textures of high-end stationery and textile dyes.

### Primary
- **Wine** (#722f38): The signature of the brand. Used for core brand moments, price highlights, and active states.
- **Wine Deep** (#5a252d): A darker, more grounded tone used for hover states and moments of deep commitment.

### Neutral
- **Paper** (#f6f2ec): The primary background color. It feels softer and more expensive than pure white, providing a tactile foundation.
- **Ink** (#261f1f): Used for primary text and headings. It is a warm, deep brown-black that maintains soft contrast against Paper.
- **Muted** (#7b6f6b): Used for secondary labels, borders, and metadata.
- **Off-white** (#f9f9f9): Used for elements that need to lift off the Paper surface, like CTA buttons or floating navigation.

### Named Rules
**The No-Gradient Rule.** Never use gradients for backgrounds or text. Color is always solid and confident.
**The Rarity Rule.** Use Wine only for what matters. Its impact comes from its scarcity against the Paper backdrop.

## 3. Typography

**Display Font:** Libre Caslon Display (with serif fallback)
**Body Font:** Plus Jakarta Sans (with sans-serif fallback)

**Character:** A high-contrast editorial pairing. Libre Caslon Display provides the decorative, high-fashion drama of a luxury magazine, while Plus Jakarta Sans offers a crisp, modern Indonesian clarity for the interface and product information.

### Hierarchy
- **Display** (400, `clamp(2.5rem, 8vw, 4rem)`, 1.08): Hero headlines and major section titles.
- **Headline** (400, `clamp(2rem, 6vw, 3rem)`, 1.08): Page headings and featured product names.
- **Title** (600, 1.25rem, 1.4, 0.0420em): Small section headers and modal titles.
- **Body** (500, 1rem, 1.6, 0.0360em): Paragraphs and product descriptions. Target line length: 65–75ch.
- **Label** (600, 0.7rem, 0.0560em, uppercase): Navigation, category tags, and micro-copy.

### Named Rules
**The High-Fashion Title Rule.** Headings should always use Libre Caslon Display with tight tracking (`-0.03em`) for that editorial look.
**The UI Clarity Rule.** All interactive elements (buttons, inputs, nav) must use Plus Jakarta Sans for speed of recognition and a modern, airy feel.

## 4. Elevation

SECERA is a flat system. We do not use shadows to create depth; instead, we use **Tonal Layering** and **Borders**.

### Shadow Vocabulary
- **None.** We avoid traditional box-shadows. Depth is achieved by placing Off-white or Card-white surfaces on top of the Paper background.

### Named Rules
**The Flat-By-Default Rule.** Do not use shadows to lift elements. Use color-contrast or 1px borders (#261f1f/12) to define containers.
**The Motion Over Depth Rule.** If an element needs to feel "above" another, use entrance animations or opacity shifts rather than elevation.

## 5. Components

Every component is defined by the Zero-Radius doctrine.

### Buttons
- **Shape:** Sharp (0px radius).
- **CTA Button:** Transparent background, 1px border (#f9f9f9/80), white text, uppercase label.
- **Hover / Focus:** Fill with Off-white, text shifts to Wine Deep. Smooth 0.3s transition.

### Cards / Containers
- **Corner Style:** Sharp (0px).
- **Background:** Usually transparent or white on top of Paper.
- **Border:** 1px subtle stroke (#261f1f/8) instead of a shadow.

### Navigation
- **Style:** Minimalist. Labels are uppercase with 0.18em tracking.
- **Backdrop:** 98% opacity Off-white with a subtle blur for the "scrolled" state.

## 6. Do's and Don'ts

### Do:
- **Do** use `border-radius: 0` for every single element in the UI.
- **Do** use Bodoni Moda for headlines to maintain the high-fashion feel.
- **Do** use `#f6f2ec` (Paper) as the default background for a soft, premium touch.
- **Do** maintain wide letter-spacing (0.18em) for uppercase labels.

### Don't:
- **Don't** use rounded corners (`rounded-lg`, `rounded-full`, etc.) unless it is a circular icon button.
- **Don't** use blue or teal accents; the palette is strictly Wine and Earthy Neutrals.
- **Don't** use dark mode as a default; SECERA lives in the light of an "Editorial Sanctuary."
- **Don't** use heavy box-shadows or "glassmorphism" as a decorative layer.
