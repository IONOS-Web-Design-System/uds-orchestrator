---
name: ionos-ai-features
description: IONOS brand color language for AI features — the signature blue→magenta gradient, AI design tokens, the Button "ai" concept, and subtle AI surfaces. Use whenever building an AI affordance (prompt input, generate/improve action, AI result callout, AI badge).
metadata:
  tags: ionos, ai, gradient, tokens, color, cta
---

# IONOS AI Feature Colors

IONOS marks AI features with a signature **blue→magenta gradient** — distinct from
the standard brand blue/sky palette. Use it ONLY for genuinely AI-driven affordances
(prompt inputs, "generate"/"improve with AI" actions, AI result callouts, AI badges).
Never use it for ordinary CTAs — those stay on brand blue/sky.

## Gradient tokens (ionos brand, from `@ionos-web-design-system/core`)

| Token (CSS custom property) | Value (ionos) | Use |
|---|---|---|
| `--color-ai-primary-start` | indigo `oklch(0.4782 0.1542 255.37)` | Primary AI CTA gradient — start |
| `--color-ai-primary-end`   | magenta `oklch(0.6677 0.2631 320.15)` | Primary AI CTA gradient — end |
| `--color-ai-subtle-start` / `--color-ai-subtle-end` | light + dark-scheme pairs | Subtle AI surfaces (prompt/generating backgrounds) |
| `--color-ai-secondary-*`, `--color-ai-tertiary-*` | gradient pairs | Secondary/tertiary AI emphasis |
| `--surface-semantic-ai`, `--text-semantic-ai` | semantic | AI surface tint / on-AI text |

The magenta end (`--color-ai-primary-end`) is the AI **accent** — use it for the
sparkle/star icon that signals an AI affordance.

### Resolved sRGB hex (for hardcoded / Remotion-wireframe contexts)

CSS custom properties may not resolve in a Remotion render, and OKLCH must NOT be
hand-converted — use these exact hex values when hardcoding:

| Token | Hex |
|---|---|
| `ai-primary-start` (IONOS blue) | `#095BB1` |
| `ai-primary-end` (magenta) | `#D746F5` |
| `ai-subtle-start` (light) | `#FAE7FE` |
| `ai-subtle-end` (light) | `#FFFFFF` |
| AI accent / semantic-ai | `#B410E7` |

The gradient **starts blue and ends magenta** — `#095BB1 → #D746F5`. A purple-only or
pink-only gradient is wrong; the blue start is what makes it read as IONOS.

Interactive AI controls (generate / "improve with AI" / prompt send) use this gradient —
**never** brand sky `#11C7E6` (that is a generic CTA colour, not the AI signature).

## Primary AI CTA — the gradient

A full blue→magenta gradient background with white text. Default direction `45deg`.
The `315deg` (hover) and `225deg` (active) angles are **interaction states**, not a
continuous animation. In a rendered video there is no live cursor, so:
- Hold the gradient at `45deg` by default.
- To depict an interaction, **snap** the angle (e.g. `45→225deg` over ~4–6 frames with
  `interpolate(frame, [clickStart, clickStart+5], …)`) at the click moment, then settle.
- Do NOT slowly rotate the CTA gradient across the whole clip — that is not the behaviour.
  A *subtle* continuous shimmer belongs only on `ai-subtle` "generating…" backgrounds.

```css
background: linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end));
color: #fff;
```

## Subtle AI surfaces — prompt & generating states

Prompt inputs and "generating…" surfaces use the **ai-subtle** gradient as a calm
background (optionally a slow moving gradient to convey activity):

```css
background: linear-gradient(120deg, var(--color-ai-subtle-start), var(--color-ai-subtle-end));
```

## Real component — `<Button concept="ai">`

`@ionos-web-design-system/react` ships the gradient natively. 4 concepts:
`brand` · `monochrome` · `ai` · `callout`. The `ai` concept has 3 variants:

| Variant | Appearance |
|---|---|
| `primary`   | Full gradient background + white text |
| `secondary` | Gradient border + gradient text (transparent bg) |
| `tertiary`  | Gradient text only (transparent bg) |

```tsx
import { Button } from '@ionos-web-design-system/react';
<Button concept="ai" variant="primary">Generate with AI</Button>
```

The gradient direction animates on hover/active (45° → 315° → 225°); AI loading state
uses a gradient glow/scan rather than a spinner.

> **In Remotion/wireframe contexts:** CSS gradient *animation* does not run during a
> render. Drive a moving AI gradient with `useCurrentFrame()` + `interpolate()` on the
> gradient angle — see `remotion-best-practices` and `uds-wireframe`.
