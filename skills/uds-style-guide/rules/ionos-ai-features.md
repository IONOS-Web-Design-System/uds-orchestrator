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

**Operational test (is this an AI feature?):** apply the AI gradient / AI templates ONLY when
the feature itself performs AI generation or inference — a prompt/chat assistant, a
"generate"/"improve with AI" action, or an AI result. A badge or CTA earns the gradient ONLY if
it labels an AI capability; a non-AI badge or CTA (security/SSL, sale, status, hosting,
e-commerce, dashboards) stays on brand blue/sky with no AI gradient or AI glow. In this pipeline
the moderator makes this explicit via `illustrationBrief.aiFeature` (true → AI styling, false →
brand blue/sky only) — "CTAs/badges only" is a *placement* limit, not a license to use the AI
gradient on a non-AI badge.

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
| `ai-primary-end` (magenta, = IONOS purple-400) | `#D746F5` — AI gradient end; also the promotional-shape colour (same on light + dark) |
| `ai-subtle-start` | light `#FAE7FE` · dark `oklch(0.3696 0.1806 304.15)` — scheme-aware token; prefer `var(--color-ai-subtle-start)` |
| `ai-subtle-end` | light `#FFFFFF` · dark `oklch(0.229 0.0801 256.64)` — prefer `var(--color-ai-subtle-end)` |
| purple-500 `#B410E7` | **RETIRED — do not use in any scenario** |
| "generating" text (purple-600) `#8212C2` | transient AI-generating text colour only; reverts to `var(--text-base)` / `var(--text-subtle)` once generation completes |

The gradient **starts blue and ends magenta** — `#095BB1 → #D746F5`. A purple-only or
pink-only gradient is wrong; the blue start is what makes it read as IONOS.

Interactive AI controls (generate / "improve with AI" / prompt send) use this gradient —
**never** brand sky `#11C7E6` (that is a generic CTA colour, not the AI signature).

## Primary AI CTA — the gradient

A full blue→magenta gradient background with white text. Default direction `45deg`.
**In Remotion/wireframe contexts, always use a static `45deg` angle. Do NOT animate or
interpolate the gradient angle.**

### AI moment animation — preferred effects

To animate an AI moment (button activation, content generation, result reveal), use:
- **Glow/radial bloom** — a radial gradient using `#095BB1` (blue) or `#D746F5` (magenta)
  at low opacity (~0.15–0.25), pulsed via `interpolate()` on `opacity` or `scale`
- **Harmonized gradient fade** — fade in/out a `linear-gradient(120deg, #FAE7FE, #FFFFFF)`
  (`ai-subtle`) as the background of the active surface; slow, calm movement only
- **Light bloom on text/icon** — briefly lift the AI star icon or result text with a
  soft `drop-shadow(0 0 8px #D746F5)` at low opacity, fading out after the reveal

These effects are calm and premium — they signal AI without overpowering the content.

### Loading state — mandatory

**Every AI interaction must include a visible loading/generating state** between the
trigger (button click) and the result reveal. A direct cut from action to result looks
broken. The loading state:
- Shows the `ai-subtle` gradient (`var(--color-ai-subtle-start)` → `var(--color-ai-subtle-end)`;
  light `#FAE7FE → #FFFFFF`, dark via the token) ONLY on the AI **'thinking' indicator** — e.g. a
  text-placeholder / typing bar — never as a general panel, prompt-bubble, or card surface
- Lasts at least 10–15 frames (at 30fps) — long enough to read as deliberate processing
- May pulse a `filled-sparkles` AI icon in the AI accent `#D746F5` (low-opacity oscillation), or a
  soft gradient scan across the content area — never use the retired `#B410E7`
- Resolves into the result reveal with a fade or slide — never a hard cut

```css
background: linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end));
color: #fff;
```

## Subtle AI surfaces — the 'thinking' indicator ONLY

`ai-subtle` is a **scheme-aware token** — `--color-ai-subtle-start/end` carry BOTH light and dark
values. Reserve it for the AI **'thinking' indicator** only — e.g. a text-placeholder bar that
animates while the model "thinks". It is NOT a general surface: prompt inputs, panels, bubbles,
and cards use `var(--surface-base)` / `var(--surface-subtle)`, never `ai-subtle`.

```css
/* AI 'thinking' indicator only — the token carries light + dark */
background: linear-gradient(120deg, var(--color-ai-subtle-start), var(--color-ai-subtle-end));
```

## Real component — `<Button concept="ai">`

`@ionos-web-design-system/react` ships the gradient natively. 4 concepts:
`brand` · `monochrome` · `ai` · `callout`. The `ai` concept has 3 variants:

| Variant | Appearance |
|---|---|
| `primary`   | Full gradient background + white text |
| `secondary` | Gradient text on transparent bg (**gradient borders are retired** — no gradient border) |
| `tertiary`  | Gradient text only (transparent bg) |

```tsx
import { Button } from '@ionos-web-design-system/react';
<Button concept="ai" variant="primary">Generate with AI</Button>
```

AI loading state uses a gradient glow/scan rather than a spinner.

> **In Remotion/wireframe contexts:** The AI CTA button gradient is always static —
> `linear-gradient(45deg, #095BB1, #D746F5)`. Animate the AI *moment* using glow,
> radial bloom, or harmonized `ai-subtle` gradient fade — not by rotating the CTA angle.
> A loading state between trigger and result is required — see "Loading state" above.
