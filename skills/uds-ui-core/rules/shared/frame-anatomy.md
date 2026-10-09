# Product Frame — Anatomy & Layout Rules

Brand-agnostic geometry of the product frame: contrast, frame layout, opaque base plate,
animated overflow and same-tier surface separation. The concrete color values referenced below
(surface tokens, named accents like "sky") live in each brand's own color rule — e.g.
`ionos/product-frame-color.md` for IONOS.

**Client-app zone**: the inner panel of the product frame that shows the customer's own
website or app (a real website preview, not tool chrome), nested inside the product shell. It
keeps its own fixed light theme, independent of the shell's `colorScheme`, and must read as a
distinct layer from the shell.

## Contrast Rule (product frame context)

**Light shell default:** shell and client-app zone are both light-toned; differentiate via
elevation (`boxShadow`) and a lighter/whiter surface for the client-app panel, not via opposing
themes.
- Shell icons / text: `var(--text-base)`, 0.8 opacity idle / 1.0 active
- Shell decorative bars (in a demonstration wireframe; a realistic interface shows real labels and values instead): `var(--text-subtle)`
- Client-app text bars (in a demonstration wireframe; a realistic interface shows real labels and values instead): `#BCC8D4` (fixed — the client-app's own light theme)
- Floating pop-out / glass elements: `var(--surface-subtle)` (when the direction skill calls for a floating highlight card, its own rule defines the anatomy)
 (floating elements sit on the CANVAS, so they need the same border/shadow separation as the
 frame — see "Separating same-tier surfaces" below)

**Dark shell variant (`colorScheme === 'dark'` or decorative — NOT the default):** here, and only
here, the product shell is dark while the client-app zone stays light. Never mix their palettes:
- Shell icons / text: white (`rgba(255,255,255,0.8–1.0)`)
- Shell decorative bars: `DARK_SHELL_ACCENT` (see the brand's color rule, e.g.
  `ionos/product-frame-color.md`, for the concrete value)
- Client-app text bars: `#BCC8D4`
- Floating pop-out / glass elements over dark: `rgba(255,255,255,0.85–0.96)` fill — keep alpha high or the dark shell bleeds through as grey

**Icon colour inside panels**: key on the container's own background, not the outer gradient.
Match the brandmark to the scheme (per `shared/surface-theme.md`): the brand's light-scheme
brandmark variant (colored fills, readable on light) on the light shell default and inside the
light client-app zone; the brand's dark-scheme brandmark variant (white/mono fills, readable
on dark) only on the dark shell variant. Resolve the concrete asset name from the brand's
color rule (e.g. `ionos/product-frame-color.md` "Brandmark Import") — never hardcode a
brand-specific asset name in this shared file.

## Frame Layout Rules

- Product logo: always the real SVG brandmark, never a placeholder bar — pick the light-scheme or dark-scheme brandmark variant per `colorScheme` (see the brand's color rule, e.g. `ionos/product-frame-color.md`, for the concrete asset names)
- Client app image: always use `<Img src={staticFile(imageSlug + '.png')}>` from the asset catalog
- Never use the sky accent color in the product shell — that is a CTA colour; use `DARK_SHELL_ACCENT` for shell decorative elements (concrete value in the brand's color rule, e.g. `ionos/product-frame-color.md`)
- AI feature affordances: the AI CTA is `KitButton concept="ai"` and an AI icon action `KitIconButton ai`; see `uds-style-guide/ionos-ai-features` for the generating state and animation rules

## Opaque base plate (transparent-root composite styles)

For `product-pop-out` / `device-mockup` the composition root is TRANSPARENT, so any interface
container without an opaque fill shows straight through. Two hard rules:

- The product frame's OUTER container MUST carry an explicit opaque base fill — the outermost
  `<div>` wrapping the interface gets a hardcoded opaque background beneath everything: use the
  colorScheme-appropriate opaque hex from the brand color rule (e.g. `ionos/product-frame-color.md`
  "Opaque base-plate fallback hex") — never hardcode a brand hex in this shared file.
- Interface surfaces MUST use the token WITH a hardcoded hex fallback, never a bare token:
  `backgroundColor: 'var(--surface-base, #FFFFFF)'` (light) — because CSS custom properties may
  not resolve in a Remotion render, and a bare `var(--surface-base)` then collapses to transparent.
  Use the colorScheme-appropriate fallback hex (see `ionos/product-frame-color.md`).

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

## Separating same-tier surfaces (frame-on-canvas, and chrome-on-chrome)

Adjacent light surfaces do not separate themselves. With only two chrome fill tiers
(`surface-subtle`, `surface-base`) some adjacencies unavoidably share a tier, and the
frame-on-canvas seam is the worst: the shell on the canvas is ~1.117 contrast, and on `dark`
colorScheme `--surface-base` is byte-identical to `--color-gradient-start`, so an unbordered
frame is literally invisible against an AI-showroom dark canvas.

The rule (the "frame-separation rule" referenced from `ionos/product-frame-color.md`): wherever
two surfaces of the same or near-same tier meet — the product frame on the canvas, OR a
`surface-base` card/row sitting on the `surface-base` content plane — separate them with ONE of:

- a 1px border in `var(--border-subtle)`, or
- a soft elevation shadow (e.g. `boxShadow: '0 2px 12px rgba(0,0,0,0.10)'`), or
- both.

Never reach for a third fill tier (and never `surface-subtlest`) to force the separation. This
is a hard requirement for the product frame specifically: a frame distinguished only by its fill
is a defect on every colorScheme.
