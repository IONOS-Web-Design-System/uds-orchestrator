# Wireframe Asset Integration

Pixel images make wireframes much more realistic — a hero photo, a product screenshot, or a mockup device frame gives viewers an immediate sense of the intended visual weight and composition.

## The Two Asset Sources

### 1. Local File Path

When the user pastes a path like `/Users/you/Desktop/hero.jpg` or `./assets/product-shot.png`:

**Use UDS Picture component** (preferred — handles formats, retina, lazy loading):

```tsx
import { Picture } from '@ionos-web-design-system/react/picture';

<Picture
  src="/Users/you/Desktop/hero.jpg"
  alt="Hero image"
  className="w-full h-96 object-cover rounded-lg"
/>
```

**Or plain `<img>`** (acceptable for quick wireframes):

```tsx
<img
  src="/Users/you/Desktop/hero.jpg"
  alt="Hero"
  className="w-full h-96 object-cover rounded-lg"
/>
```

Note for the user: local paths only work when the component is rendered in a dev server with access to the local filesystem. For Storybook or Next.js dev, `public/` folder paths work reliably.

### 2. Figma URL

When the user pastes a Figma URL (e.g. `https://www.figma.com/design/...?node-id=...`):

1. **Extract the `fileKey` and `nodeId`** from the URL:
   - `figma.com/design/:fileKey/:name?node-id=:int-:int` → nodeId becomes `int:int` (replace `-` with `:`)

2. **Call the Figma MCP tool** to get a screenshot:
   ```
   mcp__plugin_figma_figma__get_screenshot(fileKey, nodeId)
   ```
   This returns a short-lived image URL (valid 7 days).

3. **Embed the screenshot URL** in the wireframe:
   ```tsx
   // Screenshot fetched from Figma — URL expires after 7 days
   const figmaScreenshot = 'https://www.figma.com/api/mcp/asset/...';

   <img
     src={figmaScreenshot}
     alt="Design reference from Figma"
     className="w-full rounded-lg shadow-lg"
   />
   ```

4. **Add a comment** in the code noting the source Figma URL so the user can re-fetch when the URL expires.

---

## Placement Patterns

### Hero image (full-width banner)

```tsx
<div className="relative w-full h-[480px] overflow-hidden">
  <img
    src={heroImageSrc}
    alt="Hero"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-[var(--brand/ionos-blue-800)] opacity-60" />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
    <h1 className="text-5xl font-heading font-semibold">Headline</h1>
    <Button variant="primary" className="mt-6" onClick={() => {}}>CTA</Button>
  </div>
</div>
```

### Product screenshot in a card

```tsx
<Card className="overflow-hidden">
  <img
    src={productScreenshot}
    alt="Product screenshot"
    className="w-full h-48 object-cover object-top"
  />
  <div className="p-4">
    <h3 className="font-semibold text-lg">Feature name</h3>
    <p className="text-sm opacity-70 mt-1">Short description of the feature.</p>
  </div>
</Card>
```

### Reference image in sidebar / aside

```tsx
<div className="flex gap-8">
  <div className="flex-1">
    {/* main content */}
  </div>
  <aside className="w-64 shrink-0">
    <img
      src={referenceImage}
      alt="Visual reference"
      className="w-full rounded-lg border border-[var(--background/neutral)]"
    />
    <p className="text-xs opacity-50 mt-2">Reference image</p>
  </aside>
</div>
```

---

---

## 3. Pipeline Figma Asset Enrichment

When the pipeline brief lists assets with Figma coordinates:

```
# Available assets
- nc-ref-1 → public/nc-ref-1.png  [figma: fileKey=StkUOHcGRMDXOZWT0E2nft nodeId=1:2311]
- nc-ref-2 → public/nc-ref-2.png  [figma: fileKey=StkUOHcGRMDXOZWT0E2nft nodeId=1:2312]
```

the images are already on disk — but slug names alone do not tell you what each frame depicts. **Before writing any layout code, enrich your understanding of each asset by reading its Figma source description.**

### Step 1 — Enumerate all components from the reference catalog

Call `get_design_context` on the file root to retrieve every frame with its description. The POC illustration reference catalog always lives at:

- **fileKey**: `StkUOHcGRMDXOZWT0E2nft`
- **root nodeId**: `0:1`

```
mcp__plugin_figma_figma__get_design_context(
  fileKey: "StkUOHcGRMDXOZWT0E2nft",
  nodeId: "0:1"
)
```

This returns the full component tree. For each frame, extract:
- `id` — the node ID (matches the `nodeId` in the brief)
- `name` — the frame name in Figma
- `description` — the text field on the component; this is the semantic label

### Step 2 — Match each brief asset to its description

For each `[figma: nodeId=X]` in the brief, find the component where `id === X` in the `get_design_context` response. Build a lookup table:

| Asset slug | nodeId | Description text | Keywords extracted |
|-----------|--------|-----------------|-------------------|
| nc-ref-1 | 1:2311 | e.g. `"main dashboard, file list view"` | dashboard, overview, list |
| nc-ref-2 | 1:2312 | e.g. `"AI suggestion sidebar panel"` | AI, sidebar, panel, detail |
| nc-ref-3 | 1:2313 | e.g. `"task completion badge, status notification"` | completion, badge, notification |
| nc-ref-4 | 1:2314 | e.g. `"file upload progress card"` | upload, progress, card, step |

If a node has no description, fall back to the frame `name`; if that is also uninformative, treat it as a generic secondary panel.

### Step 3 — Classify assets into layout roles

Map description keywords to composition roles using these rules:

