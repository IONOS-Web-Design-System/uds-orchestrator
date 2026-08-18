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
| surface | `#FFFFFF`, `backdropFilter:'blur(14px)'` | `#F5F5F5` |
| text | `Open Sans` 400 | `Overpass` 400 |
| text colour | `#001B41` | `#001B41` |
| shadow | `0 8px 24px rgba(0,27,65,0.10)` | same |

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
background:'linear-gradient(#F5F5F5,#F5F5F5) padding-box,'
  + ' linear-gradient(45deg,#095BB1,#D746F5) border-box',
```

The faces differ by variant because the design source does: `prompt-simple` is UI text
(Open Sans), `prompt-full` reads as a prompt statement (Overpass). Keep them as measured.
