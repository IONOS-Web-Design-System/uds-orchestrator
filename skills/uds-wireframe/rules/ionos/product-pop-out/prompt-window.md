---
styles: [product-pop-out]
---

## Style: product-pop-out — IONOS values for the designed prompt window

**These values now live in code**, in
`uds-wireframe/templates/product-pop-out/promptWindow.brands.ts`, and the window itself is
`templates/product-pop-out/PromptWindow.tsx`. When the MUST-contract tells you to import
the template you need none of them — the component applies them. See
`shared/product-pop-out/highlight-and-ai.md` §4(b).

They are repeated here ONLY for the fallback path, where you build the window by hand.
Hardcode the hex values; CSS custom properties do not reliably resolve in a Remotion render.

| Role | `prompt-simple` | `prompt-full` |
|---|---|---|
| surface | `rgba(255,255,255,0.88)`, `backdropFilter:'blur(14px)'` | `rgba(255,255,255,0.88)`, `backdropFilter:'blur(14px)'` |
| text | `Open Sans` 400 | `Overpass` 400 |
| text colour | `#001B41` | `#001B41` |
| shadow | `0 8px 24px rgba(0,27,65,0.10)` | same |

**Both surfaces are real glass** — a translucent nearly-white `rgba(255,255,255,0.88)` backdrop
with a `blur(14px)` that actually takes effect, per the designer's instruction. `0.88` is this
codebase's established glass alpha (`shared/floating-card.md`'s "0.88 + backdrop-blur glass",
carved out for this component specifically — see that file's exception). `prompt-full` used to
be opaque (`#FFFFFF`, briefly `#F5F5F5` before that) with NO blur at all; it now shares the same
alpha and blur as `prompt-simple` so the bar and the card read as one material. Do **not** add a
`-webkit-backdrop-filter` fallback — verified in the Chromium generation Remotion uses,
`backdropFilter` is supported unprefixed and the `-webkit-` prefix is not recognised, so it would
be dead code. Hardcode the value — but if you change it, change the ring button's `padding-box`
layer below with it, or the ring's centre stops matching the card.

**The AI gradient is `linear-gradient(45deg, #095BB1, #D746F5)`** — static, never animated
or interpolated. This file previously said `135deg`, which contradicted
`uds-style-guide/rules/ionos-ai-features.md` ("always use a static `45deg` angle"). `45deg`
is correct: it is what the delivered pixels actually show, confirmed by sampling the send
button in production run `2ded5927` (blue strongest at the bottom-left, magenta at the
top-right).

Send button (both variants): the CIRCLE carries the gradient; its GLYPH is flat `#FFFFFF`.
A gradient glyph on a gradient fill is invisible, and send is an affordance, not an AI
marker — see `ionos/product-frame-color.md` "AI Icon Usage Guidelines".

`prompt-full`'s two outlined round buttons: transparent centre with a gradient ring, glyph
`#001B41`:

```jsx
border:'1.5px solid transparent',
background:'linear-gradient(rgba(255,255,255,0.88),rgba(255,255,255,0.88)) padding-box,'
  + ' linear-gradient(45deg,#095BB1,#D746F5) border-box',
```

The padding-box layer intentionally reuses the card's own translucent surface rather than an
opaque near-white: it keeps the ring's centre from ever drifting off the card's material, at the
cost of a ~1.6% effective-alpha mismatch at the ring's centre (two 0.88-alpha layers compositing
lands at ~0.9856) — judged imperceptible, and preferable to the visible hard-edged seam an opaque
centre would paint against a translucent card.

The faces differ by variant because the design source does: `prompt-simple` is UI text
(Open Sans), `prompt-full` reads as a prompt statement (Overpass). Keep them as measured.
