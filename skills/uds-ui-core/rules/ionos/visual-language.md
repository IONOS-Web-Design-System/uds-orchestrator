# IONOS interface visual language

Every IONOS interface (wireframe or realistic, product frame or device screen) follows the IONOS
Figma pages (Cloud Panel login, product overview, products page). Values are light-scheme; the
tokens resolve dark themselves.

## Layer by fill, never by stroke

- **Plane:** the page / content area is `var(--surface-subtle, #F4F7FA)`.
- **Containers on the plane** (cards, tiles, panels, list groups, rails) are `var(--surface-base, #FFFFFF)`
  with radius `var(--protected-container-rounded)` (16px), padding 24, **no border, no shadow**.
  `KitCard` already draws exactly this on ionos.
- **Nested group inside a white container** (summary box, selected row, inline note): back to the
  plane tone `surface-subtle`, radius 8–16. Alternate the two tiers; never a stroke, never a third.
- **Strokes only on:** drawn form fields (`--border-input-default`), the header's 1px bottom hairline
  `var(--border-base)`, data-table row dividers. Never on a card, tile, panel, rail or section.
- **Shadow only on what floats** (the product frame on the canvas, a floating highlight, a card over a
  photo): `0 16px 32px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.1)`. In-flow cards carry none.
- **Header:** `surface-base` bar: logo left, a search pill centre (`surface-subtle` fill, fully
  rounded, no stroke), icon actions right.
- **Spacing:** 8px between tiles of one grid, 24–32 between sections, generous outer padding.

## Type: size and family carry the hierarchy, weights stay light

| Role | `KitText` |
|---|---|
| Page title (one per screen) | `heading4xl` `weight="normal"` (Overpass Regular) |
| Section heading | `heading2xl` / `headingXl` `weight="semibold"` |
| Card / tile title | `headingLg` `weight="semibold"` |
| Body, descriptions | `body`; secondary lines `tone="subtle"` |
| Labels, nav items, table heads, a highlighted value | `bodySm` / `body` `weight="semibold"` |
| Meta, captions | `bodyXs` / `bodySm` `tone="subtle"` |

Never `weight="bold"` on a heading (it renders Regular on ionos). Emphasis is `semibold` or
`tone="accent"` (links), never bold + colour + size at once.

## Actions

One primary `KitButton` per view (the sky pill), `variant="secondary"` (outline pill) beside it,
`variant="tertiary"` for "No, thanks"-level actions.
