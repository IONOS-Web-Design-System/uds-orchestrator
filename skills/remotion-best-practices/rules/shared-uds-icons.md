# UDS icons in Remotion — use the svgData inline approach (always applies)

**Do NOT use UDS icon inject functions or CSS class names in Remotion compositions.**
Both approaches depend on CSS being injected at runtime — inject functions call
`document.createStyleSheet()` per frame (causes jitter), and CSS file imports are
processed by loaders that may mangle the base64 `url("data:...")` mask-image values.
Neither is reliable in Remotion's headless renderer.

**Use the `svgData` inline approach instead.** Every UDS icon module exports a `svgData`
property (a `data:image/svg+xml;base64,…` URI). Import it directly and apply it via
React inline styles — no CSS, no loaders, deterministic on every frame.

## The one correct import form

```tsx
import { svgData as arrowTopSvg }   from '@ionos-web-design-system/icon/system/arrow-top';
import { svgData as ionosLightSvg } from '@ionos-web-design-system/icon/brandmark/ionos-light';
```

`@ionos-web-design-system/icon/<group>/<file>`. **Never insert `dist/`** and **never put
`@ts-ignore` above an icon import.** The `dist/` sub-path is not in the package's exports
map, so it fails the TSC gate with `TS2307` — and the `@ts-ignore` that silences that error
also switches off the only check that catches a misspelled icon name, letting it through to
fail later as `Module not found` inside the render bundle. If TypeScript complains about an
icon import, the **name or the path is wrong** — fix it, never suppress it.

## Which icon names exist

The `# Icon name index` section of this prompt lists **every** name in the installed
package, per group, with each group's file-name form. It is generated from the package
itself, so anything listed there resolves. Nothing outside it exists.

**When the brief names a brand product icon for a concept** — e.g. "the brand product icon
for automated cloud backups" — resolve that concept to a real name in the `# Icon name
index` and render it full-colour per the brand tier below. The brief names concepts, not
file names, because the planner has no name list. If no name in the index genuinely matches
the concept, compose from `system/` glyphs and shapes instead — never invent a name.

**The package artwork wins over any appearance description.** If the same brief also
describes how the icon should look (a shape, a layout, a "styled as …"), that description is
stale — it predates resolving the concept to a real icon. Render the resolved icon exactly as
the package ships it; do not redraw, restyle, or recompose it from the brief's wording.

## Two tiers, no overlap

| Tier | Use for | Rendering |
|---|---|---|
| `system/` | affordances, controls, status, inline UI markers | mono SVG mask, colour via `backgroundColor` |
| `<brand>/` | the product, service or feature the asset is **about** | full-colour `backgroundImage`, no colour override |

A nav chevron is never a brand icon. A "Cloud Backup" feature motif is never a grey
`system/cloud`. The boundary is role, not size.

**System icons** — monochrome mask; colour controlled via `backgroundColor`:
```tsx
<div style={{
  display: 'inline-block', width: 24, height: 24,
  backgroundColor: '#ffffff',            // icon colour
  WebkitMaskImage: `url(${arrowTopSvg})`, maskImage: `url(${arrowTopSvg})`,
  WebkitMaskSize: 'contain', maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center', maskPosition: 'center',
}} />
```

**Full-colour icons** (brand product icons, brandmark logos, social glyphs) — no colour
override; the SVG carries its own fills:
```tsx
import { svgData as cloudMigrationSvg } from '@ionos-web-design-system/icon/ionos/cloud-migration-light';

<div style={{
  display: 'inline-block', width: 64, height: 64,
  backgroundImage: `url(${cloudMigrationSvg})`,
  backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center',
}} />
```

**File-name form** is per group and is stated in the `# Icon name index` — some groups take
no suffix, some take a `-light`/`-dark` pair to match `colorScheme`, and some take a single
fixed suffix. Read it there; do not assume a light/dark pair exists.

For third-party brand logos with no glyph in the `social` group — WEB.DE, GMX, Outlook,
Magento, WooCommerce, IONOS eShop — use the catalog assets surfaced in `# Available assets`,
not this package.

**Do NOT import the CSS files** (`system.css`, `brandmark.css`) — they are not needed
with this approach and will be ignored or mangled by the preview bundler.
