# UDS icons in Remotion — svgData inline outside the kit (always applies)

**Inside the UDS kit**, an icon prop (`KitIcon` / `KitIconButton` / `KitButton` `icon`) takes the
icon module's **default** import; the kit injects its CSS once, frame-safe. **Everywhere else**
never use an inject function or icon CSS class (runtime CSS injection jitters or gets mangled in
the headless renderer): import the module's `svgData` (a `data:image/svg+xml;base64,…` URI) and
apply it with inline styles.

## The svgData import form (outside the kit)

```tsx
import { svgData as arrowTopSvg }   from '@ionos-web-design-system/icon/system/arrow-top';
import { svgData as ionosLightSvg } from '@ionos-web-design-system/icon/brandmark/ionos-light';
```

`@ionos-web-design-system/icon/<group>/<file>`. **Never insert `dist/`** (not in the exports
map → `TS2307`) and **never put `@ts-ignore` above an icon import** (it also hides a misspelled
name, which then fails in the render bundle). If TypeScript complains, the name or path is
wrong — fix it.

## Which icon names exist

The `# Icon name index` section of this prompt lists **every** name in the installed
package, per group, with each group's file-name form. Nothing outside it exists.

**When the brief names a brand product icon for a concept** — e.g. "the brand product icon
for automated cloud backups" — resolve that concept to a real name in the `# Icon name
index` and render it full-colour per the brand tier below. If no name in the index genuinely matches
the concept, compose from `system/` glyphs and shapes instead — never invent a name.

**The package artwork wins over any appearance description.** If the same brief also
describes how the icon should look (a shape, a layout, a "styled as …"), that description is
stale. Render the resolved icon exactly as
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

Product / service icon — roughly square, centred:
```tsx
import { svgData as cloudMigrationSvg } from '@ionos-web-design-system/icon/ionos/cloud-migration-light';

<div style={{
  display: 'inline-block', width: 64, height: 64,
  backgroundImage: `url(${cloudMigrationSvg})`,
  backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center',
}} />
```

Brandmark logo — wide logotype: a wide box, left-aligned (never centred in a square box):
```tsx
import { svgData as brandLogoSvg } from '@ionos-web-design-system/icon/brandmark/<name>-light';

<div style={{
  display: 'inline-block', width: 80, height: 24,
  backgroundImage: `url(${brandLogoSvg})`,
  backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'left center',
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
