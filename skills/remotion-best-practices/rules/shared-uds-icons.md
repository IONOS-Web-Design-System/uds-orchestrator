# UDS icons in Remotion — use the svgData inline approach (always applies)

**Do NOT use UDS icon inject functions or CSS class names in Remotion compositions.**
Both approaches depend on CSS being injected at runtime — inject functions call
`document.createStyleSheet()` per frame (causes jitter), and CSS file imports are
processed by loaders that may mangle the base64 `url("data:...")` mask-image values.
Neither is reliable in Remotion's headless renderer.

**Use the `svgData` inline approach instead.** Every UDS icon module exports a `svgData`
property (a `data:image/svg+xml;base64,…` URI). Import it directly and apply it via
React inline styles — no CSS, no loaders, deterministic on every frame.

Import from the individual module path (bypasses the barrel's inject-function-only exports):
```tsx
// @ts-ignore — deep import for svgData; exportsFields is disabled in the render pipeline
import { svgData as arrowTopSvg } from '@ionos-web-design-system/icon/dist/system/arrow-top';
// @ts-ignore
import { svgData as ionosLightSvg } from '@ionos-web-design-system/icon/dist/brandmark/ionos-light';
```

**System icons** — monochrome SVG mask; colour controlled via `backgroundColor`:
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

**Brandmark logos** — full-colour SVG; no colour override needed:
```tsx
<div style={{
  display: 'inline-block', width: 80, height: 24,
  backgroundImage: `url(${ionosLightSvg})`,
  backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'left center',
}} />
```

**Module path convention** — camelCase inject-function name → kebab-case file name:
`arrowRight` → `/dist/system/arrow-right` | `plus` → `/dist/system/plus` |
`ionosDark` → `/dist/brandmark/ionos-dark` | `ionosLight` → `/dist/brandmark/ionos-light`

**Brand product icons** — full-colour, illustrative product/service icons (richer than the
mono `system/` set). They live in a per-brand directory and ship a `-light`/`-dark` variant
per icon. Import with the colour-scheme suffix that matches the brief's `colorScheme`, and
render like a brandmark (full-colour `backgroundImage`, no colour override):
```tsx
// @ts-ignore — deep import for svgData
import { svgData as cloudMigrationSvg } from '@ionos-web-design-system/icon/dist/ionos/cloud-migration-light';
<div style={{ display: 'inline-block', width: 64, height: 64,
  backgroundImage: `url(${cloudMigrationSvg})`, backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
```
Path: `@ionos-web-design-system/icon/dist/<brand>/<name>-<light|dark>` (brands with a full
set: `ionos`, `strato`, `fasthosts`, `homepl`).

> ⚠️ **Only use icon names from the verified allowlist below.** There are ~428 ionos icons
> but guessing a non-existent name makes the render bundle fail (`Module not found`). If you
> need a concept not on the list, fall back to a monochrome `system/` icon instead.

**Verified `ionos` brand-icon allowlist** (append `-light` or `-dark`):
`account-security`, `data-protection`, `certificate`, `domain-guard`, `cloud-migration`,
`cloud-integration`, `cloud-data-backup`, `cloud-backup-images-snapshots`, `database`,
`container-registry`, `api`, `analytics`, `ai-mail-assistant`, `artificial-intelligence`,
`clean-mailbox`, `customer-relationship-management`, `contact-person`, `contact-lightbulb`,
`ads-search-engine`, `app-advisor`, `always-available`, `domain-generic`, `domain-subdomains`,
`cloud-wordpress-installation`, `cloud-virtual-data-center`, `cloud-disaster-recovery`,
`cloud-deployment`, `cloud-flexibility`.

**Social / third-party platform glyphs** — `@ionos-web-design-system/icon/dist/social/<name>`
(single file, full-colour, no light/dark suffix). Verified names: `apple`, `facebook`,
`github`, `google`, `instagram`, `linkedin`, `rss`, `tiktok`, `wordpress`, `x`, `xing`,
`youtube`, `atlassian-jira`, `atlassian-confluence`, `google-plus`. (For third-party brand
logos NOT in this set — e.g. WEB.DE, GMX, Outlook, Magento, WooCommerce, IONOS eShop — use
the catalog assets surfaced in `# Available assets`, not this glyph set.)

**Verified common `system/` icons** (mono, single file, colour via `backgroundColor`):
`lock`, `lock-open`, `shield`, `bell`, `user`, `cloud`, `globe`, `search`, `star`, `heart`,
`plus`, `link`, `play`, `arrow-top`, `arrow-right`.

**Do NOT import the CSS files** (`system.css`, `brandmark.css`) — they are not needed
with this approach and will be ignored or mangled by the preview bundler.
