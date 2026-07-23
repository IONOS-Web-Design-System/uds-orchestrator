# Floating Highlight Card — Always Outside the Frame

The AI feature highlight is a **sibling of the product frame at the `AbsoluteFill` root**, never a child. This is a hard rule — the frame has `overflow: 'hidden'` so children cannot escape it.

**Shape spec (confirmed from Figma node 64:320):**
```tsx
// Floating highlight card — pill-shaped glass, NO border, plain neutral drop shadow
// (no AI glow — the AI glow is on the CTA button only). For the animated
// pulse see ionos/ai-animations.md (AIFloatingHighlight).
<div style={{
  position: 'absolute',
  borderRadius: 40,                          // large pill — NOT 16
  background: 'var(--surface-subtle)',  /* opaque surface token; the 0.88 + backdrop-blur glass is ONLY for the AI generation area */
  padding: '28px 24px 20px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.35)', // plain neutral drop shadow — no AI glow on the card
  zIndex: 100,
  // position: sibling of the frame, overlapping its right/bottom edge
}}>
  {/* text prompt or AI generation content + CTA button */}
</div>
```

**The highlight must:**
- Enter via animation (fly-in from outside the frame edge with spring overshoot)
- Scale ~1.02 at peak to draw the eye
- Pop slightly outside the video canvas edge if needed — the `AbsoluteFill` clips it and that's intentional

**Secondary floating elements (nice-to-have):**
- Tool palettes, stat chips, notification pills — also outside the frame
- Less prominent: smaller, lower opacity, shorter animation
- Stagger their arrival after the main highlight: +10–15 frames delay

```tsx
<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
  {/* 1 — product frame */}
  <div style={{ width: 1040, height: 620, overflow: 'hidden', borderRadius: 12, position: 'relative' }}>
    {/* product UI — catalog image + hero heading + sidebar + BarGroups */}
  </div>
  {/* 2 — floating highlight card (sibling, NOT child) */}
  <div style={{ position: 'absolute', right: 80, top: 180, zIndex: 100,
                borderRadius: 40,
                background: 'var(--surface-subtle)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
                transform: `translateX(${highlightX}px) scale(${highlightScale})` }}>
    {/* AI content + CTA */}
  </div>
  {/* 3 — optional secondary element (tool palette, pill) */}
  <div style={{ position: 'absolute', bottom: 80, left: 120, zIndex: 90, opacity: 0.7 }}>
    {/* smaller, less prominent */}
  </div>
</AbsoluteFill>
```

**Motion — vivid, spring-like:**
- Fly in from the frame edge with overshoot + scale ~0.85→1 (bold travel: 60–120px)
- Add parallax: pop-out travels more than the frame

**Pacing — short compositions (~90 frames / 3s):**
- Pick ONE hero beat; give it a ≥20-frame eased entrance then HOLD
- Don't cram 4–5 micro-beats — it reads too fast
- Prefer soft springs (`damping: 18–22`) over snappy ones (`damping: 10–12`)

## Panel chrome rules (applies to ALL patterns in this file)

These rules govern the visual treatment of ALL floating cards, prompt bubbles, mini-toolbars,
and highlight elements in every pattern above. They also appear in `ionos/ai-animations.md`
and `ionos/image-backdrop.md`; stated here so pure-illustration jobs always have them.

**No AI glow on panel/card chrome.** The only AI glow in any composition is on the CTA
button inside the card — the `linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))`
fill plus a matching tinted `boxShadow: '0 4px 16px color-mix(in srgb, var(--color-ai-primary-start) 30%, transparent), 0 2px 10px color-mix(in srgb, var(--color-ai-primary-end) 18%, transparent)'`
on the button — both derived from the same brand-agnostic AI-gradient tokens (the brand's
concrete gradient-stop hex values live in e.g. `ionos/product-frame-color.md` "AI Icon Usage
Guidelines"; never hardcode them in this shared file). The card's outer chrome (`boxShadow` on the `borderRadius: 40` wrapper) is
always a **plain neutral drop shadow** (`0 16px 48px rgba(0,0,0,0.35)`). Never a colored,
gradient, or AI-tinted outer shadow on the card.

**No dashed borders on panels.** Dashed borders (`border: 2px dashed ...`) are reserved
exclusively for the **selection marquee** inside the product frame's client-app zone —
the design-tool affordance that marks the content being acted on. Panel chrome, prompt
bubbles, mini-toolbars, stat chips, and the Floating Highlight Card wrapper are always
borderless. This style was retired; applying it to panels is wrong.
