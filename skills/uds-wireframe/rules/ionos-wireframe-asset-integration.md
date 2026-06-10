# Wireframe Asset Integration

Pixel images make a wireframe feel real — a hero photo, a client UI screenshot, a device mockup.
Use them deliberately (≤2–3 per composition); a wall of pasted screenshots is not a wireframe.

There are two ways images arrive: **user-provided** (interactive use) and the **pipeline catalog**
(codegen). The catalog is the main path for the pipeline.

---

## User-provided images (interactive)

**Local file path** (`/Users/.../hero.jpg`, `./assets/x.png`)
Prefer the UDS `Picture` component; plain `<img>` is acceptable for quick sketches.
```tsx
import { Picture } from '@ionos-web-design-system/react/picture';
<Picture src="/Users/you/hero.jpg" alt="Hero" className="w-full h-96 object-cover rounded-lg" />
```
Local paths only resolve in a dev server with filesystem access; `public/` paths are reliable.

**Figma URL** (`figma.com/design/:fileKey/:name?node-id=1-2`)
Extract `fileKey` + `nodeId` (`node-id=1-2` → `1:2`), call
`mcp__plugin_figma_figma__get_screenshot(fileKey, nodeId)` for a 7-day URL, embed via `<img>`, and
leave a comment with the source URL so it can be re-fetched when it expires.

**Placement quick-reference:** Hero — full-width `object-cover`, dark overlay + centered headline/CTA.
Card — `object-cover object-top`, caption below. Aside — rounded + bordered, small caption.

---

## Pipeline catalog assets

The pipeline pre-copies matched assets into the workspace `public/` folder and injects a
`# Available assets` block. **Always** reference them with `<Img src={staticFile('slug.format')} />`
— never plain `<img>`, never download or fetch at runtime.

### How to select and place

Each catalog entry's `description` is a plain-prose paragraph written by the designer. It describes
what the image shows, what business or person it represents, and when to use it. **Read the full
description semantically and match it against the brief context** — not against tags or slug names.

The description may start with a type prefix in brackets: `[photo]`, `[website]`, `[mockup]`,
`[icon]`. Use this to determine placement. If no prefix is present, infer from the description.

**Placement by type:**

| Type prefix (or inferred) | What it is | How to place it |
|---|---|---|
| `[photo]` | Standalone photo — person, product, scene | Fill an **image placeholder** only (`objectFit:'cover'`). Never the whole client interface. |
| `[website]` | Full website or app UI screenshot | Use **as the website being edited** inside the product frame's light client-app zone (`#F4F7FA`). Never also shrink into a thumbnail. |
| `[mockup]` | Scene with a blank screen area | Mockup = backdrop at z-index 0; composite the live UI absolutely into the blank screen region. |
| `[icon]` | Small brand/product icon | Inline in generated UI (integrations row, login button). 16–32px, `objectFit:'contain'`, never a hero. |

**Selection rules — read these in order:**

1. **Match description to brief context.** The right asset is the one whose description best matches
   who the customer is, what industry they are in, and what their website looks like in the brief.
   A brief about a small business owner's shop calls for a `[website]` described as a shop, not a
   portfolio. A brief about automotive repair calls for a `[photo]` of a garage or car, not food.

2. **Honour explicit contrasts in the description.** Designers write "use for X, not for Y" to
   distinguish similar-looking assets. A description that says "not a personal portfolio" is telling
   you directly not to pick it for an individual-person brief.

3. **Match light/dark theme.** The product frame's client-app zone is always light (`#F4F7FA`), so
   only use `[website]` assets described as light-themed there. A dark-themed dashboard screenshot
   placed in a light zone produces a jarring mismatch.

4. **Skip the catalog if nothing fits.** It is always correct to build from Remotion primitives and
   UDS tokens instead of forcing a poorly-matched asset.

```tsx
// [mockup] — composite the live UI into the blank screen area:
<div style={{ position: 'relative' }}>
  <Img src={staticFile('phone-mockup.png')} style={{ width: '100%', display: 'block' }} />
  <div style={{ position: 'absolute', top: '7%', left: '12%', right: '12%', bottom: '7%',
                overflow: 'hidden', borderRadius: 28 }}>
    {/* generated mobile UI — tune the inset to THIS mockup's blank screen region */}
  </div>
</div>
```

### When the brief gives raw Figma nodeIds (no descriptions)

If the brief lists `[figma: nodeId=…]` without descriptions, enrich once before writing layout code:
call `get_design_context(fileKey: "StkUOHcGRMDXOZWT0E2nft", nodeId: "0:1")` **once**, read each
frame's `description` (fall back to its `name`), and classify into a layout role:

| Description keywords | Role / placement |
|---|---|
| `overview`, `dashboard`, `main`, `home` | **Hero panel** — largest slot, center |
| `panel`, `sidebar`, `detail`, `assistant` | **Secondary panel** — floats beside/below |
| `badge`, `notification`, `status`, `done` | **Pop-out** — small, absolute, outside frame edge |
| `card`, `upload`, `progress`, `form` | **Inline card** — inside the content grid |
| `logo`, `brand`, `nav`, `header` | **Nav asset** — top strip |

First match wins. On timeout/error, infer positionally: first = hero, middle = panels, last = pop-out.
Never call Figma MCP inside a Remotion render function — asset lookup is a codegen-time step.

### Animate: staggered reveal

Reveal assets in sequence for progressive disclosure (hero → panels → cards → pop-out):

| Frames | Element | Motion |
|---|---|---|
| 0–20 | Hero | fade + scale 0.96→1 |
| 20–40 | Secondary panel | slide-in `translateX -48→0` |
| 38–58 | Inline card | slide-up `translateY 32→0` |
| 55–75 | Pop-out | fly-in `translateX 72→0` |

```tsx
import { Img, interpolate, useCurrentFrame, Easing, staticFile } from 'remotion';
const frame = useCurrentFrame();
const reveal = (inF: number, outF: number) =>
  interpolate(frame, [inF, outF], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1) });
// e.g. hero: opacity reveal(0,20), scale 0.96→1; panel: translateX (1-reveal(20,40))*-48; …
```

**Variants (`variants > 1`):** vary by **reordering which asset fills which role** (not by retiming).
Drive it via `variantInputProps` in the manifest (e.g. `{ popOutSide:'bottom-left', panelFromRight:true }`)
and read those props in the composition.

---

## Fallback when no image fits

It's always fine to skip the catalog and build from primitives. When the layout needs an image but
none is provided/suitable, use a token-styled placeholder:

```tsx
<div className="w-full h-64 rounded-lg flex items-center justify-center"
     style={{ background: 'var(--brand/ionos-blue-900)' }}>
  <Icon group="system" name="image" size={48} className="opacity-30" />
  <span className="text-sm opacity-40 ml-2">Image placeholder</span>
</div>
```

---

> **Designers — authoring asset metadata:** the full guide for writing descriptions lives in the
> Figma asset library. Source doc: `docs/asset-metadata-authoring.md`.
