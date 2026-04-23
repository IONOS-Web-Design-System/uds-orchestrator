# Gradient Color Tokens

UDS provides brand-specific gradient color tokens. Gradients adapt automatically
per brand x color-scheme via CSS custom properties — no hardcoded values needed.

---

## Token Reference — Color Stop Variables

These `@theme`-registered tokens are usable as individual Tailwind v4 gradient
stop classes (`from-*`, `via-*`, `to-*`):

| Token (CSS Variable)         | Tailwind `from-*` / `to-*` Class | Purpose                   |
| ---------------------------- | -------------------------------- | ------------------------- |
| `--color-ai-primary-start`   | `from-ai-primary-start`          | AI primary gradient start |
| `--color-ai-primary-end`     | `to-ai-primary-end`              | AI primary gradient end   |
| `--color-ai-secondary-start` | `from-ai-secondary-start`        | AI secondary start        |
| `--color-ai-secondary-end`   | `to-ai-secondary-end`            | AI secondary end          |
| `--color-ai-tertiary-start`  | `from-ai-tertiary-start`         | AI tertiary start         |
| `--color-ai-tertiary-end`    | `to-ai-tertiary-end`             | AI tertiary end           |
| `--color-ai-subtle-start`    | `from-ai-subtle-start`           | AI subtle start           |
| `--color-ai-subtle-end`      | `to-ai-subtle-end`               | AI subtle end             |
| `--color-gradient-start`     | `from-gradient-start`            | Brand gradient start      |
| `--color-gradient-end`       | `to-gradient-end`                | Brand gradient end        |

These are inside `@theme inline`, so Tailwind v4 resolves them as standard
gradient stop classes.

---

## Standard Gradient Pairs

Use standard Tailwind v4 `from-*/to-*` gradient stop classes to apply UDS
gradient pairs. Always combine with a `bg-linear-to-*` direction class:

| Gradient Pair  | Classes                                       | Purpose               |
| -------------- | --------------------------------------------- | --------------------- |
| AI Primary     | `from-ai-primary-start to-ai-primary-end`     | Primary AI gradient   |
| AI Secondary   | `from-ai-secondary-start to-ai-secondary-end` | Secondary AI gradient |
| AI Tertiary    | `from-ai-tertiary-start to-ai-tertiary-end`   | Tertiary AI gradient  |
| AI Subtle      | `from-ai-subtle-start to-ai-subtle-end`       | Subtle AI gradient    |
| Brand Gradient | `from-gradient-start to-gradient-end`         | Base brand gradient   |

These require a direction class (`bg-linear-to-*`) to render visually.

---

## Gradient Direction

Tailwind v4 direction classes:

| Class             | Direction                |
| ----------------- | ------------------------ |
| `bg-linear-to-r`  | Left to Right            |
| `bg-linear-to-l`  | Right to Left            |
| `bg-linear-to-t`  | Bottom to Top            |
| `bg-linear-to-b`  | Top to Bottom            |
| `bg-linear-to-br` | Top-left to Bottom-right |
| `bg-linear-to-bl` | Top-right to Bottom-left |
| `bg-linear-to-tr` | Bottom-left to Top-right |
| `bg-linear-to-tl` | Bottom-right to Top-left |

Custom angles: `bg-linear-[45deg]`, `bg-linear-[135deg]`, `bg-linear-[270deg]`

---

## Background Gradients

```tsx
{
  /* Standard gradient pair */
}
<div className="from-ai-primary-start to-ai-primary-end bg-linear-to-r">
  AI banner
</div>;

{
  /* Custom angle */
}
<div className="from-ai-primary-start to-ai-primary-end bg-linear-[45deg]">
  45-degree gradient
</div>;

{
  /* Mix-and-match stops from different pairs */
}
<div className="from-ai-primary-start to-gradient-end bg-linear-to-br">
  Custom mix
</div>;

{
  /* With via mid-stop (Tailwind v4 standard) */
}
<div className="from-ai-primary-start via-ai-subtle-start to-ai-primary-end bg-linear-to-r">
  Three-stop gradient
</div>;
```

---

## Text Gradients

Technique: `background-clip: text` + `text-transparent`:

```tsx
<span className="from-ai-primary-start to-ai-primary-end bg-linear-to-r bg-clip-text text-transparent">
  Gradient text
</span>;

{
  /* Wrapped in a Text component */
}
<Text
  className="from-ai-primary-start to-ai-primary-end bg-linear-to-r bg-clip-text text-transparent"
  variant="heading2xl"
  weight="bold"
>
  AI Feature Title
</Text>;
```

When using `bg-clip-text`, do NOT set the `color` prop on `Text` — the gradient
replaces the text color.

---

## Icon / Shape Gradients

The UDS Icon component uses CSS mask + `background-color: currentColor`. To
apply a gradient to an icon:

