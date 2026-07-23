---
styles: [interface-asset]
---

## Style: interface-asset

Story: the product feature IS a full interface (e.g. a CMS/editor shell), and the
generated imagery serves as that interface's content. Reference 64:320: a dark navy
brand-gradient base; the main interface wireframe (editor shell with a left icon sidebar)
is the centerpiece; the imagery sits inside it as the hero media, with a calm negative-space
region left inside that slot (no rendered marketing headline — see `shared-brief-parsing.md`
no-marketing-heading); a prompt bubble and a mini-toolbar float over the wireframe's edge.

This is a **normal wireframe composition** — build the interface itself per the standard
rules and do not re-invent them here:

- `ionos/composition.md` — layout patterns, component selection, placeholder
  content, hero-media treatment.
- `ionos/asset-integration.md` — catalog asset placement
  (`<Img src={staticFile('<slug>.png')} />`, never plain `<img>`).
- `ionos/product-frame-color.md` — the product shell's color system (sidebar,
  panels, header actions).
- `shared/frame-anatomy.md` — the one-frame-one-highlight composition rule.

What THIS rule adds on top:

1. **Root** — opaque brand-gradient `<AbsoluteFill>` (harmonized per the
   [Color harmony](#color-harmony-the-four-opaque-styles) section below — derive the
   gradient from the imagery's measured dominant tone mixed toward the brand's deepest
   dark tone, e.g. IONOS Dark Midnight).
2. **Main interface wireframe** — the centerpiece, covering roughly **70-85% of the
   canvas**, sitting on the gradient root with rounded corners and a soft shadow.
3. **The catalog image is the hero/media asset INSIDE the wireframe** — placed in the
   interface's hero/media slot with `objectFit: 'cover'`. Leave a calm, uncluttered
   negative-space region within that slot — no marketing headline is rendered over it (see
   `shared-brief-parsing.md` no-marketing-heading); never a scrim over the image. Placeholder
   bars/content blocks sit below the hero, per the product-frame placeholder palette.
4. **1-2 floating highlight fragments** overlapping the wireframe's edge — a prompt
   bubble and/or a small mini-toolbar pill, per the **Floating Highlight Card template**
   (`ionos/ai-animations.md`): borderless glass surface + plain neutral drop
   shadow (no AI glow — AI glow is on the CTA only), no border of any kind. The prompt
   bubble uses `var(--surface-base)` (reserve `ai-subtle` for the AI 'thinking' indicator
   only) with a muted caption and a gradient CTA (e.g. "✨ Seite erstellen" —
   `linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))`,
   white text). The AI gradient belongs to CTAs only, never to fragment chrome.

