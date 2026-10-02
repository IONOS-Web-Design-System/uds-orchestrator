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
| `--private-ai-primary-start` | indigo `oklch(0.4782 0.1542 255.37)` | Primary AI gradient — start |
| `--private-ai-primary-end`   | magenta `oklch(0.6677 0.2631 320.15)` | Primary AI gradient — end |
| `--private-ai-subtle-start` / `--private-ai-subtle-end` | light + dark-scheme pairs | The AI 'thinking' indicator only |
| `--private-ai-secondary-*`, `--private-ai-tertiary-*` | gradient pairs | Secondary/tertiary AI emphasis |
| `--surface-semantic-ai`, `--text-semantic-ai` | semantic | AI surface tint / on-AI text |

These are the CSS variables that exist at runtime inside the `data-brand` root. The
`--color-ai-*` names seen in Tailwind are `@theme inline` aliases, not runtime variables: never
write `var(--color-ai-*)` in a style object.

**The kit owns AI controls.** The AI CTA is `<KitButton concept="ai" …/>` and an AI icon action is
`<KitIconButton ai …/>` (see the prompt section "# UDS kit"). They take every value in this file
from the tokens. Everything below that names a hex value or a gradient is for shapes **you draw
yourself** (an illustration accent, a bloom, a thinking bar, a drawn AI badge), never for a
button, input or icon action.

The magenta end (`--private-ai-primary-end`) is the AI **accent** — use it for a drawn
sparkle/star shape that signals an AI affordance.

### Resolved sRGB hex (for hand-drawn AI shapes)

OKLCH must NOT be hand-converted — use these exact hex values when you draw an AI shape:

| Token | Hex |
|---|---|
| `ai-primary-start` (IONOS blue) | `#095BB1` |
| `ai-primary-end` (magenta, = IONOS purple-400) | `#D746F5` — AI gradient end; also the promotional-shape colour (same on light + dark) |
| `ai-subtle-start` | light `#FAE7FE` · dark `oklch(0.3696 0.1806 304.15)` — scheme-aware token; prefer `var(--private-ai-subtle-start)` |
| `ai-subtle-end` | light `#FFFFFF` · dark `oklch(0.229 0.0801 256.64)` — prefer `var(--private-ai-subtle-end)` |
| purple-500 `#B410E7` | **RETIRED — do not use in any scenario** |
| "generating" text (purple-600) `#8212C2` | transient AI-generating text colour only; reverts to `var(--text-base)` / `var(--text-subtle)` once generation completes |

The gradient **starts blue and ends magenta** — `#095BB1 → #D746F5`. A purple-only or
pink-only gradient is wrong; the blue start is what makes it read as IONOS.

Interactive AI controls (generate / "improve with AI" / prompt send) carry this gradient through
`KitButton concept="ai"` — **never** brand sky `#11C7E6` (that is a generic CTA colour, not the AI
signature), and never a hand-drawn gradient div.

## Primary AI CTA — `<KitButton concept="ai">`

```tsx
import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
import { KitButton } from './kit';

<KitButton label={texts.cta} concept="ai" icon={sparkles} glow={glow} />
```

The kit renders the static blue→magenta fill and its label colour. Animate the AI moment through
the `glow` prop (0–1, computed from the frame) and the `loading` prop, and press feedback as a
transform on a parent `div`. Never rotate or interpolate a gradient angle.

### AI moment animation — preferred effects

To animate an AI moment (button activation, content generation, result reveal), use:
- **The CTA's glow** — `KitButton`'s `glow` prop, pulsed from the frame
- **Glow/radial bloom** (a drawn accent behind a result) — a radial gradient using `#095BB1`
  (blue) or `#D746F5` (magenta) at low opacity (~0.15–0.25), pulsed via `interpolate()` on
  `opacity` or `scale`
- **Light bloom on a drawn icon** — briefly lift a drawn AI star with a soft
  `drop-shadow(0 0 8px #D746F5)` at low opacity, fading out after the reveal

