---
name: strato-ai-features
description: STRATO brand color language for AI features — the cyan→pink AI gradient with dark label text, the blue text-gradient for secondary/tertiary AI actions, the yellow→orange ai-subtle "thinking" surface, and the light-blue AI surface. Use whenever building an AI affordance for data-brand="strato".
metadata:
  tags: strato, ai, gradient, tokens, color, cta
---

# STRATO AI Feature Colors

STRATO marks AI features with its own **cyan→pink gradient**. It is NOT the IONOS AI
gradient and NOT the STRATO orange brand gradient.
Orange stays the brand hero. Cyan→pink is reserved for AI.

**Same gate as every brand:** apply AI styling ONLY when the feature itself performs AI
generation or inference (a prompt or chat assistant, a "generate" or "improve with AI" action,
an AI result or AI badge). Every other CTA stays on STRATO Blue `#272CB2` with white text.
`illustrationBrief.aiFeature` / `aiStyled` decides it. Never reason it from the palette.

## Use these hex values. Do not use `var(--color-ai-*)` for strato.

The published `@ionos-web-design-system/core` the renderer installs still maps strato's AI
tokens to the old orange gradient. `var(--color-ai-primary-start/end)`,
`var(--color-ai-subtle-*)` and `var(--surface-semantic-ai)` would therefore render orange,
or the old pink surface. For `brand=strato`, hardcode the hex values below. This
**overrides** every `var(--color-ai-*)` snippet in the shared wireframe/embed rules, and the
"white text" those snippets pair with the AI CTA.

| Role | Light scheme | Dark scheme | Token it replaces |
|---|---|---|---|
| AI primary gradient: start (cyan) | `#1FD7FF` | `#1FD7FF` | `ai-primary-start` |
| AI primary gradient: end (pink) | `#E498FF` | `#E498FF` | `ai-primary-end` |
| Label/icon ON the primary gradient | `#29294D` (dark) | `#29294D` (dark) | `text-semantic-ai` |
| AI secondary/tertiary text-gradient: start | `#2F2F70` | `#F7F7F9` | `ai-secondary-start` / `ai-tertiary-start` |
| AI secondary/tertiary text-gradient: end | `#272CB2` | `#64AAFF` | `ai-secondary-end` / `ai-tertiary-end` |
| AI surface (hover fill, AI chip/tint) | `#EDEEF3` | `#EDEEF3` | `surface-semantic-ai` |
| ai-subtle "thinking" gradient: start | `#FFC700` | `#FFC700` | `ai-subtle-start` |
| ai-subtle "thinking" gradient: end | `#FF8800` | `#FF8800` | `ai-subtle-end` |

## How each piece is used

- **Primary AI CTA** (generate / improve with AI / send prompt): a `linear-gradient(45deg, #1FD7FF, #E498FF)`
  fill with a **dark `#29294D` label and icon**. White text on this gradient is wrong. It fails
  contrast, because both stops are light (white 1.7:1 and 2.1:1, `#29294D` 8.1:1 and 6.7:1). Static 45° angle in generated assets, never animated.
- **Secondary / tertiary AI action** (outlined or text-only "Ask AI", "Suggest"): no fill. The
  label is a blue text-gradient (`#2F2F70 → #272CB2` on light, `#F7F7F9 → #64AAFF` on dark) via
  `background-clip: text`. Hover or active state = a solid `#EDEEF3` fill under the text. No gradient border.
- **AI icon on its own** (sparkles icon button, a lone AI mark on a light surface): use the
  **blue** text-gradient (`#2F2F70 → #272CB2`), not cyan→pink. The cyan→pink pair is too
  light for a small icon on a light surface. The pink `#E498FF` may tint a sparkle that sits
  **on** the primary gradient or on a dark surface.
- **AI chip / badge / result callout tint**: `#EDEEF3` surface + `#29294D` text. Keep the
  gradient for one primary AI CTA (or the badge mark), not the whole card.
- **Thinking / generating indicator** (mandatory between trigger and result): the ai-subtle
  gradient `#FFC700 → #FF8800`. On STRATO, "AI is working" is warm and sunny, in brand orange.
  Use it only for the in-progress state, never as a resting card background. Calm opacity or
  shimmer movement, ≥10–15 frames, no hard cut.
- **Glow / bloom** on an AI moment: radial `#1FD7FF` or `#E498FF` at ~0.15–0.25 opacity, pulsed
  on opacity/scale. Glow belongs to the CTA, never to the card.

## DON'T

- Don't use any IONOS AI or IONOS sky color on STRATO.
- Don't put white text on the cyan→pink gradient.
- Don't mix AI stops with brand colors in one gradient (no cyan→blue, no orange→pink). The AI
  gradient is exactly `#1FD7FF → #E498FF`. Every other gradient in the frame uses brand stops only.
- Don't render the AI gradient in orange (`#FF8800 → #FFC700`). Orange→yellow is the
  **brand** gradient. Yellow→orange is only the transient thinking state.
- Don't use a pink or purple AI surface. The STRATO AI surface is light blue `#EDEEF3`.
- Don't apply any AI color to a non-AI feature (security, hosting, domains, pricing, e-commerce).
