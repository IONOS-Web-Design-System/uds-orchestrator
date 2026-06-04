# Wireframe Interaction Animations

> **Scope: decorative mode wireframes only.** Standard wireframes do not include animations. If the user requests a standard (mid-fi) wireframe, skip this file entirely.

The purpose of animations in decorative mode is to **simulate real UI interactions** — showing a viewer exactly how the interface behaves. A mouse cursor guiding the eye to a feature, a card lifting as the cursor approaches, bars appearing as if content is being generated: these make the illustration feel like a live screen recording rather than a static picture.

---

## Choosing the Right Animation

| What to show | Animation to use |
|---|---|
| "User clicks this card/button" | Cursor flow + card press |
| "Content appears / AI generates" | Bar grow (typing) |
| "New notification arrives" | Fly-in for pop-out element |
| "This element is prominent" | Float / bob for pop-out card |
| "Complex multi-step interaction" | Remotion |
| "Video/GIF export" | Remotion |

Pick at most **2 active animation sequences** per composition. More than that creates visual noise that dilutes the narrative.

---

## Pattern 1 — Mouse Cursor Flow with Trail

The cursor uses **two layers** — SVG arrow + a dotted trail that lingers along the path. No sky-blue shadow or glow halo. The trail is a series of small semi-transparent dots rendered as absolute-positioned elements that follow past cursor positions, fading out as the cursor moves away. This makes the movement readable without distracting color.

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

// Cursor arrow — drop-shadow only for depth, no colored glow
const CursorArrow = ({ x, y }: { x: number; y: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 50 }}>
    <svg width="18" height="22" viewBox="0 0 18 22" fill="white"
      style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.55))' }}>
      <path d="M0 0 L0 18 L4.5 13.5 L7.5 21 L10 20 L7 12.5 L12.5 12.5 Z" />
    </svg>
  </div>
);

// Trail dot — small circle that fades at an offset behind the cursor
const TrailDot = ({ x, y, opacity }: { x: number; y: number; opacity: number }) => (
  <div style={{
    position: 'absolute', left: x - 3, top: y - 3,
    width: 6, height: 6, borderRadius: '50%',
    background: 'rgba(255,255,255,0.65)',
    opacity, pointerEvents: 'none', zIndex: 49,
  }} />
);