These effects are calm and premium — they signal AI without overpowering the content.

### Loading state — mandatory

**Every AI interaction must include a visible loading/generating state** between the
trigger (button click) and the result reveal. A direct cut from action to result looks
broken. The loading state:
- In UI chrome it is `KitButton`'s `loading` prop on the CTA and/or `<KitSkeleton shape="text" />`
  lines where the result will appear (see `ionos/ai-animations.md` Template 2)
- A drawn 'thinking' bar may use the `ai-subtle` gradient
  (`linear-gradient(120deg, var(--private-ai-subtle-start), var(--private-ai-subtle-end))`) — ONLY
  on that indicator, never as a general panel, prompt-bubble, or card surface
- Lasts at least 10–15 frames (at 30fps) — long enough to read as deliberate processing
- May pulse a drawn `filled-sparkles` mark in the AI accent `#D746F5` (low-opacity
  oscillation) — never use the retired `#B410E7`
- Resolves into the result reveal with a fade or slide — never a hard cut

## AI badges — gradient required, never flat purple

The kit has no AI chip, so an AI badge (e.g. a "KI-VORSCHLAG" / "AI suggestion" label) is a drawn
accent. Non-AI status chips and tags are `KitPill` / `KitBadge`. A drawn AI badge MUST carry the
blue→magenta **gradient** — a solid/flat purple fill is WRONG. Two valid renderings:

- **Full gradient background** — `linear-gradient(45deg, #095BB1, #D746F5)` with white text, OR
- **Gradient text on a neutral surface** — gradient-clipped text (`#095BB1 → #D746F5`) on
  `var(--surface-base)` / `var(--surface-subtle)`, matching the `ai` Button's `secondary`/`tertiary`
  text-gradient treatment described below.

A **solid / flat purple fill is WRONG** for a badge — this includes the retired `#B410E7`
(permanently retired, see above) and includes collapsing the two-stop gradient into a single
flat midpoint purple. If a badge renders as one flat purple colour instead of a two-stop
blue→magenta gradient, that is a bug, not a style choice.

`ai-subtle` (`#FAE7FE → #FFFFFF`) is NOT a badge or panel fill — it remains reserved for the
'thinking' indicator ONLY (see "Subtle AI surfaces" immediately below); never use it as a
static badge background.

## Subtle AI surfaces — the 'thinking' indicator ONLY

`ai-subtle` is a **scheme-aware token** — `--private-ai-subtle-start/end` carry BOTH light and dark
values. Reserve it for the AI **'thinking' indicator** only — e.g. a drawn text-placeholder bar
that animates while the model "thinks". It is NOT a general surface: prompt inputs, panels,
bubbles, and cards use `var(--surface-base)` / `var(--surface-subtle)`, never `ai-subtle`.

```css
/* AI 'thinking' indicator only — the token carries light + dark */
background: linear-gradient(120deg, var(--private-ai-subtle-start), var(--private-ai-subtle-end));
```

## The `ai` concept variants

UDS `Button` ships the gradient natively; the kit exposes it as `KitButton concept="ai"`. The
`ai` concept has 3 variants:

| Variant | Appearance |
|---|---|
| `primary`   | Full gradient background + on-AI label |
| `secondary` | Gradient text on transparent bg (**gradient borders are retired** — no gradient border) |
| `tertiary`  | Gradient text only (transparent bg) |

```tsx
import { KitButton } from './kit';

<KitButton label={texts.cta} concept="ai" variant="secondary" />
```

> **In Remotion/wireframe contexts:** the AI CTA is always `KitButton concept="ai"`; its gradient
> is static. Animate the AI *moment* with the `glow` and `loading` props, a drawn radial bloom, or
> a drawn `ai-subtle` thinking bar — never by rotating a gradient angle. A loading state between
> trigger and result is required — see "Loading state" above.