```css
/* In a CSS file or <style> tag */
.gradient-icon i {
  background-color: transparent !important;
  background-image: linear-gradient(
    45deg,
    var(--color-ai-primary-start),
    var(--color-ai-primary-end)
  ) !important;
}
```

```tsx
<div className="gradient-icon">
  <Icon icon={star} size="large" title="AI feature" />
</div>
```

The Button component handles icon gradients automatically when `concept="ai"` is
set — no manual gradient needed for Button icons.

---

## Border Gradients

Technique: `::before` pseudo-element with `mask-composite: exclude`:

```css
.gradient-border {
  position: relative;
  border-radius: var(--protected-container-rounded);
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px; /* border thickness */
  border-radius: inherit;
  background: linear-gradient(
    45deg,
    var(--color-ai-primary-start),
    var(--color-ai-primary-end)
  );
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  z-index: -1;
}
```

This technique is already used by the AI Button component
(`uds-btn-ai-secondary` in `Button.style.css`).

---

## Radial and Conic Gradients

Tailwind v4 supports `bg-radial-*` and `bg-conic-*`:

```tsx
{
  /* Radial gradient with UDS tokens */
}
<div className="from-ai-primary-start to-ai-primary-end bg-radial-[at_center]">
  Radial gradient
</div>;

{
  /* Custom CSS for conic gradients */
}
<div
  style={{
    background: `conic-gradient(
    from 0deg,
    var(--color-ai-primary-start),
    var(--color-ai-primary-end),
    var(--color-ai-primary-start)
  )`,
  }}
>
  Conic gradient
</div>;
```

---

## Combining with Other Tailwind Utilities

```tsx
{
  /* Hover: switch gradient direction on hover */
}
<div className="from-ai-primary-start to-ai-primary-end bg-linear-to-r transition-all hover:bg-linear-to-l">
  Hover reverses direction
</div>;

{
  /* Responsive: different direction per breakpoint */
}
<div className="from-ai-primary-start to-ai-primary-end bg-linear-to-b md:bg-linear-to-r">
  Vertical on mobile, horizontal on desktop
</div>;

{
  /* Theme variant: use gradient only in dark mode */
}
<div className="bg-surface-base dark:from-ai-subtle-start dark:to-ai-subtle-end dark:bg-linear-to-r">
  Gradient only in dark mode
</div>;

{
  /* Brand variant: different gradient per brand */
}
<div className="from-gradient-start to-gradient-end bg-linear-to-r">
  Uses each brand's own gradient colors
</div>;
```

---

## Brand Awareness

- All gradient tokens are brand-specific —
  `from-ai-primary-start to-ai-primary-end` produces different colors for IONOS
  vs Strato vs others.
- `from-gradient-start to-gradient-end` is the brand's primary marketing
  gradient.
- Some brands (fasthosts, udag) have flat gradients (same start/end) — the
  utility still works but produces a solid color.
- Dark mode may change gradient colors (e.g., IONOS secondary/subtle differ).
- Always test gradients across the intended brand(s).

---

## Animatable Gradient Properties

UDS registers gradient properties as animatable via `@property` (defined in
`Button.style.css`):

| Property               | Syntax         | Animatable | Default       |
| ---------------------- | -------------- | ---------- | ------------- |
| `--uds-gradient-angle` | `<angle>`      | Yes        | `45deg`       |
| `--uds-gradient-from`  | `<color>`      | Yes        | `transparent` |
| `--uds-gradient-to`    | `<color>`      | Yes        | `transparent` |
| `--uds-gradient-hold`  | `<percentage>` | Yes        | `40%`         |

These are used internally by the Button AI styles. For custom animation:

```css
.animated-gradient {
  --uds-gradient-angle: 0deg;
  background: linear-gradient(
    var(--uds-gradient-angle),
    var(--color-ai-primary-start),
    var(--color-ai-primary-end)
  );
  transition: --uds-gradient-angle 0.5s ease;
}
.animated-gradient:hover {
  --uds-gradient-angle: 180deg;
}
```

---

## Do's and Don'ts

**DO:**

- Use `from-*/to-*` classes with `bg-linear-to-*` direction for standard
  gradient pairs.
- Always pair gradient stop classes with a `bg-linear-to-*` direction class.
- Mix stops from different pairs when needed (e.g.,
  `from-ai-primary-start to-gradient-end`).
- Use `bg-clip-text text-transparent` for gradient text.
- Test gradients across target brands — some brands have flat/no gradients.
- Use `var(--color-ai-*-start/end)` in custom CSS for advanced patterns.

**DON'T:**

- Hardcode gradient hex/oklch values — always use UDS gradient tokens.
- Use `from-*/to-*` without a direction class — the gradient won't be visible.
- Apply `color` prop on `Text` when using `bg-clip-text text-transparent`.
- Forget that `from-gradient-start to-gradient-end` renders differently per
  brand — avoid relying on its exact visual appearance in brand-agnostic code.
- Use `--private-*` variables directly — use the public `--color-*` aliases.
