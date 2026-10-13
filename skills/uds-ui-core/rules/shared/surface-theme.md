# Interface surface theme (all brands)

The **base surface theme** of any rendered interface (a composite's product interface, a
screen-content bare interface, or a wireframe) is determined by `colorScheme` — NOT by the
model's aesthetic choice. This is a form decision the design system owns, not the composition.

- **Bind base surfaces to `colorScheme` tokens.** The root, panels, cards, rows, and text
  MUST use the UDS surface/text tokens that the composition's `data-color-scheme` wrapper
  resolves — `var(--surface-base)`, `var(--surface-subtle)`,
  `var(--surface-subtlest)` (canvas only — see "Canvas vs interface base" below),
  `var(--text-base)`, `var(--text-subtle)`, etc. Because the wrapper carries
  `data-color-scheme={colorScheme}`, these resolve to the correct light/dark values
  automatically.
- **Never hardcode a panel/root background to theme the interface.** Do NOT paint the
  interface base with a literal color or gradient (e.g. a hardcoded dark-navy hex, or a
  `linear-gradient` between two hardcoded hex stops — see the brand's color rule, e.g.
  `ionos/product-frame-color.md`, for the concrete dark-shell values) to make it look
  "premium" or "dark". That overrides `colorScheme` and makes the theme random across runs.
- **Light is the default.** `colorScheme` defaults to `light` → a light interface base.
  Render a **dark** interface base ONLY when `colorScheme === 'dark'`, OR when the brief
  explicitly asks for a dark / decorative / cinematic look (decorative mode — defined by
  the direction skill, when it has one). A generic "hero"/"premium"/AI brief is NOT a dark
  request.
- **AI accents are independent of the base theme.** The brand AI gradient on AI CTAs /
  badges / prompt bubbles, the sparkle mark, and the `ai-subtle` 'thinking' surface still apply for a genuine
  AI affordance per `ionos-ai-features`, on light OR dark bases. The `colorScheme`-binding
  rules at the top of this file govern the *interface chrome*, not these AI accents.
- **Match the brandmark to the scheme.** Use the light-scheme brandmark on a light base and
  the dark-scheme brandmark (e.g. `ionos-dark`) only on a dark base — pick it from
  `colorScheme`, not a fixed choice.

## Canvas vs interface base — two different surfaces

Everything above governs the **interface base** — the product frame and its chrome. The
**canvas** (the asset background *outside* the interface) is a separate surface with its own
rule:

- **The canvas belongs to the brand.** With no brand canvas rule it is TRANSPARENT: the
  interface and its floating elements are the asset, and nothing is painted behind them.
  A brand that paints its canvas says so in its own rule — IONOS:
  `ionos/product-frame-color.md`; STRATO: `strato/visual-language.md`. Never carry one
  brand's canvas (e.g. the IONOS light-blue `surface-subtlest` or its blue gradient) to another
  brand.
- When this render's non-negotiables carry a `CANVAS BACKGROUND:` line, that line wins for the
  canvas — and ONLY for the canvas (it carries the render-ready literal with hex fallbacks).
  It is the one sanctioned gradient for the **canvas layer**; a dark-shell gradient on the
  interface (the brand rule's dark variant) is a separate chrome-layer treatment. Neither
  licenses a gradient on a light-scheme panel, card or frame fill.
- A brand-gradient canvas is exempt from "light is the default" — it renders on light AND dark
  `colorScheme`. The interface chrome inside it still follows `colorScheme` exactly as above.
- **Reserve `surface-subtlest` for the canvas.** It must NOT be used as an interface chrome
  surface (frame, sidebar, panel, card, row) — the chrome tiers live in
  `ionos/product-frame-color.md`.