// Usage inside the composition — sample path between two points:
export const CursorWithTrail: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Interpolate cursor position along the path
  const progress = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(progress, [0, 1], [60, 280]);
  const y = interpolate(progress, [0, 1], [300, 152]);

  // Trail dots at delayed positions (simulate past positions)
  const TRAIL_COUNT = 5;
  const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => {
    const trailProgress = interpolate(frame - (i + 1) * 2, [10, 50], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return {
      x: interpolate(trailProgress, [0, 1], [60, 280]),
      y: interpolate(trailProgress, [0, 1], [300, 152]),
      opacity: (1 - i / TRAIL_COUNT) * 0.5,
    };
  });

  return (
    <>
      {trails.map((t, i) => <TrailDot key={i} x={t.x} y={t.y} opacity={t.opacity} />)}
      <CursorArrow x={x} y={y} />
    </>
  );
};
```

**Click indicator** — on click, briefly scale the cursor arrow down (0.88) and back. No ripple ring needed; the trail already provides motion context.

```tsx
const clickScale = interpolate(frame, [clickFrame, clickFrame + 3, clickFrame + 6], [1, 0.88, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
// Apply to the cursor div: transform: `scale(${clickScale})`
```

**Element reactions — synchronized with cursor timing** (keep from original pattern, update colors to neutral):

```tsx
// Card lifts when cursor arrives — no sky-blue tint, use neutral white glass
@keyframes cardReact {
  0%    { transform: translateY(0) scale(1); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  /* cursor hovering */
  34%   { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
  /* click */
  39%   { transform: translateY(-2px) scale(0.99); }
  44%   { transform: translateY(-6px) scale(1.012); box-shadow: 0 20px 48px rgba(0,0,0,0.5); }
  68%   { transform: translateY(0) scale(1); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  100%  { transform: translateY(0) scale(1); }
}
```

Place cursor elements inside the device frame's `position: relative` content area. Coordinates are in pixels from the content area's top-left. Keep the path to 1–2 targets max.

---

## Pattern 1b — Multiple Floating Elements

For **large illustrations**, deploy 3–4 floating elements at different positions around the device frame. Each floater has a unique rotation, bob height, and delay so they move out of sync — this creates a lively, orbital feel.

```tsx
// Float configuration — adjust positions to fit your frame size
const FLOATERS = [
  // Top-right stat card (most prominent)
  {
    style: { top: -28, right: -52, zIndex: 11 } as React.CSSProperties,
    cardStyle: glassCardElevated,
    rot: '2.5deg', delay: '0s', bobH: -10,
    content: (
      <>
        <IconBlock name="trending-up" colorKey="green" size={18} containerSize={34} />
        <div style={{ marginTop: 10 }}>
          <Bar w="85%" h={10} op={0.32} />
          <Bar w="55%" h={7} op={0.20} style={{ marginTop: 6 }} />
        </div>
      </>
    ),
  },
  // Bottom-left notification pill
  {
    style: { bottom: 72, left: -36, zIndex: 11, borderRadius: 999, padding: '10px 16px' } as React.CSSProperties,
    cardStyle: { background: 'rgba(17,199,230,0.10)', border: '1px solid rgba(17,199,230,0.28)', backdropFilter: 'blur(12px)' },
    rot: '-1.5deg', delay: '1.3s', bobH: -6,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon group="system" name="bell" size={14} style={{ color: 'var(--brand/ionos-sky-300)' }} />
        <Bar w="88px" h={7} op={0.50} />
      </div>
    ),
  },
  // Mid-right icon pill (large only)
  {
    style: { top: '42%', right: -44, zIndex: 10 } as React.CSSProperties,
    cardStyle: { background: 'rgba(18,207,118,0.10)', border: '1px solid rgba(18,207,118,0.22)', borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(12px)' },
    rot: '1deg', delay: '0.7s', bobH: -8,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon group="system" name="check-circle" size={16} style={{ color: 'var(--utility/green-300)' }} />
        <Bar w="64px" h={7} op={0.45} />
      </div>
    ),
  },
  // Bottom avatar chip (large only)
  {
    style: { bottom: -16, right: 120, zIndex: 10, borderRadius: 999, padding: '6px 12px' } as React.CSSProperties,
    cardStyle: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' },
    rot: '-2deg', delay: '2.0s', bobH: -5,
    content: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(17,199,230,0.25)', border: '1px solid rgba(17,199,230,0.4)' }} />
        <Bar w="52px" h={7} op={0.35} />
      </div>
    ),
  },
];

// Multi-float keyframes (one per floater, unique bob height)
const multiFloatStyle = `
  @keyframes bob0 { 0%,100% { transform: translateY(0)    rotate(2.5deg); } 50% { transform: translateY(-10px) rotate(2.5deg); } }
  @keyframes bob1 { 0%,100% { transform: translateY(0)    rotate(-1.5deg); } 50% { transform: translateY(-6px)  rotate(-1.5deg); } }
  @keyframes bob2 { 0%,100% { transform: translateY(0)    rotate(1deg); }   50% { transform: translateY(-8px)  rotate(1deg); } }
  @keyframes bob3 { 0%,100% { transform: translateY(0)    rotate(-2deg); }  50% { transform: translateY(-5px)  rotate(-2deg); } }
`;

// Render:
{FLOATERS.map((f, i) => (
  <div key={i} style={{
    position: 'absolute', ...f.style, ...f.cardStyle,
    animation: `bob${i} ${3.5 + i * 0.4}s ease-in-out ${f.delay} infinite`,
  }}>
    {f.content}
  </div>
))}
```

For **medium illustrations**, use only floaters 0 and 1. For **small**, use only floater 0 — but make it a compact pill rather than a full card.

---

## Pattern 2 — Card Press / Highlight

Simulates a user hovering and pressing a card. Use on the card the cursor is pointed at — the two animations work together.

```tsx
const cardInteractiveStyle = `
  @keyframes cardHighlight {
    0%   {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      border-color: rgba(255,255,255,0.10);
    }
    50%  {
      transform: translateY(-5px) scale(1.005);
      box-shadow: 0 20px 48px rgba(0,0,0,0.45);
      border-color: rgba(17,199,230,0.40);
    }
    68%  {
      transform: translateY(-3px) scale(0.998);
      box-shadow: 0 10px 28px rgba(0,0,0,0.35);
    }
    100% {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      border-color: rgba(255,255,255,0.10);
    }
  }
`;

// Apply to the card element — delay so it starts when cursor arrives:
<div style={{
  ...glassCard,
  animation: 'cardHighlight 3.5s ease-in-out infinite',
  animationDelay: '1.2s',
}}>
  {/* card content */}
</div>
```

---

## Pattern 3 — Bar Grow / Typing

Bars appearing progressively — suggests content being generated (AI output), a form being filled, or a search returning results.

```tsx
const barGrowStyle = `
  @keyframes barGrow {
    0%       { width: 0%;  opacity: 0; }
    8%       { opacity: 0.25; }
    100%     { width: 62%; opacity: 0.25; }
  }
  @keyframes barGrow2 {
    0%,  28% { width: 0%;  opacity: 0; }
    36%      { opacity: 0.20; }
    100%     { width: 48%; opacity: 0.20; }
  }
  @keyframes barGrow3 {
    0%,  52% { width: 0%;  opacity: 0; }
    60%      { opacity: 0.14; }
    100%     { width: 72%; opacity: 0.14; }
  }
`;

<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  <div style={{ height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.25)',
    animation: 'barGrow 2.4s ease-out forwards' }} />
  <div style={{ height: 9, borderRadius: 4, background: 'rgba(255,255,255,0.20)',
    animation: 'barGrow2 2.4s ease-out forwards' }} />
  <div style={{ height: 9, borderRadius: 4, background: 'rgba(255,255,255,0.14)',
    animation: 'barGrow3 2.4s ease-out forwards' }} />
</div>
```

---

## Pattern 4 — Float / Gentle Bob

For pop-out floating elements that should feel alive. Use `--rot` CSS variable for a unique tilt per element:

```tsx
const floatStyle = `
  @keyframes floatBob {
    0%,  100% { transform: translateY(0)   rotate(var(--rot, 2deg)); }
    50%        { transform: translateY(-8px) rotate(var(--rot, 2deg)); }
  }
`;

<div style={{
  ...glassCardElevated,
  position: 'absolute', top: -24, right: -36, zIndex: 10,
  animation: 'floatBob 4s ease-in-out infinite',
  '--rot': '2.5deg',
} as React.CSSProperties}>
  {/* content */}
</div>
```

---

## Pattern 5 — Element Fly-In

Shows elements "arriving" — a notification appearing, an AI result completing, a panel sliding into position:

```tsx
const flyInStyle = `
  @keyframes flyIn {
    from { opacity: 0; transform: translate(32px, -16px) scale(0.94); }
    to   { opacity: 1; transform: translate(0, 0) scale(1); }
  }
`;

// Immediate:
<div style={{ animation: 'flyIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
  {/* element */}
</div>

// Staggered second element:
<div style={{ animation: 'flyIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both', opacity: 0 }}>
  {/* element */}
</div>
```

---

## Animation Variants — Always Offer Choice

Every decorative wireframe HTML preview must include a **variant switcher** offering 4 animation approaches. This lets the user evaluate different animation personalities and ask to generate the TSX for the one they prefer.

The TSX itself is generated with **Variant A** by default. Add a comment block at the top listing all variants so the user knows their options.

### The 4 variants

**Variant A — Cursor Journey** *(default)*
Playful cursor navigates the interface with spring-overshoot motion, glow halo, click ripple, and synchronized card reactions. Best for: UX interaction demonstrations, product walkthroughs.

**Variant B — Cascade Reveal**
Sections enter with staggered `flyIn` animations — the window frame appears, then sections reveal top-to-bottom, then floaters arrive last. No cursor. Best for: composition showcase, marketing panels, first impression.

```tsx
const cascadeStyle = `
  @keyframes sectionReveal {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
// Stagger per section:
// Nav: animation-delay: 0ms
// Hero/main: animation-delay: 180ms
// Feature grid cards: animation-delay: 360 + i*100ms
// Floaters: animation-delay: 700 + i*150ms
```

**Variant C — Pulse Radiate**
Key icon containers emit slow expanding ring pulses. No cursor, no movement. The composition is fully static except for subtle breathing rings that radiate outward from 1–2 focal icons. Best for: background decoration, always-on ambient panels, static marketing placements.

```tsx
const pulseStyle = `
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.6; }
    80%  { transform: scale(2.4); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }
`;
// Ring element placed behind the primary icon container:
<div style={{
  position: 'absolute', inset: -8, borderRadius: 'inherit',
  border: '1px solid rgba(17,199,230,0.4)',
  animation: 'pulseRing 2.8s ease-out infinite',
  pointerEvents: 'none',
}} />
// Second ring, delayed:
<div style={{
  position: 'absolute', inset: -8, borderRadius: 'inherit',
  border: '1px solid rgba(17,199,230,0.25)',
  animation: 'pulseRing 2.8s ease-out 1.4s infinite',
  pointerEvents: 'none',
}} />
```

**Variant D — AI Generation**
Content builds progressively — bars grow in as if an AI is rendering the interface in real time. The layout starts empty (all bars at width:0) and fills in across 3–4 seconds, then loops. Best for: AI product demonstrations, generation/completion contexts.

```tsx
const generationStyle = `
  @keyframes barReveal { from { width: 0; opacity: 0; } to { opacity: 1; } }
  /* Each bar gets a unique animationDelay and target width via inline style */
`;
// Each Bar gets: animation: 'barReveal Xs ease-out Ys forwards'
// Where X = 0.8–1.2s (randomize), Y = stagger (0 + i * 0.15s)
// After all bars are revealed, a pause, then reset with animation-iteration-count: infinite
```

---

### HTML preview variant switcher

The HTML preview always includes this variant bar and JavaScript switcher. Place it fixed at the top-left of the page:

```html
<style>
  .variant-bar {
    position: fixed; top: 16px; left: 16px; z-index: 100;
    display: flex; gap: 6px; flex-wrap: wrap;
    background: rgba(20,20,24,0.85); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.10); border-radius: 10px;
    padding: 8px 10px;
  }
  .vbtn {
    padding: 5px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12);
    background: transparent; color: rgba(255,255,255,0.55);
    font: 11px/1.4 'Open Sans', sans-serif; cursor: pointer; transition: all 0.15s;
  }
  .vbtn:hover { border-color: rgba(17,199,230,0.4); color: rgba(255,255,255,0.85); }
  .vbtn.active { background: rgba(17,199,230,0.15); border-color: rgba(17,199,230,0.5); color: rgba(17,199,230,0.95); }

  /* Variant A elements — show only in A */
  .v-cursor { display: none; }
  [data-variant="A"] .v-cursor { display: block; }

  /* Variant B — cascade: paused by default, running in B */
  .v-cascade { animation-play-state: paused !important; opacity: 0; }
  [data-variant="B"] .v-cascade { animation-play-state: running !important; }

  /* Variant C — pulse rings: hidden by default */
  .v-pulse { display: none; }
  [data-variant="C"] .v-pulse { display: block; }

  /* Variant D — bar-reveal: width locked by default */
  .v-generate { animation-play-state: paused !important; width: 0 !important; opacity: 0 !important; }
  [data-variant="D"] .v-generate { animation-play-state: running !important; }

  /* Default (A) — cursor visible, others idle */
  body { /* default = A */ }
</style>

<div class="variant-bar">
  <button class="vbtn active" onclick="setV(this,'A')">A · Cursor</button>
  <button class="vbtn"        onclick="setV(this,'B')">B · Cascade</button>
  <button class="vbtn"        onclick="setV(this,'C')">C · Pulse</button>
  <button class="vbtn"        onclick="setV(this,'D')">D · AI Generate</button>
</div>

<script>
function setV(btn, v) {
  document.querySelectorAll('.vbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.body.dataset.variant = v;
  /* Restart animations on variant change */
  document.querySelectorAll('[class*="v-"]').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth; /* reflow */
    el.style.animation = '';
  });
}
/* Default state */
document.body.dataset.variant = 'A';
</script>
```

Apply the variant class to each animated element in the HTML:
- Cursor group → `class="v-cursor"`
- Sections/cards (cascade) → `class="v-cascade"` + their `animation` property
- Pulse rings → `class="v-pulse"`
- Bar elements in generation mode → `class="v-generate"` + `animation: barReveal ...`

Note: some elements naturally serve multiple variants (e.g. floaters always bob regardless). Only animated-state elements need the variant class.

---

### TSX comment block (top of file)

Always include this at the top of the generated `.tsx`:

```tsx
// Wireframe illustration — not production code
//
// Animation variants — ask to switch:
//   Variant A (current): Cursor Journey — playful cursor navigates cards with hover reactions
//   Variant B: Cascade Reveal — staggered section reveal, no cursor
//   Variant C: Pulse Radiate — subtle icon pulse rings, ambient
//   Variant D: AI Generation — bars build progressively, generation feel
//
// Say "use variant B" (or C, D) to regenerate with a different approach.
```

---

## When to Use Remotion Instead

If the user wants any of the following, invoke the `remotion-best-practices` skill before writing animation code:

- A sequence where element A animates, then B follows with precise timing (> 3 beats)
- An animation that tells a full story (product demo walkthrough, onboarding tour)
- Video/GIF export needed
- Complex choreography with 20+ animated elements

**Handoff:** "This animation needs more precise timeline control than CSS offers. I'll use Remotion." Then invoke `remotion-best-practices` and wrap the UDS wireframe content in a Remotion `<Composition>`.

---

## Narrative Restraint

Before adding any animation, identify the **one thing** you want the viewer to understand:

> "The user clicks the analytics card, and a result appears."

Then use exactly the animations that illustrate that story — cursor flow to the card, card press, bar grow on the result. Nothing more.

**Size-based animation budget:**
| Size | Cursor? | Floaters | Interaction animations |
|------|---------|----------|----------------------|
| Large (750px) | Yes (2 targets) | 3–4 | cursor + card react + bar-grow |
| Medium (500px) | Yes (1–2 targets) | 1–2 | cursor + card react |
| Small (250px) | No (too cramped) | 1 (pill only) | float bob only |

- Cursor path: 5s loop; card reactions: same 5s loop (synced by percentage); fly-ins: 400–600ms
- Total composition loop should feel natural at 5–8 seconds
- Animate only the element the cursor targets — never background or unrelated elements
- Float bobs must all have different delays and loop durations (3.5–5.5s) so they drift out of sync
