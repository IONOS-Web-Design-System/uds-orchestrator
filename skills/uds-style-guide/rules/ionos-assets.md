# IONOS Assets — Illustration & Animation Rules

**`data-brand="ionos"` | Applies to: marketing animations, hero illustrations, showroom assets, Figma frames, Remotion compositions.**

IONOS visual identity is **restraint over decoration**. Assets — whether a static
illustration, a Remotion animation, a marketing hero, or a Figma frame — earn
attention through content (product, motion, type) rather than background
ornament.

---

## Background treatment

- **No technical grid lines.** Do not draw a grid of dots, hairlines,
  blueprint cross-hatches, or any "engineering-paper" texture as background.
  Other brands (especially developer-tool products) lean on grids; IONOS
  deliberately does not.
- **No decorative lines.** No sweeping curves, diagonal accent lines, "circuit
  trace" paths, or geometric line-art behind content. The background is a
  calm surface, not an active element.
- **Solid or gradient only.** Use a flat brand color or a two-stop linear /
  radial gradient between brand hexes (e.g. `#003D8F` → `#001B41`), or a clean
  off-white (`var(--surface-base)`). Use literal hex for brand-scale colours and
  semantic `var(--surface-*)` tokens for surfaces — never Figma `/`-paths like
  `var(--brand/ionos-blue-600)` (not valid CSS). Subtle vignette/radial fade is
  acceptable; explicit lines are not.
- **Content carries the energy.** Motion, color, and product detail should
  earn the viewer's attention — not background ornamentation.

If a brief asks for a "technical feel" or "developer aesthetic", reach for
typography weight, content density, or product-screen detail — not grid lines.

---

## Icon usage

**Only system icons from `@ionos-web-design-system/icon/system`.** No exceptions
for icon-role glyphs (anything used as an affordance, status indicator, or
inline UI marker). Larger illustrations and decorative SVGs are a separate
category — see [uds-usage-best-practices](../../uds-usage-best-practices/SKILL.md)
for that distinction; the rules here govern icons-as-affordances.

**Strictly forbidden:**

- Emoji characters (`✨`, `📦`, `→`, `✔`, etc.) — including as decorative
  accents on buttons, cards, or callouts. They render inconsistently across
  platforms and break brand control.
- Custom inline `<svg>` paths for icon roles. Even a single-glyph SVG for a
  check or close icon is a hard no — use the package.
- Icon names not present in the package. Guessing breaks the build. If a
  needed icon is unavailable, either (a) check the full export list
  (`icon-names.json` — see verification rule below) or (b) substitute the
  closest semantic neighbor from the curated set below.

**Import pattern:**

```ts
import { plus, arrowRight, checkmark } from '@ionos-web-design-system/icon/system';
// Pass the function reference to a UDS Icon component, or call to get the class:
<Icon icon={plus} />
const cls = checkmark(); // returns "uds-system-checkmark", side-effect: injects CSS
```

**Verification rule (non-negotiable):**
Before importing any icon name not on the curated list below, verify it
exists in `node_modules/@ionos-web-design-system/icon/dist/system/index.d.ts`
(grep for `export function <camelCase>(`). If it isn't there, do not invent
it — find a verified substitute. The TSC gate WILL fail an invalid import,
but you should not rely on the gate as a spell-checker.

**Curated icon names (verified against the current package).** Use these
freely without re-checking. They cover the majority of marketing-illustration
needs:

| Role | Available names (camelCase, import-ready) |
|------|-------------------------------------------|
| Actions | `plus`, `minus`, `checkmark`, `circleX`, `editSquare`, `copy`, `bin`, `download`, `upload`, `share` |
| Navigation | `arrowDown`, `arrowTop`, `arrowLeft`, `arrowRight`, `chevronDown`, `chevronLeft`, `chevronRight`, `arrowsDiagonalExpand`, `arrowsDiagonalContract`, `arrowHorizontalExpand` |
| Status | `info`, `warning`, `circleCheckmark`, `circleExclamation`, `shieldCheckmark` |
| Visibility | `visibility`, `visibilityOff` |
| Common UI | `search`, `bars` (hamburger), `gear` (settings), `bell`, `bellRing`, `phone`, `envelope` (mail), `bookmark`, `heart`, `star` |
| Media | `play`, `pause`, `stop`, `image`, `attachement` (sic — package misspelling, use as-is) |
| Security | `lock`, `key`, `shield` |
| Content | `folder`, `document`, `home`, `cloud`, `clock`, `calendar`, `globe`, `link` |
| Branding | `bolt`, `award`, `user`, `userGroup` |
| Weight variants | Append `300` for the light variant — e.g. `plus300`, `checkmark300`. Use light weights for secondary or decorative roles. |

If you need an icon outside this list (the full package has ~677 names),
verify against `index.d.ts` first — do not assume names from other icon
libraries (Material, Heroicons, Lucide) exist here.

**Common name confusions to avoid** (these names from other libraries do NOT
exist in this package; use the right-hand column instead):

| Don't write | Use instead |
|-------------|-------------|
| `check` | `checkmark` |
| `close` / `x` / `cross` | `circleX` (for filled) or look for a non-circle variant in `index.d.ts` |
| `edit` / `pencil` | `editSquare` |
| `menu` / `hamburger` | `bars` |
| `eye` / `eyeOff` | `visibility` / `visibilityOff` |
| `mail` / `email` | `envelope` |
| `users` (plural) | `userGroup` |
| `checkCircle` | `circleCheckmark` |
| `settings` / `cog` | `gear` |

