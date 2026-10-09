# Demonstration frame (low fidelity)

A demonstration wireframe shows ONE product frame and ONE real feature. Everything around the
feature is placeholder structure.

- **Frame**: one product frame (shell colours per `ionos/product-frame-color.md`); navigation is
  3–4 short real labels (or bars when the frame is tiny), never a full menu.
- **Skeleton around the feature**: placeholder bars (`shared/placeholder-bars.md`) and
  `KitSkeleton` stand in for content that is not the feature. No data tables, KPI grids, lists
  of rows, or multiple panels.
- **One real feature**: the highlighted region carries real copy (from `texts.*`) and kit
  components — at most ~8 real kit elements in the whole composition.
- **The featured prompt is the drawn hero**: when the brief names a prompt or input, draw it
  large and legible (border, radius, padding from tokens; typed text; blinking caret) beside the
  AI button. It is never omitted.
- **Demonstration layer**: a floating highlight card, connector line or pop-out as the brief
  asks (`shared/floating-card.md`, `shared/connector-line.md`, `ionos/feature-pop-out.md`);
  in an animation, also follow the AI-animations and micro-animations rules for the motion.

## Composition Rule — One Frame, One Highlight

**Every product animation has exactly two primary elements:**
1. **One main product frame** — the product/app UI
2. **One floating highlight card** — the AI feature moment, always a sibling of the frame (never inside it)

Secondary floating elements (tool chips, stat pills) are allowed as decoration but must be less prominent and also live outside the frame.

## Client-app zone in a demonstration wireframe

Low-fidelity only (a realistic interface shows real labels and values instead).

### Code-sample comment (inside the client-app zone `<div>`)

```
  {/* Content rows — Bars in #BCC8D4 (cool-grey-300) */}
```

### Placeholder-bar / selection-marquee paragraphs

**Text placeholder bars in the client app**: `#BCC8D4` (cool-grey-300), NOT white or dark —
fixed, part of the client-app's own light theme in both shell branches.
**AI selection target inside client app**: `border: 2px dashed <the brand's AI-generating text colour>` (see the uds-style-guide ionos-ai-features rule; never hardcode it here) — the text-selection marquee ONLY. The floating highlight card itself has NO border; it uses a plain neutral drop shadow (no AI glow — the AI glow is on the CTA button only) (see `shared/floating-card.md`).

### Frame diagram rows that drew placeholder bars (original ASCII rows)

```
│  W logo                     ┌─────────────────┐    [DARK_SHELL_ACCENT bars]  │
│  icon (active strip)        │ [Bar #BCC8D4]    │                    │
│  icon                       │ [Bar #BCC8D4]    │                    │
```
