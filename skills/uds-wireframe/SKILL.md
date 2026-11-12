---
name: uds-wireframe
description: >
  Low-fidelity direction (the default): a demonstration wireframe that shows the key feature
  from the brief — one product frame, skeleton structure around ONE real feature, a floating
  highlight / prompt / connector, and motion. Small canvases (both sides ≤ 512px) draw a
  highlight moment (shared/small-format.md). Inlined by agent-svc together with uds-ui-core;
  never together with uds-interface.
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
| `shared/motion-choreography.md` | Every animation: the beats, one timing vocabulary, the pattern menu, export-safe motion |
| `ionos/ai-animations.md` | IONOS AI moments |
| `shared/small-format.md` | Small canvases (both sides ≤ 512px): the highlight moment — one central object, scattered satellites, one glowing highlight, colours from tokens |
| `ionos/decorative-mode.md` + decorative primitives | Decorative mode (not reachable today) |

When `dimensions.w <= 512 AND dimensions.h <= 512` and no `Composition pattern:` is set,
default to `small-highlight-moment` for every small illustration, product or abstract.
