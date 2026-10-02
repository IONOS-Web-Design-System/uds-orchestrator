---
motion: [animation]
---

# Wireframe Interaction Animations

> **Scope: decorative mode wireframes only.** Standard wireframes do not include animations. If the user requests a standard (mid-fi) wireframe, skip this file entirely.

The purpose of animations in decorative mode is to **simulate real UI interactions** — showing a viewer exactly how the interface behaves. Cards lifting and responding to highlighted actions, bars appearing as if content is being generated, elements revealing in sequence: these make the illustration feel like a live screen recording rather than a static picture.

---

## Choosing the Right Animation

| What to show | Animation to use |
|---|---|
| "User interacts with a card/button" | Card press / highlight cycle |
| "Content appears / AI generates" | Bar grow (typing) |
| "New notification arrives" | Fly-in for pop-out element |
| "This element is prominent" | Float / bob for pop-out card |
| "Complex multi-step interaction" | Remotion |
| "Video/GIF export" | Remotion |

Pick at most **2 active animation sequences** per composition. More than that creates visual noise that dilutes the narrative.

> **Float/bob applies to non-text layers only.** Text-stability (never animate a transform on
> text-bearing layers; avoid shimmer/sub-pixel drift): see remotion-best-practices
> `shared-motion-text.md` (always in effect).

---

## Frame-driven only

Every pattern below is driven by `useCurrentFrame()`: a CSS `@keyframes` / `animation` /
`transition` never runs in a render and fails the eslint gate. Shared helpers:

```tsx
import { Easing, interpolate, useCurrentFrame } from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
// 0 → 1 once, over `dur` frames from `start`, then holds at exactly 1
const enter = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
```

---

## Pattern 1 — Multiple Floating Elements

For **large illustrations**, deploy 3–4 floating elements at different positions around the device frame. Each floater has a unique position, delay and bob period so they move out of sync — this creates a lively, orbital feel.

Interface floaters (a notification chip, an icon action, an avatar) are kit components; the
floater `div` only positions and animates them. Glass stat cards with icon blocks and bars stay
hand-built decoration. **Only non-text floaters bob**: a floater holding a kit label
(`KitPill`, `KitBadge`, a labelled `KitButton`, `KitAvatar` initials) enters once on the clamped
curve and then holds still — see the text-stability note above.

```tsx
import bell from '@ionos-web-design-system/icon/system/bell';
import checkmark from '@ionos-web-design-system/icon/system/circle-checkmark';
import { svgData as performanceSvg } from '@ionos-web-design-system/icon/system/performance';
import { KitAvatar, KitIconButton, KitPill } from './kit';

// Inside the component; delays are in frames, each bob has its own period and height
const frame = useCurrentFrame();
const fly = (start: number) => {
  const p = enter(frame, start);
  return { opacity: p, transform: `translate(${(1 - p) * 32}px, ${(1 - p) * -16}px) scale(${0.94 + 0.06 * p})` };
};
const bob = (period: number, h: number) => `translateY(${Math.sin(frame / period) * h}px)`;

{/* 0 — top-right stat card (most prominent): glass decoration, no text — bobs */}
<div style={{ position: 'absolute', top: -28, right: -52, zIndex: 11, ...fly(0) }}>
  <div style={{ ...glassCardElevated, transform: `${bob(17, 10)} rotate(2.5deg)` }}>
    <IconBlock icon={performanceSvg} colorKey="green" size={18} containerSize={34} />
    <div style={{ marginTop: 10 }}>
      <Bar w="85%" h={10} op={0.32} />
      <Bar w="55%" h={7} op={0.20} style={{ marginTop: 6 }} />
    </div>
  </div>
</div>
{/* 1 — bottom-left notification chip: kit label — enters once, never bobs */}
<div style={{ position: 'absolute', bottom: 72, left: -36, zIndex: 11, display: 'flex', alignItems: 'center', gap: 8, ...fly(39) }}>
  <KitIconButton icon={bell} title={texts.notificationAction ?? ''} size="small" />
  <KitPill label={texts.notification ?? ''} variant="neutral" />
</div>
{/* 2 — mid-right icon action (large only): no text — bobs */}
<div style={{ position: 'absolute', top: '42%', right: -44, zIndex: 10, ...fly(21) }}>
  <div style={{ transform: bob(21, 8) }}>
    <KitIconButton icon={checkmark} title={texts.confirmAction ?? ''} />
  </div>
</div>
{/* 3 — bottom avatar (large only): initials are text — enters once, never bobs */}
<div style={{ position: 'absolute', bottom: -16, right: 120, zIndex: 10, ...fly(60) }}>
  <KitAvatar initials={texts.initials ?? ''} size="small" />
</div>
```

