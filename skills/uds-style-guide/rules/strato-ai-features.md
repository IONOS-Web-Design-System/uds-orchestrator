---
name: strato-ai-features
description: STRATO brand color language for AI features — the blue→cyan AI gradient with white label text, the dark-blue text-gradient for secondary/tertiary AI actions, the yellow→orange ai-subtle "thinking" surface, and the light-blue AI surface. Use whenever building an AI affordance for data-brand="strato".
metadata:
  tags: strato, ai, gradient, tokens, color, cta
---

# STRATO AI Feature Colors

STRATO marks AI features with its own **blue→cyan gradient** (electric blue into bright cyan).
It is NOT the IONOS AI gradient and NOT the STRATO orange brand gradient.
Orange stays the brand hero. Blue→cyan is reserved for AI.

**Same gate as every brand:** apply AI styling ONLY when the feature itself performs AI
generation or inference (a prompt or chat assistant, a "generate" or "improve with AI" action,
an AI result or AI badge). Every other CTA is a brand `KitButton` (no `concept="ai"`; STRATO Blue from the tokens).
`illustrationBrief.aiFeature` / `aiStyled` decides it. Never reason it from the palette.

## Tokens and the kit first; hex only for hand-drawn shapes

The renderer's UDS core carries the STRATO AI concept. AI CTAs and AI icon actions are kit
components (`<KitButton concept="ai">`, `<KitIconButton ai>`), and they take the values below
from the tokens automatically. AI-coloured copy, if wanted, is a hand-drawn text gradient using
the hex values. Use the literal hex values only for an AI-related shape you draw yourself (an
illustration accent, a text gradient, a drawn AI badge). Text and glyphs ON the AI gradient are
white.

| Role | Light scheme | Dark scheme | Token |
|---|---|---|---|
| AI primary gradient: start (blue) | `#0000FF` | `#0000FF` | `ai-primary-start` |
| AI primary gradient: end (cyan) | `#00FFFF` | `#00FFFF` | `ai-primary-end` |
| Label/icon ON the primary gradient | `#FFFFFF` (white) | `#FFFFFF` (white) | `text-semantic-ai` |
| AI secondary/tertiary text-gradient: start | `#29294D` | `#F7F7F9` | `ai-secondary-start` / `ai-tertiary-start` |
| AI secondary/tertiary text-gradient: end | `#272CB2` | `#64AAFF` | `ai-secondary-end` / `ai-tertiary-end` |
| AI surface (hover fill, AI chip/tint) | `#EDEEF3` | `#EDEEF3` | `surface-semantic-ai` |
| ai-subtle "thinking" gradient: start | `#FFC700` | `#FFC700` | `ai-subtle-start` |
| ai-subtle "thinking" gradient: end | `#FF8800` | `#FF8800` | `ai-subtle-end` |

A drawn AI gradient is linear and static: the blue start at the bottom-left, the cyan end at the
top-right (45°).

## How each piece is used

- **Primary AI CTA** (generate / improve with AI / send prompt): `<KitButton concept="ai" label={…} icon={sparkles} />`.
  The kit draws the blue→cyan fill with the white label and icon from the tokens. Animate
  its `glow` prop for the AI moment; never wrap it in a hand-drawn gradient or recolour its label.
- **Secondary / tertiary AI action** (outlined or text-only "Ask AI", "Suggest"):
  `<KitButton concept="ai" variant="secondary" …/>` or `variant="tertiary"`. The kit renders the
  dark-blue text-gradient label and the `#EDEEF3` hover fill. No gradient border.
- **AI icon on its own** (sparkles icon button, a lone AI mark on a light surface):
  `<KitIconButton ai icon={sparkles} title={…} />`. The kit takes its colour from the tokens (on
  STRATO the icon button uses the dark-blue pair, because cyan is too light on a light surface);
  never draw it. A sparkle you draw yourself on a light surface uses the **dark-blue** pair
  (`#29294D → #272CB2`); a drawn sparkle that sits **on** the primary gradient or on a dark
  surface is white.
- **AI chip / badge** (drawn — the kit has no AI chip) **and result callout tint**: `#EDEEF3`
  surface + `#29294D` text (the STRATO ink, not the white on-gradient label). A drawn round AI
  badge mark is the blue→cyan gradient with a white sparkle. Keep the gradient for one primary AI
  CTA (or the badge mark), not the whole card.
- **Thinking / generating indicator** (mandatory between trigger and result): the ai-subtle
  gradient `#FFC700 → #FF8800`. On STRATO, "AI is working" is warm and sunny, in brand orange.
  Use it only for the in-progress state, never as a resting card background. Calm opacity or
  shimmer movement, ≥10–15 frames, no hard cut.
- **Glow / bloom** on an AI moment: on the AI CTA it is the `KitButton` `glow` prop, animated from
  the frame. A bloom you draw yourself (an illustration accent) is radial `#0000FF` or `#00FFFF` at
  ~0.15–0.25 opacity, pulsed on opacity/scale. Glow belongs to the CTA, never to the card.

## DON'T

- Don't use any IONOS AI or IONOS sky color on STRATO.
- Don't put dark text on the blue→cyan gradient, and don't put white text on cyan alone: the
  label sits on the full gradient and is white.
- Don't change the AI stops. The AI gradient is exactly `#0000FF → #00FFFF`: never STRATO's
  brand blue in place of its blue start, no third stop, no pink, purple or orange in it. Every
  other gradient in the frame uses brand stops only.
- Don't render the AI gradient in orange (`#FF8800 → #FFC700`). Orange→yellow is the
  **brand** gradient. Yellow→orange is only the transient thinking state.
- Don't use a pink or purple AI surface. The STRATO AI surface is light blue `#EDEEF3`.
- Don't apply any AI color to a non-AI feature (security, hosting, domains, pricing, e-commerce).