| Keywords in description | Layout role | Placement |
|------------------------|-------------|-----------|
| `overview`, `dashboard`, `main`, `workspace`, `home` | **Hero panel** — largest slot; 55–65% canvas width as the central content area | Center or right-center |
| `panel`, `sidebar`, `detail`, `AI`, `assistant` | **Secondary panel** — floats beside or below the hero | Floating left or overlay |
| `badge`, `notification`, `alert`, `completion`, `status`, `done` | **Pop-out notification** — small, top-right or bottom-left, animates in last | Absolute, outside frame edge |
| `step`, `wizard`, `card`, `upload`, `progress`, `form` | **Inline card image** — embedded inside a glass card with bar caption below | Inside content grid |
| `logo`, `brand`, `header`, `nav` | **Nav / header asset** — use in the device-frame nav bar area | Top strip |

When a description contains keywords from multiple categories, use the first match in the priority order above.

### Step 4 — Compose and animate

Use `<Img src={staticFile('slug.png')} />` (never plain `<img>`) for all pipeline assets. Apply the staggered reveal sequence below to create progressive disclosure:

```
Frame  0–20:   Hero panel — fade in + subtle scale 0.96→1
Frame 20–40:   Secondary panel — slide in from left (translateX -48→0)
Frame 38–58:   Inline card — slide up from below (translateY 32→0)
Frame 55–75:   Pop-out notification — fly in from right edge (translateX 72→0)
```

```tsx
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig, Easing, staticFile } from 'remotion';

// Inside composition:
const frame = useCurrentFrame();

// Hero panel
const heroOpacity  = interpolate(frame, [0, 20],  [0, 1],  { extrapolateRight: 'clamp' });
const heroScale    = interpolate(frame, [0, 20],  [0.96, 1], { extrapolateRight: 'clamp' });

// Secondary panel
const panel2X      = interpolate(frame, [20, 40], [-48, 0], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});
const panel2Op     = interpolate(frame, [20, 36], [0, 1],  { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// Inline card
const cardY        = interpolate(frame, [38, 58], [32, 0],  {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});
const cardOp       = interpolate(frame, [38, 54], [0, 1],  { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// Notification pop-out
const notifX       = interpolate(frame, [55, 75], [72, 0],  {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});
const notifOp      = interpolate(frame, [55, 68], [0, 1],  { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
```

**Hero panel layout:**
```tsx
<div style={{
  borderRadius: 12, overflow: 'hidden',
  boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
  border: '1px solid rgba(255,255,255,0.10)',
  opacity: heroOpacity,
  transform: `scale(${heroScale})`,
}}>
  <Img src={staticFile('nc-ref-1.png')} style={{ width: '100%', display: 'block' }} />
</div>
```

**Secondary floating panel:**
```tsx
<div style={{
  borderRadius: 12, overflow: 'hidden',
  boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
  border: '1px solid rgba(255,255,255,0.10)',
  width: 280,
  transform: `translateX(${panel2X}px)`,
  opacity: panel2Op,
}}>
  <Img src={staticFile('nc-ref-2.png')} style={{ width: '100%', display: 'block' }} />
</div>
```

**Inline card with caption bars:**
```tsx
<div style={{ ...glassCard, overflow: 'hidden', padding: 0, transform: `translateY(${cardY}px)`, opacity: cardOp }}>
  <Img src={staticFile('nc-ref-4.png')} style={{ width: '100%', display: 'block', borderRadius: '12px 12px 0 0' }} />
  <div style={{ padding: '14px 18px' }}>
    <Bar w="68%" h={10} op={0.25} />
    <div style={{ marginTop: 8 }}><BarGroup lines={2} op={0.14} /></div>
  </div>
</div>
```

**Pop-out notification (absolute, outside device frame):**
```tsx
<div style={{
  position: 'absolute', top: 32, right: -28, zIndex: 20,
  borderRadius: 12, overflow: 'hidden',
  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.12)',
  width: 220,
  transform: `translateX(${notifX}px)`,
  opacity: notifOp,
}}>
  <Img src={staticFile('nc-ref-3.png')} style={{ width: '100%', display: 'block' }} />
</div>
```

### Variant differentiation with figmaRefs

When `variants > 1`, create variation by reordering which asset occupies which role — not by changing the animation timing:

- **v1**: standard order (hero = overview, pop-out = notification)
- **v2**: swap secondary and inline-card roles; offset the pop-out to bottom-left instead of top-right
- **v3+**: reverse stagger direction (hero enters from right; panels enter from above)

Do this via `variantInputProps` in the manifest, e.g. `{ variantId: 'v2', popOutSide: 'bottom-left', panelFromRight: true }`, and read those props in the composition.

### Rules for pipeline Figma assets

- Call `get_design_context` **once** at the start; do not call it again per-asset or per-frame
- Never call Figma MCP inside Remotion component render functions — asset lookup is a codegen-time step, not a runtime step
- If `get_design_context` times out or returns an error, fall back to positional inference: first asset = hero, middle assets = panels, last asset = pop-out
- All assets are pre-downloaded to `public/` — do not attempt to download or fetch them in the Remotion code

---

## Fallback When No Image Is Provided

When the user hasn't provided an image but the layout needs one, use a placeholder div styled with brand tokens:

```tsx
<div
  className="w-full h-64 rounded-lg flex items-center justify-center"
  style={{ background: 'var(--brand/ionos-blue-900)' }}
>
  <Icon group="system" name="image" size={48} className="opacity-30" />
  <span className="text-sm opacity-40 ml-2">Image placeholder</span>
</div>
```

This keeps the wireframe visually honest about where an image belongs without requiring the user to provide one immediately.
