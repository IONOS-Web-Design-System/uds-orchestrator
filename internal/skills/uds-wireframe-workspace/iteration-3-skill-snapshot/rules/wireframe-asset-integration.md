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
