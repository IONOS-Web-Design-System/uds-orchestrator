---
name: uds-interface
description: >
  High-fidelity direction: a believable REAL product interface built from understanding the
  brief's context — realistic layout, labels and sample data, real UI interactions. Used when the
  request asks for high fidelity and on every device screen inside a generated photograph.
  Inlined by agent-svc together with uds-ui-core; never together with uds-wireframe.
---

# UDS Interface (high fidelity)

Draw the interface a customer would actually see in the product, mid-task. Kit components for
every element the kit covers; text fields are drawn (see "# UDS kit"). Spacing uses
`var(--space-N)` tokens.

| Rule file | Covers |
|---|---|
| `shared/realistic-content.md` | Labels, data and copy from the brief's context; no demonstration layer |
| `ionos/layout-patterns.md` | Navigation, hero, card grid, form, dashboard patterns |
| `shared/interface-anatomy.md` | Real product-frame content detail; the client-app zone |
| `shared/screen-content.md`, `shared/device-screen.md` | Device screens (bare interface) |
| `shared/interaction-motion.md` | Animation = real UI interaction |
