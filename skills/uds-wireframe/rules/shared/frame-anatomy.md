# Product Frame — Anatomy, Content & Layout Rules

Brand-agnostic geometry for the "one product frame, one floating highlight" composition. The
concrete color values referenced below (surface tokens, named accents like "sky") live in each
brand's own color rule — e.g. `ionos/product-frame-color.md` for IONOS.

## Composition Rule — One Frame, One Highlight

**Every IONOS product animation has exactly two primary elements:**
1. **One main product frame** — the IONOS editor/app UI
2. **One floating highlight card** — the AI feature moment, always a sibling of the frame (never inside it)

Secondary floating elements (tool chips, stat pills) are allowed as decoration but must be less prominent and also live outside the frame.

## Product Frame — Content Detail Rules

Always include these realistic anchors (scale with frame size):
- **Catalog image asset** — pick from available assets via `staticFile()`; place in hero
- **Big hero heading** — 24–40px, real contextual text (brand name, tagline)
- **Product logo** — IONOS logo in shell header; client logo in client-app header
- **Size-dependent detail**:
  - Large frame (>900px wide): left sidebar + hero + content grid + right properties panel
  - Medium (500–900px): left sidebar + hero + 1–2 content rows, no right panel
  - Small (<500px): hero only, minimal nav

Diagram below illustrates the dark shell **variant** (token names shown for orientation — see
the brand's color rule, e.g. `ionos/product-frame-color.md`, for the concrete hex values); the
light **default** renders the identical structure with the colorScheme-resolved tokens
(`var(--surface-base)` frame, `var(--surface-subtle)` sidebar, `var(--surface-subtlest)` panel).

```
┌─ IONOS Product Shell — dark variant (Dark Midnight → Blue Black) ─┐
│ [sidebar: Dark Midnight→Dark Blue]  [CLIENT APP: #F4F7FA]  [panel: Dark Midnight→Dark Blue]│
│  W logo                     ┌─────────────────┐    [#9DC2D9 bars]  │
│  ──────────────             │ [client header]  │    [dropdowns]     │
│  icon  ←white               │ [hero image]     │    [analytics]     │
│  icon                       │ "Brand Heading"  │                    │
│  icon (active strip)        │ [Bar #BCC8D4]    │                    │
│  icon                       │ [Bar #BCC8D4]    │                    │
└──────────────────────────── └─────────────────┘ ───────────────────┘
```

## Contrast Rule (product frame context)

**Light shell default:** shell and client-app zone are both light-toned; differentiate via
elevation (`boxShadow`) and a lighter/whiter surface for the client-app panel, not via opposing
themes.
- Shell icons / text: `var(--text-base)`, 0.8 opacity idle / 1.0 active
- Shell decorative bars: `var(--text-subtle)`
- Client-app text bars: `#BCC8D4` (fixed — the client-app's own light theme)
- Floating pop-out / glass elements: `var(--surface-subtle)` (see `shared/floating-card.md`)

**Dark shell variant (`colorScheme === 'dark'` or decorative — NOT the default):** here, and only
here, the product shell is dark while the client-app zone stays light. Never mix their palettes:
- Shell icons / text: white (`rgba(255,255,255,0.8–1.0)`)
- Shell decorative bars: `#9DC2D9`
- Client-app text bars: `#BCC8D4`
- Floating pop-out / glass elements over dark: `rgba(255,255,255,0.85–0.96)` fill — keep alpha high or the dark shell bleeds through as grey

**Icon colour inside panels**: key on the container's own background, not the outer gradient.
Match the brandmark to the scheme (per `shared/surface-theme.md`): `ionos-light`
(blue fills) on the light shell default and inside the light client-app zone; `ionos-dark`
(white fills) only on the dark shell variant.

## Frame Layout Rules

- Product logo: always the real SVG brandmark, never a placeholder bar — pick the variant per `colorScheme` (`ionos-light` on the light shell default, `ionos-dark` only on the dark shell variant)
- Client app image: always use `<Img src={staticFile(imageSlug + '.png')}>` from the asset catalog
- Never use the sky accent color in the product shell — that is a CTA colour; use `#9DC2D9` for shell decorative elements
- AI feature affordances: see `uds-style-guide/ionos-ai-features` for gradient button, generating surface, and animation rules

## Product Frame — Animated Overflow

The main product frame itself can be animated and **partially moved outside the video canvas** to create a more dynamic, cinematic feel. The `AbsoluteFill` clips at the canvas boundary, so anything translated beyond 0/width/0/height is cropped — use this intentionally.

```tsx
import { useCurrentFrame, interpolate, spring } from 'remotion';

// Frame enters from below/side and settles into position, then drifts slightly off-canvas
const frameY  = interpolate(frame, [0, 20], [80, 0], { extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1) });

// After the hero beat, frame slowly drifts upward — top edge exits canvas
const frameDrift = interpolate(frame, [60, 90], [0, -60], { extrapolateLeft: 'clamp',
                     extrapolateRight: 'clamp' });

<AbsoluteFill style={{ overflow: 'hidden' }}>       {/* canvas clips here */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: `translate(-50%, calc(-50% + ${frameY + frameDrift}px))`,
    width: 1040, height: 640,
    overflow: 'hidden', borderRadius: 12,
  }}>
    {/* product UI — may drift partially outside canvas */}
  </div>
</AbsoluteFill>
```

**Rules for frame overflow animation:**
- Enter from outside then settle — don't start the frame off-canvas if there's no intro motion
- Drift speed should be slow (3–5px/frame max) so it reads as a deliberate cinematic pan, not jitter
- Partial crop is intentional — it signals depth and makes the product feel larger than the canvas
- **Drift the product frame ONLY — never the highlight card.** Sub-pixel drift on a card containing
  readable or typing text re-rasterizes glyphs every frame → typography shimmer/jitter. The product
  frame is image/bar content and tolerates sub-pixel motion; text does not. If frame and card must
  feel connected, drift the frame and keep the card static — the relative motion still reads as depth.
- **Card transforms must fully settle BEFORE typing starts.** Springs asymptote and never reach their
  rest value — snap to exactly `scale(1) translateX(0)` once visually settled (`raw > 0.995 ? 1 : raw`),
  or use `Easing.bezier(0.34, 1.56, 0.64, 1)` with clamp which terminates exactly. Sequence the beats:
  card entrance completes → THEN the typing beat begins. See remotion-best-practices
  "Text rendering stability" for the full rule.
