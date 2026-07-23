---
decorative: true
---

# Text Placeholder Bars (Decorative Mode)

All text in decorative mode is replaced by visual bars — rounded rectangles that suggest text height, width, and opacity hierarchy. Define these two helpers near the top of the `.tsx` file:

```tsx
// Single placeholder bar
const Bar = ({ w = '60%', h = 12, op = 0.25 }: { w?: string; h?: number; op?: number }) => (
  <div style={{
    width: w, height: h,
    borderRadius: h / 2,
    background: `rgba(255, 255, 255, ${op})`,
    flexShrink: 0,
  }} />
);

// Multi-line paragraph block (3 progressively shorter bars)
const BarGroup = ({ lines = 3, op = 0.14 }: { lines?: number; op?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    {[100, 92, 68].slice(0, lines).map((pct, i) => (
      <Bar key={i} w={`${pct}%`} h={8} op={op} />
    ))}
  </div>
);
```

Reference table:

| UI element | Call | Notes |
|-----------|------|-------|
| Page headline | `<Bar w="55%" h={18} op={0.30} />` | Large, bright |
| Section heading | `<Bar w="45%" h={14} op={0.25} />` | |
| Eyebrow / pill label | `<Bar w="80px" h={7} op={0.18} />` | Fixed pixel width |
| Subheadline | `<Bar w="42%" h={11} op={0.22} />` | |
| Body paragraph | `<BarGroup lines={3} />` | 3-line block |
| Card subtitle | `<Bar w="65%" h={9} op={0.18} />` | |
| Nav item | `<Bar w="52px" h={8} op={0.20} />` | In a flex row of 4–5 |
| Table cell | `<Bar w="75%" h={8} op={0.16} />` | |
| Tag / badge label | `<Bar w="48px" h={7} op={0.22} />` | |

**Rule:** Never use real text in decorative mode. Even one-word labels must be bars. The only exception: a proper brand name that must be visually recognisable — in that case use real text with `var(--text-base-invert)` (see the brand's decorative rule, e.g. `ionos/decorative-mode.md` "Brand Logos", for which name to use).

**Button placeholder** — the accent fill/border are brand-specific; resolve `ACCENT_SKY` from
the brand's decorative color rule (e.g. `ionos/decorative-mode.md` "Decorative Color Values") —
never hardcode a brand hex in this shared file:
```tsx
<div style={{
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: 40, minWidth: 120, paddingInline: 20, borderRadius: 8,
  background: 'rgba(ACCENT_SKY, 0.18)',
  border: '1px solid rgba(ACCENT_SKY, 0.35)',
}}>
  <Bar w="70px" h={8} op={0.55} />
</div>
```

**Navigation bar placeholder** — the CTA fill/border are the same brand-specific `ACCENT_SKY` as above:
```tsx
<nav style={{
  display: 'flex', alignItems: 'center', gap: 32,
  padding: '0 48px', height: 64,
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}}>
  {/* Logo area */}
  <Bar w="80px" h={14} op={0.55} />
  {/* Nav items */}
  <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
    {[52, 48, 60, 52].map((w, i) => <Bar key={i} w={`${w}px`} h={8} op={0.22} />)}
  </div>
  {/* CTA */}
  <div style={{ height: 36, width: 100, borderRadius: 6, background: 'rgba(ACCENT_SKY, 0.25)', border: '1px solid rgba(ACCENT_SKY, 0.4)' }} />
</nav>
```
