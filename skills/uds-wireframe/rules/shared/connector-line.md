# Pattern 7 — Connector Line (pure illustration)

**When:** `Composition pattern: product-frame-connector-line` — the brief asks to "point
to" or "highlight a specific named feature inside the app." The full product frame is
visible (no zoom/crop); the AI highlight card sits outside the frame; an axis-aligned
connector line links the card's edge to the feature point inside the frame.

**This pattern is for pure illustration only.** It does NOT require a generated background
image. For the hybrid equivalent (connector from a floating panel to a headline in a photo),
see `ionos/image-backdrop.md` "Style: image-backdrop with feature pointer."

## DOM structure

`ACCENT` below is the brand's AI-selection accent — the same color used for the
text-selection marquee inside the client-app zone. There is no dedicated CSS token for this
accent; resolve the concrete value from the brand's color rule (e.g. `ionos/product-frame-color.md`
"AI selection target inside client app") — never hardcode a brand hex in this shared file.

```tsx
<AbsoluteFill style={{ overflow: 'hidden' }}>
  {/* 1 — product frame (full size, no crop) */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 860, height: 560,   // fits within canvas with margin
    overflow: 'hidden', borderRadius: 12,
  }}>
    {/* product UI — sidebar + client-app zone with a MARKED target point */}
    {/* Mark the connector anchor: a small colored dot or selection indicator
        at the feature's location (e.g. a specific row, button, or region).
        This anchor must be positioned absolutely so its coordinates are known. */}
  </div>

  {/* 2 — axis-aligned connector line (TWO divs: horizontal + optional vertical L-elbow) */}
  {/* A diagonal/slanted line is FORBIDDEN — use only horizontal or vertical segments. */}
  {/* Plan layout so the card anchor and the frame feature share the same Y (horizontal
      run) or the same X (vertical run). */}
  <div style={{
    position: 'absolute',
    top: ANCHOR_Y - 1,          // same Y as the card anchor point
    left: FRAME_FEATURE_X,      // starts at the feature point inside the frame
    width: CARD_LEFT_EDGE - FRAME_FEATURE_X,
    height: 2,
    background: ACCENT,         // same accent as the selection marquee
  }} />
  {/* Dot endpoint at the frame feature */}
  <div style={{
    position: 'absolute',
    left: FRAME_FEATURE_X - 5, top: ANCHOR_Y - 5,
    width: 10, height: 10, borderRadius: '50%', background: ACCENT,
  }} />

  {/* 3 — floating highlight card (Floating Highlight Card anatomy — see panel chrome rules below) */}
  <div style={{
    position: 'absolute',
    left: CARD_LEFT_EDGE,
    top: ANCHOR_Y - cardHeight / 2,
    borderRadius: 40,
    background: 'var(--surface-subtle)',
    padding: '28px 24px 20px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
    zIndex: 100,
  }}>
    {/* AI content + CTA */}
  </div>
</AbsoluteFill>
```

## Layout and positioning rules

- **L-elbow when vertical alignment is impossible.** If the card anchor and the feature
  point cannot share the same Y or X (different rows and different columns), use TWO
  axis-aligned segments meeting at a right-angle corner. Never one diagonal segment.
- **Feature target anchor.** The feature point inside the frame MUST have a clear visual
  indicator in the product UI — a subtle dashed ring, a selection dot (`border: 2px dashed`,
  using the brand's AI-selection accent — see `ionos/product-frame-color.md`), or a
  highlighted row/cell. Without the indicator, the connector ends in empty space and the
  viewer cannot see what it is pointing to.
- **Counterbalance.** Place the card on the OPPOSITE side from where the frame feature
  sits. If the feature is in the right panel, the card floats left — the line crosses
  horizontally, which reads as purposeful.
- **Card must not overlap the indicated feature.** The card's body must not cover the
  target point — leave the target visible so the viewer can follow the line.

## Animation guidance

- Frame is present from frame 0, settled immediately — it is stable context, not the hero.
- Connector line grows from the feature point toward the card (`width: 0 → full` over
  15–20 frames, `easing: linear`).
- Card flies in from outside the canvas edge, arriving as the line finishes growing
  (+5 frame stagger after line completes). Use `AIFloatingHighlight` spring entrance from
  `ionos/ai-animations.md`.
- Feature target indicator: fade in or scale 0.8→1 simultaneously with the line growth.