For **medium illustrations**, use only floaters 0 and 1. For **small**, use one compact kit element: a KitIconButton (may bob) or a KitPill (enters once, then still).

---

## Pattern 2 — Card Press / Highlight

Simulates a highlighted card interaction. Use on any card that should draw the viewer's attention — pairs naturally with floating elements. One press cycle, then the card rests:

```tsx
// lift 0 → 1 → 0 over frames 36–141 (a 3.5 s cycle at 30 fps)
const lift = interpolate(frame, [36, 88, 141], [0, 1, 0], clamp);

<div style={{
  ...glassCard,
  transform: `translateY(${-5 * lift}px) scale(${1 + 0.005 * lift})`,
  boxShadow: `0 ${4 + 16 * lift}px ${16 + 32 * lift}px rgba(0,0,0,${0.2 + 0.25 * lift})`,
  borderColor: `rgba(17,199,230,${0.1 + 0.3 * lift})`,
}}>
  {/* card content — keep it static text; the card settles at lift = 0 */}
</div>
```

A card holding readable text must not press in a loop: run the cycle once and let it settle.

---

## Pattern 3 — Bar Grow / Typing

Bars appearing progressively — suggests content being generated (AI output), a form being filled, or a search returning results.

```tsx
const BARS = [
  { h: 14, w: 62, op: 0.25, start: 0 },
  { h: 9, w: 48, op: 0.20, start: 20 },
  { h: 9, w: 72, op: 0.14, start: 37 },
];

<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  {BARS.map((b, i) => {
    const g = interpolate(frame, [b.start, b.start + 72], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return <div key={i} style={{ height: b.h, borderRadius: b.h / 2, background: `rgba(255,255,255,${b.op})`, width: `${b.w * g}%`, opacity: g > 0 ? 1 : 0 }} />;
  })}
</div>
```

---

## Pattern 4 — Float / Gentle Bob

For pop-out floating elements with no readable text (glass cards of bars, icons) that should feel alive. Give each one its own period and tilt:

```tsx
<div style={{
  ...glassCardElevated,
  position: 'absolute', top: -24, right: -36, zIndex: 10,
  transform: `translateY(${Math.sin(frame / 19) * 8}px) rotate(2.5deg)`,
}}>
  {/* non-text content only */}
</div>
```

---

## Pattern 5 — Element Fly-In

Shows elements "arriving" — a notification appearing, an AI result completing, a panel sliding into position. It runs once and holds, so it is safe for text-bearing elements:

```tsx
// `fly` from Pattern 1: opacity + translate/scale on the clamped `enter` curve
<div style={fly(0)}>{/* element */}</div>
<div style={fly(24)}>{/* staggered second element */}</div>
```

---

## When to Use Remotion Instead

If the user wants any of the following, invoke the `remotion-best-practices` skill before writing animation code:

- A sequence where element A animates, then B follows with precise timing (> 3 beats)
- An animation that tells a full story (product demo walkthrough, onboarding tour)
- Video/GIF export needed
- Complex choreography with 20+ animated elements

**Handoff:** invoke `remotion-best-practices` and sequence the beats with `<Sequence>` inside the Remotion `<Composition>`.

---

## Narrative Restraint

Before adding any animation, identify the **one thing** you want the viewer to understand:

> "The analytics card highlights, and a result appears."

Then use exactly the animations that illustrate that story — card highlight, bar grow on the result. Nothing more.

**Size-based animation budget:**
| Size | Floaters | Interaction animations |
|------|----------|----------------------|
| Large (750px) | 3–4 | cascade + card highlight + bar-grow |
| Medium (500px) | 1–2 | cascade + card highlight |
| Small (250px) | 1 — one compact kit element: a KitIconButton (may bob) or a KitPill (enters once, then still) | bob the KitIconButton, or fly the KitPill in once |

- Card highlight cycle: 3.5–5s; fly-ins: 12–18 frames
- Total composition loop should feel natural at 5–8 seconds
- Animate only the elements that serve the narrative — never background or unrelated elements
- Float bobs must all have different delays and periods so they drift out of sync
