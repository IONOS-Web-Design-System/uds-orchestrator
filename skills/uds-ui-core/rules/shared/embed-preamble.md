# Shared wireframe embed contract (all brands)

Applies when the brief contains a `[HYBRID EMBED CONTRACT]` section, for **any** brand.
Follow the section named by the contract's `Style:` line (or, for the two composite
styles below, the `[PRODUCT-POP-OUT COMPOSITE]` / `[DEVICE-MOCKUP COMPOSITE]` tag) — that
is the exact geometry to build. This file is geometry-only: brand colour always comes from
`uds-style-guide` (and, for the AI look, `uds-style-guide/rules/ionos-ai-features.md` today)
— never hardcode a brand hex here. Reference colour semantically ("the brand gradient", "the
brand AI gradient") and resolve the actual value per the active `brand` at generation time.

The embedded product interface's **base surface theme** (root/panels/cards/text) follows
`shared/surface-theme.md`: bind it to the `colorScheme`-resolved UDS surface tokens —
do NOT hardcode a dark panel background/gradient to make it look premium. Light is the default;
a dark base only when `colorScheme='dark'` or the brief asks for dark. (The AI gradient accents
are independent — see that rule.)

| embedStyle code | Contract `Style:` line (as dispatched) | Section |
|---|---|---|
| `background-pointer` | `Style: image-backdrop with feature pointer` | [Style: image-backdrop with feature pointer](#style-image-backdrop-with-feature-pointer) |
| `background-full` | `Style: image-backdrop full-bleed` | [Style: image-backdrop full-bleed](#style-image-backdrop-full-bleed) |
| `interface-asset` | `Style: interface-asset` | [Style: interface-asset](#style-interface-asset) |
| `floating-card` | `Style: floating image card with intersecting highlights` | [Style: floating image card with intersecting highlights](#style-floating-image-card-with-intersecting-highlights) |
| `product-pop-out` | `[PRODUCT-POP-OUT COMPOSITE]` tag (no `Style:` line) | [Style: product-pop-out](#style-product-pop-out) |
| `device-mockup` | `[DEVICE-MOCKUP COMPOSITE]` tag (no `Style:` line) | [Style: device-mockup](#style-device-mockup) |

In the two backdrop styles the catalog image is a **backdrop** the UI floats over; in the
interface-asset style the catalog image lives **inside** the wireframe as its hero/media
asset; in the two composite styles there is no catalog-image backdrop at all — the root is
**transparent** and a character cutout composites with a UI/device wireframe. Across the four
opaque styles the imagery is never keyed, masked, or punched through, and the UI never
pretends to live inside a pictured device screen.

Rules for the four opaque styles (`background-pointer`, `background-full`, `interface-asset`,
`floating-card`):

- **Opaque root.** Give the composition root an explicit opaque `backgroundColor`
  (transparent roots render black in mp4).
- **Never cover the imagery's focal subject.** The contract / composition plan says which
  side has negative space — that side gets the floating UI. (For interface-asset this
  applies inside the hero/media slot: keep the floating fragments over the imagery's calm
  region, not its focal subject.)
- **Critical content margins.** Keep floating UI — panels, buttons, and badges — within the
  middle 90% of the canvas; nothing critical within ~48px of a canvas edge.
- **Still gate.** Frame 0 must already show the backdrop image plus the floating UI cleanly
  composed — no empty canvas, no elements mid-flight off-screen.

The two composite styles (`product-pop-out`, `device-mockup`) are **transparent-root** by
contract — see their sections below for their own still-gate and margin rules.

## Verifying

Verify with the still gate: frame 0 shows the backdrop imagery plus the floating UI cleanly
composed — pointer style additionally shows the marquee, panel, and connector;
full-bleed style shows the cluster over negative space with the photo's focal subject fully
visible; interface-asset style shows the full interface wireframe on the gradient root with
the imagery already filling its hero/media slot and the floating
fragment(s) overlapping the wireframe's edge; floating-card style shows the single dominant
image card with its 2-3 intersecting elements already settled; product-pop-out shows the
interface fully laid out with the character's head already clear of its top edge; device-mockup
shows the device fully rendered with its screen content composed and (if supplied) the
character already integrated in front of it.
