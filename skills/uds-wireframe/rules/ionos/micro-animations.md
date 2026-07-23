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

## Pattern 1 — Multiple Floating Elements

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
        <Icon group="system" name="bell" size={14} style={{ color: '#11C7E6' }} />
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
        <Icon group="system" name="check-circle" size={16} style={{ color: '#12CF76' }} />
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

Simulates a highlighted card interaction. Use on any card that should draw the viewer's attention — pairs naturally with floating elements.

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

// Apply to the card element — use animationDelay to stagger when the highlight begins:
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

> "The analytics card highlights, and a result appears."

Then use exactly the animations that illustrate that story — card highlight, bar grow on the result. Nothing more.

**Size-based animation budget:**
| Size | Floaters | Interaction animations |
|------|----------|----------------------|
| Large (750px) | 3–4 | cascade + card highlight + bar-grow |
| Medium (500px) | 1–2 | cascade + card highlight |
| Small (250px) | 1 (pill only) | float bob only |

- Card highlight cycles: 3.5–5s loop; fly-ins: 400–600ms
- Total composition loop should feel natural at 5–8 seconds
- Animate only the elements that serve the narrative — never background or unrelated elements
- Float bobs must all have different delays and loop durations (3.5–5.5s) so they drift out of sync
