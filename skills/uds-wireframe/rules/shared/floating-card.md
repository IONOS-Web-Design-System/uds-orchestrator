# Floating Highlight Element — Always Outside the Frame, Anchored Bottom-Left

The AI feature highlight is **one contextual highlight element** — not necessarily a full
pill card. Pick whichever form best fits the moment: a **prompt bar**, a **stat callout**, a
**suggestion chip**, or a **generating indicator**. Whatever form it takes, it is a **sibling
of the product frame at the `AbsoluteFill` root**, never a child. This is a hard rule — the
frame has `overflow: 'hidden'` so children cannot escape it.

**Default placement — bottom-left, intersecting the frame edge, popping OUTSIDE to the left.**
Anchor the element so it straddles the frame's bottom-left corner: part of it overlaps the
frame, part of it pops outside to the left (and slightly below the bottom edge). This is the
default for every pattern in this file unless a specific pattern overrides it. **Never place
the highlight element on top of the frame's center** — center placement covers the product UI
that's supposed to stay legible, and it reads as an accidental overlay rather than an
intentional highlight.

**Shape spec — pill/card variant (confirmed from Figma node 64:320):**
This is one valid form. Other contextual forms (prompt bar, stat callout, suggestion chip,
generating indicator) follow the same chrome rules below (see "Panel chrome rules") but can be
smaller, less padded, or shaped differently — e.g. a slim rounded rectangle for a prompt bar,
a compact rounded-square for a stat callout, a small pill for a suggestion chip, a tiny
dot-plus-label for a generating indicator. They do not need the full `borderRadius: 40` pill
treatment.
```tsx
// Floating highlight element — pill-shaped card variant, NO border, plain neutral drop shadow
// (no AI glow — the AI glow is on the CTA button only). For the animated
// entrance (spring fly-in) see the "highlight must" motion notes below.
<div style={{
  position: 'absolute',
  borderRadius: 40,                          // large pill — NOT 16
  background: 'var(--surface-subtle)',  /* opaque surface token; the 0.88 + backdrop-blur glass is ONLY for the AI generation area */
  padding: '28px 24px 20px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.35)', // plain neutral drop shadow — no AI glow on the card
  zIndex: 100,
  // position: sibling of the frame, anchored bottom-left, overlapping its left/bottom edge and popping outside to the left
}}>
  {/* text prompt or AI generation content + CTA button */}
</div>
```

**The highlight must:**
- Enter via animation (fly-in from outside the frame's left edge with spring overshoot)
- Scale ~1.02 at peak to draw the eye
- Pop slightly outside the video canvas edge to the left if needed — the `AbsoluteFill` clips it and that's intentional

**Secondary floating elements (nice-to-have):**
- Tool palettes, stat chips, notification pills — also outside the frame
- Less prominent: smaller, lower opacity, shorter animation
- Stagger their arrival after the main highlight: +10–15 frames delay
- Never let a secondary element drift on top of the frame's center either — the same
  bottom-left-default / not-on-center rule applies

```tsx
<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
  {/* 1 — product frame */}
  <div style={{ width: 1040, height: 620, overflow: 'hidden', borderRadius: 12, position: 'relative' }}>
    {/* product UI — catalog image + hero heading + sidebar + BarGroups */}
  </div>
  {/* 2 — floating highlight element (sibling, NOT child) — default anchor: bottom-left, intersecting the frame edge, popping outside to the left. NOT on top of the frame's center. */}
  <div style={{ position: 'absolute', left: 80, bottom: 100, zIndex: 100,
                borderRadius: 40,
                background: 'var(--surface-subtle)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
                transform: `translateX(${highlightX}px) scale(${highlightScale})` }}>
    {/* AI content + CTA — or a prompt bar / stat callout / suggestion chip / generating indicator */}
  </div>
  {/* 3 — optional secondary element (tool palette, pill) */}
  <div style={{ position: 'absolute', bottom: 40, left: 220, zIndex: 90, opacity: 0.7 }}>
    {/* smaller, less prominent */}
  </div>
</AbsoluteFill>
```

**Motion — vivid, spring-like:**
- Fly in from the frame's left edge with overshoot + scale ~0.85→1 (bold travel: 60–120px)
- Add parallax: pop-out travels more than the frame

**Pacing — short compositions (~90 frames / 3s):**
- Pick ONE hero beat; give it a ≥20-frame eased entrance then HOLD
- Don't cram 4–5 micro-beats — it reads too fast
- Prefer soft springs (`damping: 18–22`) over snappy ones (`damping: 10–12`)

## Panel chrome rules (applies to ALL patterns in this file)

These rules govern the visual treatment of ALL floating cards, prompt bubbles, mini-toolbars,
and highlight elements in every pattern above. This file is the single canonical source for
this chrome — brand-specific animation and hybrid-image rules point back here rather than
restating it, so pure-illustration jobs always have it too.

**No AI glow on panel/card chrome.** The only AI glow in any composition is on the CTA
button (or equivalent primary action) inside the highlight element — the `linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))`
fill plus a matching tinted `boxShadow: '0 4px 16px color-mix(in srgb, var(--color-ai-primary-start) 30%, transparent), 0 2px 10px color-mix(in srgb, var(--color-ai-primary-end) 18%, transparent)'`
on the button — both derived from the same brand-agnostic AI-gradient tokens (the brand's
concrete gradient-stop hex values live in e.g. `ionos/product-frame-color.md` "AI Icon Usage
Guidelines"; never hardcode them in this shared file). The outer chrome (`boxShadow` on
any card wrapper — pill, prompt bar, stat callout, suggestion chip, generating indicator,
whatever the `borderRadius: 40` pill variant or another contextual form uses) is
always a **plain neutral drop shadow** (`0 16px 48px rgba(0,0,0,0.35)`). Never a colored,
gradient, or AI-tinted outer shadow on the wrapper.

**No dashed borders on panels.** Dashed borders (`border: 2px dashed ...`) are reserved
exclusively for the **selection marquee** inside the product frame's client-app zone —
the design-tool affordance that marks the content being acted on. Panel chrome, prompt
bubbles, mini-toolbars, stat chips, and the Floating Highlight element's wrapper are always
borderless. This style was retired; applying it to panels is wrong.

**Surface vs. glass — HARD RULE.** The highlight element's background is the **opaque
surface token** (`var(--surface-subtle)`) — the element is solid, not glass; there is no
`backdropFilter` on the element itself. The translucent glass + `backdropFilter` treatment
belongs to a separate composition element (the AI generation area used in
text/image-generation moments), never to this highlight element.

**Never nest a generation-area container inside this element.** Nesting a glass generation-area
container (its own background + blur) inside the Floating Highlight element produces a white
box-in-box with a double shadow. The element IS the surface — place its header, text/content,
and CTA (or equivalent) directly as children, with no inner background container.