If the icon you need isn't in the package at all (e.g. `filter` — confirmed
missing as of this writing): use a semantic neighbor. For "filter" reach for
`bars` or `gear`. Never improvise an SVG.

---

## Feature-highlight composition — the IONOS pop-out

**Canonical reference**: the "AI App-Builder" composition in the
`Assets-for-AI` Figma file (`fileKey: StkUOHcGRMDXOZWT0E2nft`,
`nodeId: 9:183`, "Tab 2"). A white chat-prompt bubble on the LEFT pops
out from a dark browser-editor mockup on the right. The bubble's right
edge overlaps the main frame's left edge by roughly 25-40% of the
bubble's width. The bubble is the INPUT; the editor is the OUTPUT.

**Triggering language in the brief:** when the prompt mentions *highlight*,
*spotlight*, *showcase*, *demonstrate*, *show how X works*, or describes
a feature with a clear user-action → result relationship (e.g. *AI prompt
generates an app*, *one click deploys*, *type to search*, *speak to
control*).

### The pattern — INPUT pops out from OUTPUT

1. **Main frame = the OUTPUT.** What the feature PRODUCES — the generated
   app, the populated dashboard, the deployed page, the finished card.
   Typically a browser / editor / app-shell mockup. Dense, content-rich,
   the "magic result." Place center-right of the canvas. The base surface
   theme follows `shared-wireframe-surface-theme.md` — light by default,
   dark ONLY when `colorScheme === 'dark'` or the brief is explicitly
   decorative. AI accents (gradient, sparkle) apply on either base.

2. **Pop-out = the INPUT / affordance.** What the user TYPED, CLICKED,
   DRAGGED, or SAID to trigger the result. The pop-out is ALWAYS the
   user-side of the interaction, never a zoomed-in detail of the output.
   Common shapes:
   - A rounded-pill chat input with typed prompt text (canonical IONOS
     form for AI features — Tab 2 reference).
   - A small control panel with one highlighted button mid-click.
   - A toggle / switch / slider mid-action.
   - A voice-command bubble with a soundwave glyph.

3. **Intersection — non-negotiable.** The pop-out's bounding box overlaps
   the main frame's left (canonical) or right edge. Roughly 25-40% of the
   pop-out's width sits inside the main frame's bounding box; the rest
   sits outside. A pop-out floating clear of the main frame is the wrong
   pattern. A pop-out fully inside reads as a modal — also wrong.

4. **Contrast carries the elevation, not borders.** The pop-out uses surface
   tokens that contrast with the main frame's base theme: on a light main
   frame (the default), use a lighter pop-out; on a dark main frame
   (when `colorScheme === 'dark'` or decorative), use a white/bright pop-out.
   Soft drop shadow, no border — let the value contrast do the layering
   work, not outlines or harsh strokes.

5. **Placement and aspect:**
   - **Position:** left-edge intersection, vertically centered or slightly
     above center (Tab 2 canonical). Right-edge intersection is also
     valid but secondary. Avoid top corners (reads as notification toast)
     and bottom corners (reads as footer popover).
   - **Pop-out width:** ~50-60% of the main frame's width.
   - **Pop-out height:** ~25-40% of the main frame's height — the pop-out
     is short and wide for chat-input shape, square for button-action shape.

6. **What lives inside the pop-out:**
   - The typed/spoken content verbatim (the actual prompt the user wrote
     — pull from the brief when it includes example user input).
   - Up to 3 small affordance icons below or beside the content (send,
     attach, microphone — from `@ionos-web-design-system/icon/system`;
     see the *Icon usage* section above).
   - No extensive chrome. The pop-out is one focused affordance, not a
     mini-screen.

### For animations

The pop-out is the FIRST thing visible — it represents the user's action
that drives the rest. Sequence:

1. **Pop-out enters first** — slide up + fade in + subtle scale; the
   typed/spoken text reveals character-by-character if applicable.
2. **Main frame materializes second** — the result manifests behind /
   around the pop-out, with staggered springs on its inner elements.

The pop-out should feel fixed in place once present — it IS the user —
while the result manifests behind it. Loop behavior (closing back to the
start frame versus holding on the final result) is governed by the
`loop` payload field and the prompt's hard constraints, not by this
rule.

### Counter-patterns — NOT this style

- **Reversed semantic:** OUTPUT in the pop-out and INPUT in the main frame.
  The pop-out is always the affordance; never the result. A small browser
  mockup popping out from a large prompt bubble is wrong.
- **Magnifying-glass overlay** drawn on top of the main frame — reads as
  "search" or "inspect tool", not the IONOS input→output trope.
- **Annotation with arrow line + label** pointing at part of the main
  frame — reads as a tutorial diagram or callout, not an integrated
  affordance.
- **Side-by-side panels** with no overlap — reads as "before/after",
  not "highlight."
- **Multiple pop-outs** at once — dilutes focus; one pop-out per highlight.
- **Floating tooltip** far from the main frame with a leader line —
  reads as annotation, not affordance.
- **Pop-out as a smaller version of the main frame** (a thumbnail) —
  reads as a preview, not an input.

**When the brief doesn't ask for a highlight:** don't force this pattern.
A single-frame composition is correct when there's nothing to spotlight.

---

## Reserved for future rules

This file is the home for further IONOS-specific asset rules as they're
identified. Planned sections (added as iteration surfaces them):
motion pacing, depth & layering.
