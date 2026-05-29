# Wireframe Micro-Animations

Micro-animations make a wireframe feel alive and communicate interaction intent — a button hover, a card entrance, a loading shimmer. They're optional but often worth adding even in low-fidelity illustrations because they dramatically improve stakeholder comprehension.

## When to Use Native CSS vs Remotion

| Animation type | Use |
|----------------|-----|
| Hover states, focus rings | Native CSS / Tailwind |
| Entrance animations (fade in, slide up) | Native CSS with `@keyframes` |
| Loading skeletons / shimmer | Native CSS |
| Staggered list items | CSS `animation-delay` |
| Sequenced multi-element animations | Remotion |
| Timeline-based storytelling | Remotion |
| Video export / presentation needed | Remotion |

The key question: **is this a momentary UI interaction or a choreographed sequence?** Momentary interactions → CSS. Choreographed sequences → Remotion.

---

## Native CSS Patterns

### Hover lift (cards, buttons)

```tsx
<Card
  className="transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg cursor-pointer"
>
  {/* content */}
</Card>
```

### Entrance fade-in (page load)

```tsx
// Add to your component or a global CSS file
const style = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-enter {
    animation: fadeInUp 0.4s ease-out forwards;
  }
`;

// In the component
<>
  <style>{style}</style>
  <section className="animate-enter">
    {/* content */}
  </section>
</>
```

### Staggered card grid

```tsx
const style = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

<>
  <style>{style}</style>
  <div className="grid grid-cols-3 gap-6">
    {items.map((item, i) => (
      <Card
        key={item.title}
        style={{
          animation: 'fadeInUp 0.35s ease-out forwards',
          animationDelay: `${i * 80}ms`,
          opacity: 0,
        }}
      >
        {/* content */}
      </Card>
    ))}
  </div>
</>
```

### Loading shimmer (skeleton state)

```tsx
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .shimmer {
    background: linear-gradient(
      90deg,
      var(--neutral/cool-grey-100) 25%,
      var(--neutral/cool-grey-200) 50%,
      var(--neutral/cool-grey-100) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

<>
  <style>{shimmerStyle}</style>
  <div className="shimmer h-8 w-48 rounded mb-3" />
  <div className="shimmer h-4 w-full rounded mb-2" />
  <div className="shimmer h-4 w-3/4 rounded" />
</>
```

---

## When to Reach for Remotion

If the user wants any of these, invoke the `remotion-best-practices` skill before writing animation code:

- A sequence where element A animates, then element B follows with precise timing
- An animation that tells a story (product demo, feature walkthrough)
- An animation the user wants to export as a video or GIF
- A complex entrance choreography (30+ elements, overlapping timelines)
- Any animation involving video, audio, or captions

**How to hand off:**

Tell the user: "This animation is complex enough that I'd recommend using Remotion for precise timeline control. I'll reference the `remotion-best-practices` skill to generate it properly."

Then invoke the `remotion-best-practices` skill and follow its composition workflow, wrapping the UDS wireframe content in a Remotion `<Composition>`.

---

## Animation Restraint

Just like brand colors, animations communicate something — overusing them dilutes the signal. Apply the same restraint principle from `uds-style-guide`:

- One entrance animation per section, not per element
- Hover animations on interactive elements only (buttons, cards, links)
- Loading states only where data would realistically load
- Duration: 200–400ms for UI interactions, 400–600ms for entrance animations

If in doubt: one subtle fade-in per major section is always better than a page full of flying elements.
