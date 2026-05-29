# Wireframe Notes — Without Skill

## Approach

Built by reading the UDS rule files directly (react-button.md, react-box.md,
react-hero-tile.md, react-surface.md, react-theme-provider.md,
react-theme-inverter.md, core-spacing-tokens.md) to understand correct API usage.

## Component choices

### Hero section — dark background
- Used `ThemeInverter forceColorScheme="dark"` wrapping the hero so the dark
  background is achieved via the design system's theme inversion rather than
  hard-coded CSS colours. This is the recommended UDS pattern for hero sections.
- `HeroTile` with `backgroundColor="highlight"` provides the brand surface token.
- `Surface variant="base"` inside the inverter ensures correct surface token
  resolution after inversion.

### Typography
- Headline: `Text variant="heading5xl"` rendered as `<h1>` via `asChild`.
- Brand-coloured accent word: nested `Text className="text-brand"` inside the h1.
- Subline: `Text variant="bodyLg" className="text-subtle"` rendered as `<p>`.
- Section heading below: `Text variant="heading3xl"` rendered as `<h2>`.

### CTA button
- `Button concept="brand" variant="primary" size="large"` — the correct UDS
  pattern for a primary call-to-action. `concept="brand"` is specifically
  recommended for CTA buttons in the rules.

### Feature cards
- Used `Box` (the non-deprecated flexible card-like layout component) instead of
  `Card` (which is deprecated per the rule file).
- `Box visual={{ icon: true, iconContent: <Icon ... /> }}` provides the icon
  visual area at the top of each card.
- `Box footer={<Button>}` places the per-card CTA in the designated footer slot.
- Card CTAs use `variant="secondary"` to create visual hierarchy below the hero's
  primary CTA.

### Layout and spacing
- 3-column grid: `grid grid-cols-1 md:grid-cols-3` with `gap-6` (resolves to
  `var(--space-6)` = 40px on comfortable platform).
- Section padding: `px-8 py-10` for the feature section (64px horizontal,
  80px vertical on comfortable).
- Hero padding: `px-8 py-10 lg:py-14` matching the HeroTile layout guidance.

### What could be improved with skill guidance
- Without the skill I had to manually hunt through individual rule files to piece
  together the correct patterns. The skill would have surfaced:
  1. The `Card` deprecation immediately, pointing to `Box` as the replacement.
  2. The correct `ThemeInverter forceColorScheme="dark"` pattern for dark hero
     sections.
  3. UDS spacing token semantics (p-4 = 24px, not 16px) proactively.
- There is some uncertainty about whether `Text variant="bodyLg"` is a valid
  variant — the text tokens rule mentioned a size scale but I could not confirm
  `bodyLg` without a dedicated Text component rule file. The skill would resolve
  this immediately via the quick-reference table.
