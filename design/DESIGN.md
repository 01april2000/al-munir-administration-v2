# Design System Specification: The Mindful Ledger

## 1. Overview & Creative North Star
**North Star: "The Harmonious Sanctuary"**

This design system transcends the utility of a standard payment app. For the modern *santri*, finance is not just a transaction; it is a reflection of discipline, growth, and community values. We reject the "industrial" aesthetic of traditional banking. Instead, we embrace a **Soft Editorial** approach.

By utilizing intentional asymmetry, expansive negative space, and a "Tonal Layering" philosophy, we create an interface that feels like a premium digital journal. The system moves away from rigid grids, opting for a card-based layout where depth is defined by light and color rather than lines and borders. It is professional enough for financial trust, yet soft enough to feel like a personal companion in a student’s journey.

---

## 2. Color & Surface Philosophy
The palette is rooted in `primary` (#006c49), an Emerald Green that symbolizes both organic growth and traditional values.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define boundaries, designers must use background shifts. 
- A card (`surface_container_lowest`) should sit atop a section (`surface_container_low`), which in turn sits on the main `background`. 
- This creates a natural, "carved" look that feels more premium than a 1px stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
- **Level 0 (Base):** `background` (#f4fbf4)
- **Level 1 (Sections):** `surface_container` (#e8f0e9)
- **Level 2 (Primary Cards):** `surface_container_lowest` (#ffffff)
- **Level 3 (Interactive/Floating):** Use **Glassmorphism**. Apply `surface_variant` at 60% opacity with a `20px` backdrop blur to create a "frosted glass" effect for navigation bars or modals.

### Signature Textures
Main CTAs must not be flat. Use a subtle linear gradient (135°) from `primary` (#006c49) to `primary_container` (#10b981). This adds "soul" and a sense of forward momentum to the payment action.

---

## 3. Typography
We utilize **Inter** to maintain a clean, high-performance feel. The hierarchy is designed to feel editorial, using drastic scale shifts to guide the eye.

*   **Display (Large/Medium):** Reserved for account balances and "Success" states. These should feel authoritative yet airy.
*   **Headline (Small/Medium):** Used for section titles (e.g., "Monthly Dues"). Pair these with `on_surface_variant` to keep the UI feeling "soft."
*   **Title (Medium):** The workhorse for card headings. Use `title-md` with `0.5px` letter spacing for a custom, "high-end" look.
*   **Body & Labels:** All micro-copy must use `body-sm` or `label-md`. Never use pure black; always use `on_surface` (#161d19) to reduce eye strain during late-night study sessions.

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** and **Ambient Shadows**, avoiding the "pasted-on" look of standard Material Design.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The slight delta in hex values creates a sophisticated "lift" without visual clutter.
*   **Ambient Shadows:** For floating elements (like a "Pay Now" FAB), use a shadow with a `24px` blur and `4%` opacity. The shadow color must be a tinted version of the primary color: `rgba(0, 108, 73, 0.08)`.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at **15% opacity**. A 100% opaque border is a failure of the system.

---

## 5. Components

### Cards & Lists (The Core)
*   **Card Radius:** Always `xl` (1.5rem/24px) or `lg` (1rem/16px) to maintain a friendly, approachable hand-feel.
*   **List Items:** Forbid the use of divider lines. Separate transactions using `8px` of vertical white space (Spacing 2) and subtle alternating background tints.

### Buttons
*   **Primary:** Gradient-filled (`primary` to `primary_container`), `full` roundedness, with `title-sm` typography.
*   **Secondary:** `surface_container_high` background with `on_primary_fixed_variant` text. No border.

### Status Indicators (The "Moral" Palette)
*   **Paid:** Use `secondary_container` (#adedd3) with `on_secondary_container` (#306d58).
*   **Unpaid/Pending:** Use `tertiary_container` (#e29100) with `on_tertiary_container` (#523200).
*   **Overdue:** Use `error_container` (#ffdad6) with `on_error_container` (#93000a).
*   *Styling:* These must be "Pill" style (rounded-full) with `label-md` typography.

### Input Fields
*   **State:** Use a `surface_container_highest` background. 
*   **Focus:** Instead of a thick border, use a `2px` glow of `surface_tint` at 20% opacity.

### Unique Component: The "Growth Progress" Bar
A bespoke tracking component for students to see their savings or tuition progress. Use a thick `12px` bar with `primary` for the progress and `surface_container_high` for the track. Add a soft glow to the leading edge of the progress bar.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical spacing. A card might have `24px` top padding and `32px` bottom padding to create a sense of "gravity."
*   **Do** use `primary_fixed_dim` for icons in dark mode to prevent "neon-glow" eye fatigue.
*   **Do** embrace the "Ghost Border" only when absolutely necessary for high-contrast accessibility modes.

### Don't
*   **Don't** use 1px solid dividers (hex #CCCCCC, etc.). If you need to separate content, use white space.
*   **Don't** use pure black (#000) or pure grey. Every "neutral" color in this system is slightly infused with green (#f4fbf4) to maintain the brand’s organic DNA.
*   **Don't** use sharp corners. Everything—from tooltips to checkboxes—must have at least a `sm` (0.25rem) radius.