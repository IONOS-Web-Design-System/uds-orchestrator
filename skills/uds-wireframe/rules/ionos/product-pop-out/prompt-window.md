---
styles: [product-pop-out]
---

## Style: product-pop-out — IONOS values for the designed prompt window

The window's STRUCTURE (skeleton, ratios, flex alignment) is in
`shared/product-pop-out/highlight-and-ai.md` §4(b). This file supplies only the IONOS values that
file deliberately leaves abstract. Transcribed from the IONOS design source
(`Prompt-simple` 451x72, `Prompt-full` 420.1x163.4).

Hardcode these hex values — CSS custom properties do not reliably resolve in a Remotion render.

| Role | `prompt-simple` | `prompt-full` |
|---|---|---|
| surface | `#FFFFFF`, `backdropFilter:'blur(14px)'` | `#F5F5F5` |
| text | `Open Sans` 400 | `Overpass` 400 |
| text colour | `#001B41` | `#001B41` |
| shadow | `0 8px 24px rgba(0,27,65,0.10)` | same |

Send button (both variants): `background:'linear-gradient(135deg,#095BB1 0%,#D746F5 100%)'`, white
glyph — the resolved `--color-ai-primary-start` / `--color-ai-primary-end` pair.

`prompt-full`'s two outlined buttons: transparent centre with a gradient ring, glyph `#001B41`:

```jsx
border:'1.5px solid transparent',
background:'linear-gradient(#F5F5F5,#F5F5F5) padding-box,'
  + ' linear-gradient(135deg,#095BB1,#D746F5) border-box',
```

The faces differ by variant because the design source does: `prompt-simple` is UI text (Open Sans),
`prompt-full` reads as a prompt statement (Overpass). Keep them as measured.
