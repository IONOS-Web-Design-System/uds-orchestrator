# Text Placeholder Bars

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
| Eyebrow label | `<Bar w="80px" h={7} op={0.18} />` | Fixed pixel width |
| Subheadline | `<Bar w="42%" h={11} op={0.22} />` | |
| Body paragraph | `<BarGroup lines={3} />` | 3-line block |
| Card subtitle | `<Bar w="65%" h={9} op={0.18} />` | |
| Nav item | `<Bar w="52px" h={8} op={0.20} />` | In a flex row of 4–5 |
| Table cell | `<Bar w="75%" h={8} op={0.16} />` | |
| Tag / badge, status chip | `<KitBadge label={…} />` / `<KitPill label={…} />` | A kit element with a 1–2 word label, not a bar |

**Rule:** Never use free-standing real text in decorative mode. Even one-word labels must be bars. Two exceptions: kit elements (a `KitButton` CTA, a `KitPill` chip, a `KitBadge` tag) carry their own short real label, and a proper brand name that must be visually recognisable — in that case use real text with `var(--text-base-invert)` (see the brand's decorative rule, e.g. `ionos/decorative-mode.md` "Brand Logos", for which name to use).

**Buttons are not placeholders.** A CTA is a kit button with a short real label; the kit draws
its fill, radius and label colour from the brand tokens:
```tsx
import { KitButton } from './kit';

<KitButton label={texts.cta ?? ''} />
```

**Navigation bar placeholder** — the CTA is a kit button with a short real label (never a drawn rect):
```tsx
import { KitButton } from './kit';

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
  <KitButton label={texts.cta ?? ''} size="small" />
</nav>
```
