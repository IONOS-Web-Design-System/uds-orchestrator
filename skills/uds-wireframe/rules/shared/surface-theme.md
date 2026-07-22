# Interface surface theme (all brands)

The **base surface theme** of any rendered interface (a composite's product interface, a
screen-content bare interface, or a wireframe) is determined by `colorScheme` — NOT by the
model's aesthetic choice. This is a form decision the design system owns, not the composition.

- **Bind base surfaces to `colorScheme` tokens.** The root, panels, cards, rows, and text
  MUST use the UDS surface/text tokens that the composition's `data-color-scheme` wrapper
  resolves — `var(--surface-base)`, `var(--surface-subtle)`, `var(--surface-subtlest)`,
  `var(--text-base)`, `var(--text-subtle)`, etc. Because the wrapper carries
  `data-color-scheme={colorScheme}`, these resolve to the correct light/dark values
  automatically.
- **Never hardcode a panel/root background to theme the interface.** Do NOT paint the
  interface base with a literal color or gradient (e.g. a dark navy like `#011B43` /
  `linear-gradient(..., #0B2A63)`) to make it look "premium" or "dark". That overrides
  `colorScheme` and makes the theme random across runs.
- **Light is the default.** `colorScheme` defaults to `light` → a light interface base.
  Render a **dark** interface base ONLY when `colorScheme === 'dark'`, OR when the brief
  explicitly asks for a dark / decorative / cinematic look (decorative mode — see
  `ionos/decorative-mode.md`). A generic "hero"/"premium"/AI brief is NOT a dark
  request.
- **AI accents are independent of the base theme.** The brand AI gradient on CTAs / prompt
  bubbles, the sparkle mark, and the `ai-subtle` 'thinking' surface still apply for a genuine
  AI affordance per `ionos-ai-features`, on light OR dark bases. The base surface theme rule
  above governs the *interface chrome*, not these AI accents.
- **Match the brandmark to the scheme.** Use the light-scheme brandmark on a light base and
  the dark-scheme brandmark (e.g. `ionos-dark`) only on a dark base — pick it from
  `colorScheme`, not a fixed choice.
