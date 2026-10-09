# Text Placeholder Bars

In a demonstration wireframe, the content around the one real feature is replaced by visual bars — rounded rectangles that suggest text height, width, and opacity hierarchy. Bars follow the shell's `colorScheme`: `var(--text-subtle)` on the default LIGHT shell (as `shared/frame-anatomy.md` says), white only on a DARK shell — white bars on a light frame are invisible. Define these two helpers near the top of the `.tsx` file (pass `colorScheme` on a dark shell):

```tsx
// Single placeholder bar
const Bar = ({ w = '60%', h = 12, op = 0.25, colorScheme = 'light' }: { w?: string; h?: number; op?: number; colorScheme?: string }) => (
  <div style={{
    width: w, height: h,
    borderRadius: h / 2,
    background: colorScheme === 'dark' ? `rgba(255, 255, 255, ${op})` : 'var(--text-subtle)',
    opacity: colorScheme === 'dark' ? 1 : op,
    flexShrink: 0,
  }} />
);

// Multi-line paragraph block (3 progressively shorter bars)
const BarGroup = ({ lines = 3, op = 0.14, colorScheme = 'light' }: { lines?: number; op?: number; colorScheme?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    {[100, 92, 68].slice(0, lines).map((pct, i) => (
      <Bar key={i} w={`${pct}%`} h={8} op={op} colorScheme={colorScheme} />
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
| Nav item | `<Bar w="52px" h={8} op={0.20} />` | Tiny frame only; else a real label |
| Table cell | `<Bar w="75%" h={8} op={0.16} />` | |
| Tag / badge, status chip | `<KitBadge label={…} />` / `<KitPill label={…} />` | A kit element with a 1–2 word label, not a bar |

**Rule:** Placeholder bars stand in for all non-feature content in a demonstration wireframe; do not use free-standing real text for it, and even one-word labels there must be bars. Real text is for the one real feature, the navigation labels (3–4 short real labels, or bars when the frame is tiny, per `demonstration-frame.md`) and the featured prompt. Two further exceptions: kit elements (a `KitButton` CTA, a `KitPill` chip, a `KitBadge` tag) carry their own short real label, and a proper brand name that must be visually recognisable — real text in `var(--text-base)`, or `var(--text-base-invert)` on a dark shell only (see the brand's decorative rule, e.g. `ionos/decorative-mode.md` "Brand Logos", for which name to use).

**Buttons are not placeholders.** A CTA is a `KitButton` with a short real label (never a drawn rect); the kit draws its fill, radius and label colour from the brand tokens.

**Navigation bar placeholder:**
```tsx
import { KitButton, KitText } from './kit';

<nav style={{
  display: 'flex', alignItems: 'center', gap: 32,
  padding: '0 48px', height: 64,
  borderBottom: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--border-base)'}`,
}}>
  <Bar w="80px" h={14} op={0.55} colorScheme={colorScheme} />
  <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
    {[texts.nav1, texts.nav2, texts.nav3].map((l, i) => <KitText key={i} variant="bodySm" tone="subtle">{l ?? ''}</KitText>)}
  </div>
  <KitButton label={texts.cta ?? ''} size="small" />
</nav>
```
