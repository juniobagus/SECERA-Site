# Brand Style & Typography Audit: Ever Vessel

## 1. Typography Analysis
Ever Vessel employs a sophisticated hybrid typography system that balances editorial elegance with functional clarity.

### A. Editorial Serif (Headings)
*   **Fonts**: `PT Serif` & `Source Serif 4`
*   **Usage**: Primary headings (H1-H4), product titles, and editorial quotes.
*   **Key Findings**:
    *   **Tight Tracking**: Uses `letter-spacing: -0.02em` for large headings. This technique makes the typography feel more deliberate, premium, and "fashion-forward."
    *   **Hierarchy**: Large size contrast between H1 (~44px) and body text, creating a strong visual anchor.
    *   **Weight**: Primarily regular (400) or medium (500) weights, avoiding heavy bolds to maintain a light, airy feel.

### B. Functional Sans-Serif (Body & UI)
*   **Font**: `Lato`
*   **Usage**: Body copy, navigation links, buttons, and metadata labels.
*   **Key Findings**:
    *   **Wide Tracking**: Labels and navigation items often use `text-transform: uppercase` with `letter-spacing: 0.1em` to `0.15em`.
    *   **Legibility**: Lato provides a clean, modern look that remains highly readable at small sizes (12px-14px).
    *   **Weight**: Standard body uses weight 500 (Medium) for better contrast against white backgrounds.

---

## 2. Color System
The palette is curated to feel organic and high-end, avoiding harsh primary colors.
*   **Brand Navy (`#2D3347`)**: The primary "ink" color. It provides a softer, more sophisticated alternative to pure black.
*   **Accent Terracotta (`#C45A34`)**: Used sparingly for CTAs, sale badges, and interactive states. It adds warmth and an earthy touch.
*   **Neutral Off-White (`#F8F8F8`)**: The primary background color, softer on the eyes than pure `#FFFFFF`.
*   **Grey Tones (`#EEEEEE`, `#D9D9D9`)**: Used for borders and subtle container backgrounds.

---

## 3. Design Patterns & UI Elements
*   **Glassmorphism**: Extensive use of `backdrop-blur` (Liquid Glass effect) on navigation bars and overlays to create depth.
*   **Rounded Geometry**: A mix of `rounded-sm` (buttons) and `rounded-2xl` (content sections) to create a soft, approachable interface.
*   **Bento Grid**: Content is organized in clean, well-spaced grids with generous gutters and padding.
*   **Micro-Interactions**: Smooth CSS transitions (`duration-300`, `ease-in-out`) on all hoverable elements.

---

## 4. Implementation Notes for SECERA
1.  **Heading Refinement**: Consider applying `-0.02em` tracking to SECERA's serif headings to enhance the premium feel.
2.  **Navigation Spacing**: Use `0.15em` tracking for uppercase navigation items to improve "airiness" and luxury perception.
3.  **Soft Containers**: Use off-white backgrounds (`#F9F9F9`) for alternate sections to break up long pages without using hard dividers.
