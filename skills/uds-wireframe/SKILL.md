---
name: uds-wireframe
description: >
  Low-fidelity direction (the default): a demonstration wireframe that shows the key feature
  from the brief — one product frame, skeleton structure around ONE real feature, a floating
  highlight / prompt / connector, and motion. Small canvases (both sides ≤ 512px) use the
  small-format layouts (cropped frame bleeding off-canvas, or icon story). Inlined by agent-svc
  together with uds-ui-core; never together with uds-interface.
---

# UDS Wireframe (low fidelity)

Show the FEATURE, not the product. One frame, one real feature, everything else placeholder.
Kit components for every element the kit covers; text fields are drawn (see "# UDS kit").
Spacing uses `var(--space-N)` tokens.

| Rule file | Covers |
|---|---|
| `shared/demonstration-frame.md` | One frame, skeleton around one real feature, ≤ ~8 real kit elements, drawn hero prompt |
| `shared/placeholder-bars.md` | Placeholder bars for non-feature content |
| `shared/floating-card.md` | Floating highlight anatomy and panel chrome |
| `shared/constrained-viewport.md` | Cropping: bottom bleed, zoom-to-highlight, square, counterbalance |
| `shared/connector-line.md` | Pop-out with an axis-aligned connector |
| `ionos/feature-pop-out.md` | INPUT pops out from OUTPUT |
| `ionos/ai-animations.md`, `ionos/micro-animations.md` | AI moments and micro-motion |
| `ionos/small-format.md` | Small canvases (both sides ≤ 512px): crop, not shrink |
| `ionos/decorative-mode.md` + decorative primitives | Decorative mode (not reachable today) |

When `dimensions.w <= 512 AND dimensions.h <= 512` and no `Composition pattern:` is set,
default to `small-cropped-frame` for product briefs and `small-icon-story` for abstract briefs.
