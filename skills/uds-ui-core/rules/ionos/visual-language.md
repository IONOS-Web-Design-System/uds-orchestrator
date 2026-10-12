# IONOS interface visual language

Every IONOS interface (wireframe or realistic, frame or device screen). Light-scheme values; the
tokens resolve dark themselves.

## Fill builds the structure; a line marks an interaction

- **Plane:** the page / content area is `var(--surface-subtle, #F4F7FA)`.
- **Containers on the plane** (cards, tiles, panels, list groups, rails, the header) are
  `var(--surface-base, #FFFFFF)`, radius `var(--protected-container-rounded)` (16px), padding 24,
  **no border, no shadow**. `KitCard` already draws exactly this on ionos.
- **Inside a white container** a group, a selected row or a band is `surface-subtle` again, radius
  8–16. Alternate the two tiers; never a third.
- **No structural lines.** Header, sidebar, tables, lists, grids and calendars separate by fill
  and spacing: rows by gap or alternating `surface-subtle` bands, columns and cells as tiles with
  gaps, the header by its white fill on the plane. No divider rules, no accent edge bars.
- **A line only highlights an interaction:** the field being typed in (`1px solid
  var(--border-input-active, #095BB1)`), the selected item, the active tab indicator, and the
  wireframe's selection marquee / connector.
- **Text fields:** a `surface-subtle` fill with NO stroke, radius 8 (search: fully rounded). On the
  plane, where that fill is the background, a white field with a `1px solid var(--border-base)`
  low-contrast line. Never a dark stroke.
- **Shadow only on what floats** (the product frame on the canvas, a floating element, a card over
  a photo): `0 16px 32px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.1)`.
- **Spacing:** 8px between tiles of one grid, 24–32 between sections.

## Type: size and family carry the hierarchy

| Role | `KitText` |
|---|---|
| Page title (one per screen) | `heading4xl` `weight="normal"` (Overpass Regular) |
| Section heading | `heading2xl` / `headingXl` `weight="bold"` (Overpass SemiBold on ionos) |
| Card / tile title | `headingLg` `weight="bold"` |
| Body, descriptions | `body`; secondary lines `tone="subtle"` |
| Labels, nav items, a highlighted value | `bodySm` / `body` `weight="bold"` (600) |
| Meta, captions | `bodyXs` / `bodySm` `tone="subtle"` |

Emphasis is weight or `tone="accent"` (links), never weight + colour + size at once.

## Actions and AI

One primary `KitButton` per view (the sky pill), `variant="secondary"` (outline pill) beside it,
`variant="tertiary"` for "No, thanks"-level actions.

**A floating AI prompt is ALWAYS the shipped template**: `import { PromptWindow } from
'./uds/PromptWindow'`, `brand="ionos"`, `variant` `'prompt-simple'` (≤ 40 chars) or `'prompt-full'`,
rendered as a direct child of the root (no wrapper; it sets its own position and z-index). This
replaces every hand-built floating prompt bubble, bar or card in the direction rules. Animate it
only through its props: `bottom` for the rise-in (whole px, settled before typing) and
`promptText={(texts.promptText ?? '').slice(0, n)}` for typing. A prompt INSIDE the interface stays
a drawn field + `KitButton concept="ai"`.
