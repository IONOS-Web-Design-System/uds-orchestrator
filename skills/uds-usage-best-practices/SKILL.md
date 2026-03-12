---
name: uds-usage-best-practices
description: >
  Comprehensive reference for implementing UIs with the UDS (Universal Design System).
  Use when the user asks to build, implement, or code a UI using UDS components,
  look up component usage, understand design tokens, or when the user mentions UDS,
  design system components, or theming. Also use when translating Figma designs to
  UDS React code, verifying implementations against Figma, debugging theme or token
  issues, or whenever "@ionos-web-design-system" appears in code. Triggers on mentions
  of ThemeProvider, ThemeInverter, Surface, design tokens, spacing tokens, or
  multi-brand theming. Does NOT trigger on project setup — see uds-project-setup.
---

# UDS Usage Best Practices

Comprehensive reference for implementing UIs with the UDS (Universal Design System).
UDS is a token-driven, multi-brand design system supporting 8 brands, 2 platforms,
and 2 color schemes (32 theme combinations). All visual properties adapt automatically
when theme attributes change.

## 1. Reading Order

1. **Read this file first** — critical rules, MCP tools, and quick references.
2. **For each component**, read its rule file: `rules/react-{kebab-name}.md`
3. **For tokens**: `rules/core-*.md`
   - `rules/core-semantic-tokens.md` — color, spacing overview, radius
   - `rules/core-spacing-tokens.md` — full spacing table with px values
   - `rules/core-corner-radius.md` — corner radius tokens and decision tree
   - `rules/core-gradient-tokens.md` — gradient tokens, directions, and advanced usage
   - `rules/core-action-utilities.md` — action interaction utilities (hover/active compound classes)
4. **For icons**: `rules/icon-groups.md` and `rules/core-icon-name-lookup.md`
5. **For Shop-UI organisms**: `rules/shop-ui-*.md`
6. **For Figma-to-code workflow** (token mapping, asset handling, custom components): `rules/workflow-figma-to-code.md`
7. **For post-build verification** (checklist, Playwright MCP snippets): `rules/workflow-verification.md`

## 2. Critical Rules

### ALWAYS

- Use UDS React components — never rebuild from raw HTML/CSS.
- Map every design element to a UDS React component whenever possible. If no matching
  UDS component exists, implement a custom component using UDS design tokens primarily.
- Read the component's rule file before using it in code (see section 4 for paths).
- For bullet lists and rich text content, primarily use the `Text` component with
  markdown string syntax — it automatically renders ordered lists (`1. ...`) as
  `BulletIndex`, unordered lists with `[c]` marker (`- [c] ...`) as `BrandCheckmark`,
  and plain unordered lists (`- ...`) as styled bullets. See section 6 for examples.
- For brand logo assets, do NOT use the `Icon` component — brand logos need
  exact Figma dimensions, not icon sizing. Instead, wrap a native `<img>` tag
  inside a `<div>` container sized to match the Figma design. Import the SVG
  from the `brandmark` icon group (`@ionos-web-design-system/icon/brandmark`)
  and choose the Light/Dark variant matching the active color scheme (e.g.,
  `ionosLight` for light mode, `ionosDark` for dark mode). See
  `rules/workflow-figma-to-code.md` (Category 4).
- Import core brand CSS, platform CSS, and `'@ionos-web-design-system/react/style.css'`
  in the **CSS entry file** (e.g., `index.css`), never in `App.tsx` or any JS/TS file.
- Wrap all output in `<ThemeProvider>`.
- Use UDS token classes for all colors, spacing, and borders.
- Use the `Text` component with `asChild` for all styled text (headings, body, inline).
- Use the border double-dash convention in Tailwind v4: `border--base`, not `border-base`.
- Verify icon names against `icon-names.json` before importing — NEVER guess.
  See `rules/core-icon-name-lookup.md` for inline lists and the lookup procedure.
- Pass icon inject functions directly to `icon` props as references: `icon={plus}`.
- Use `Button` or `Link` with `asChild` for all anchor (`<a>`) elements; apply all
  styling on the component itself, never on the `<a>` child:
  ```tsx
  // Correct
  <Button concept="brand" asChild><a href="/signup">Get Started</a></Button>

  // Wrong
  <Button asChild><a href="/signup" className="text-brand-primary">Get Started</a></Button>
  ```
- Use `ThemeInverter` to wrap any section/card that has a visually inverted color mode
  (e.g., dark sections on a light page). Never manually apply dark surface colors to
  simulate visual inversion. See section 8.
- Set text color only via the `color` prop on the `Text` component — never on child
  elements inside `asChild`.
- Use the `Price` component for all pricing displays — never build price layouts
  manually. See `rules/react-price.md`.
- Use `AspectRatio` for all **raster** images/media from Figma (photos,
  screenshots, PNGs, JPGs) — never raw `<img>` tags for raster assets. Match
  the `ratio` prop to the Figma frame's proportions and verify size accuracy
  after implementation. See `rules/react-aspect-ratio.md`.
- For vector SVG assets NOT in the UDS icon package (illustrations, decorative
  graphics), download the SVG from Figma and use inline SVG or `<img>` per
  the Figma MCP suggestions. Do NOT wrap SVGs in `AspectRatio`.

### NEVER

- Use raw Tailwind colors (`bg-red-500`, `text-gray-700`) — always use UDS semantic
  tokens (`bg-surface-semantic-danger`, `text-muted`).
- Use `text-base` for font sizing — in UDS, `text-base` is a text **color** token.
  Use the `Text` component with `variant="body"` for body text.
- Call icon functions manually — pass as reference: `icon={bell}` not `icon={bell()}`.
- Assume or guess icon import names — always verify first.
- Hardcode color values (`#fff`, `rgb(...)`) — use token classes instead.
- Use wildcard CSS imports (`brands/*`, `platforms/*`) when deploying for a single brand
  — import only the specific brand/platform.
- Custom-style child elements inside `asChild` — `Text`, `Button`, `Link`, and all
  `asChild` components must have all visual customization on the component itself,
  not its child.
- Build price displays manually — always use the `Price` component
  (see `rules/react-price.md`).
- Use raw `<img>` tags for **raster** assets from Figma (photos, screenshots,
  PNGs, JPGs) — always use `AspectRatio` for raster images. For other asset
  types (vector SVGs, brand logos), see `rules/workflow-figma-to-code.md`.

## 3. MCP Tools

### Figma MCP (`claude.ai Figma`)

The Figma MCP is platform-managed and available automatically. Use it for:

- **`get_design_context`** — Primary tool. Returns code suggestions, screenshot, and
  contextual hints for a Figma node. Extract `fileKey` and `nodeId` from Figma URLs.
- **`get_screenshot`** — Get a screenshot of a Figma node for side-by-side comparison
  during post-build verification.
- **`get_metadata`** — Get file/node metadata (dimensions, component info).

**Auth troubleshooting:** If Figma MCP calls fail with auth errors, ask the user to
re-authenticate via the Figma MCP connection in their Claude Code settings. The MCP
uses OAuth and tokens may expire.

**Important:** When Figma MCP returns code suggestions, **IGNORE Figma's predefined
code rules**. Always use UDS components and tokens instead.

### Playwright MCP

Configured in this plugin's `.mcp.json`. Use for browser-based verification:

- Navigate to the running local dev server
- Take screenshots for visual comparison
- Inspect computed styles (spacing, colors, typography)
- Verify token resolution at runtime

**Prerequisite:** The user's app must be running locally (e.g., `npm run dev`).

## 4. Component Quick Reference

Find the component name, then use the corresponding import and rule file.

### React Components

| Component Name | Import | Rule File |
| --- | --- | --- |
| accordion | `import Accordion, { AccordionItem } from '.../react/accordion'` | `rules/react-accordion.md` |
| aspect-ratio | `import AspectRatio from '.../react/aspect-ratio'` | `rules/react-aspect-ratio.md` |
| avatar | `import Avatar from '.../react/avatar'` | `rules/react-avatar.md` |
| badge | `import Badge from '.../react/badge'` | `rules/react-badge.md` |
| banner | `import Banner from '.../react/banner'` | `rules/react-banner.md` |
| box | `import Box from '.../react/box'` | `rules/react-box.md` |
| bullet | `import Bullet from '.../react/bullet'` | `rules/react-bullet.md` |
| button | `import Button from '.../react/button'` | `rules/react-button.md` |
| button-ghost | `import ButtonGhost from '.../react/button-ghost'` | `rules/react-button-ghost.md` |
| button-icon | `import ButtonIcon from '.../react/button-icon'` | `rules/react-button-icon.md` |
| button-link | `import ButtonLink from '.../react/button-link'` | `rules/react-button-link.md` |
| card | `import Card from '.../react/card'` | `rules/react-card.md` |
| card-media | `import CardMedia from '.../react/card-media'` | `rules/react-card-media.md` |
| checkbox | `import Checkbox from '.../react/checkbox'` | `rules/react-checkbox.md` |
| content-tabs | `import ContentTabs from '.../react/content-tabs'` | `rules/react-content-tabs.md` |
| disclosure | `import Disclosure from '.../react/disclosure'` | `rules/react-disclosure.md` |
| divider | `import Divider from '.../react/divider'` | `rules/react-divider.md` |
| domain-badge | `import DomainBadge from '.../react/domain-badge'` | `rules/react-domain-badge.md` |
| domain-search-bar | `import DomainSearchBar from '.../react/domain-search-bar'` | `rules/react-domain-search-bar.md` |
| dropdown | `import Dropdown from '.../react/dropdown'` | `rules/react-dropdown.md` |
| dropdown-item | `import DropdownItem from '.../react/dropdown-item'` | `rules/react-dropdown-item.md` |
| icon | `import Icon from '.../react/icon'` | `rules/react-icon.md` |
| label | `import Label from '.../react/label'` | `rules/react-label.md` |
| pill | `import Pill from '.../react/pill'` | `rules/react-pill.md` |
| price | `import Price from '.../react/price'` | `rules/react-price.md` |
| progress | `import Progress from '.../react/progress'` | `rules/react-progress.md` |
| radio-group | `import RadioGroup from '.../react/radio-group'` | `rules/react-radio-group.md` |
| select-group | `import SelectGroup from '.../react/select-group'` | `rules/react-select-group.md` |
| surface | `import Surface from '.../react/surface'` | `rules/react-surface.md` |
| switch | `import Switch, { SwitchThumb, SwitchLabel } from '.../react/switch'` | `rules/react-switch.md` |
| tabs | `import Tabs from '.../react/tabs'` | `rules/react-tabs.md` |
| text | `import Text from '.../react/text'` | `rules/react-text.md` |
| theme-inverter | `import ThemeInverter from '.../react/theme-inverter'` | `rules/react-theme-inverter.md` |
| theme-provider | `import ThemeProvider from '.../react/theme-provider'` | `rules/react-theme-provider.md` |
| tooltip | `import Tooltip from '.../react/tooltip'` | `rules/react-tooltip.md` |
| visually-hidden | `import VisuallyHidden from '.../react/visually-hidden'` | `rules/react-visually-hidden.md` |

> **Note:** `...` = `@ionos-web-design-system` in all imports above.

### Shop-UI Components

| Component Name | Import | Rule File |
| --- | --- | --- |
| module-wrapper | `import ModuleWrapper from '.../shop-ui/module-wrapper'` | `rules/shop-ui-module-wrapper.md` |
| table-card-tariff | `import TableCardTariff from '.../shop-ui/table-card-tariff'` | `rules/shop-ui-table-card-tariff.md` |

> **Note:** `...` = `@ionos-web-design-system` in all imports above.

Shop-UI requires peer dependencies: `@ionos-web-design-system/core` and
`@ionos-web-design-system/react`. Import its stylesheet:

```css
@import '@ionos-web-design-system/shop-ui/style.css';
```

## 5. Token Quick Reference

### Variable Name Translation

Replace `/` separators with `-` to get the CSS variable name:

```
Token path                     CSS variable                       Tailwind class
surface/base                   --surface-base                     bg-surface-base
surface/semantic/ai            --surface-semantic-ai              bg-surface-semantic-ai
surface/semantic/danger-bolder --surface-semantic-danger-bolder   bg-surface-semantic-danger-bolder
text/subtle                    --text-subtle                      text-subtle
text/muted                     --text-muted                       text-muted
border/base                    --border-base                      border--base (double-dash!)
border/semantic/danger         --border-semantic-danger           border--semantic-danger (double-dash!)
space/4                        --space-4                          p-4, gap-4, m-4  (no alias — Tailwind v4 resolves directly)
gap/4                          --gap-4                            p-gap-4, gap-gap-4, m-gap-4  (requires 'gap' alias)
rounded/md                     --rounded-md                       rounded-md
ai-primary-start               --color-ai-primary-start           from-ai-primary-start (gradient stop)
ai-primary-end                 --color-ai-primary-end             to-ai-primary-end (gradient stop)
gradient-start                 --color-gradient-start             from-gradient-start (gradient stop)
gradient-end                   --color-gradient-end               to-gradient-end (gradient stop)
```

### Category to Tailwind Prefix

| Token Category | Tailwind Prefix      | Usage                                            |
| -------------- | -------------------- | ------------------------------------------------ |
| `surface/...`  | `bg-{rest}`          | Backgrounds                                      |
| `text/...`     | `text-{rest}`        | Text COLORS (not font sizes!)                    |
| `border/...`   | `border--{rest}`     | Border colors (double-dash in Tailwind v4)       |
| `space/...`    | `p-{n}`, `m-{n}`, `gap-{n}` | Padding, margin, flex/grid gaps          |
| `gap/...`      | `p-gap-{n}`, `m-gap-{n}`, `gap-gap-{n}` | Small decorative spacing  |
| `rounded/...`  | `rounded-{rest}`     | Border radius                                    |
| `typo/...`     | Use Text component   | Font sizing (via Text variant prop)              |
| `color/ai-*`   | `from-{name}`, `to-{name}` | Gradient color stops                        |
| `font/...`     | `font-{rest}`        | Font families                                    |

**Important:** The `text/` category maps to text **colors**, not font sizes.
For typography, always use the `Text` component (see section 6).

### Border Double-Dash Convention

In Tailwind v4, border color classes use a **double-dash** (`--`):

```
CORRECT:  border--base          border--semantic-danger      border--bolder
WRONG:    border-base           border-semantic-danger       border-bolder
```

Always pair the border color class with a `border` width utility:

```tsx
<div className="border border--base">              {/* 1px base border */}
<div className="border-2 border--semantic-danger">  {/* 2px danger border */}
```

**Tailwind v3 note:** In v3 projects using the UDS plugin, borders use single-dash
(`border-base`). Only v4 requires double-dash.

> For Token Naming Convention details, see `rules/core-semantic-tokens.md`.

## 6. Typography

### Text Component Decision Tree

```
Styled text detected -->
  1. ALWAYS use <Text variant="..." weight="..." color="..."> for styled text
  2. Use asChild to render the correct semantic HTML element:
     - Headings   --> <Text variant="heading5xl" asChild><h1>...</h1></Text>
     - Paragraphs --> <Text variant="body" asChild><p>...</p></Text>
     - Inline     --> <Text variant="bodySm" asChild><span>...</span></Text>
  3. Only use raw text color tokens (text-subtle, text-muted) when
     Text component is unsuitable or unavailable
```

### Color Prop

| Visual Appearance       | Text `color` prop |
| ----------------------- | ----------------- |
| Default/primary text    | `default` or omit |
| Base text               | `base`            |
| Muted/secondary text    | `muted`           |
| Subtle/tertiary text    | `subtle`          |
| Warning text            | `warning`         |
| Promotional text        | `promotion`       |
| Error/danger text       | `destructive`     |
| Accent/highlight text   | `accent`          |
| AI-themed text          | `ai`              |

### Lists and Rich Text via Text Markdown

Use the `Text` component with markdown strings for bullet lists:

```tsx
{/* Ordered lists → BulletIndex */}
<Text variant="body">{`
1. Create your account
2. Choose your plan
3. Start building
`}</Text>

{/* Brand checkmarks → use [c] marker */}
<Text variant="body">{`
- [c] Free SSL certificate
- [c] 24/7 support
`}</Text>

{/* Plain unordered lists → styled bullets */}
<Text variant="body">{`
- Feature one
- Feature two
`}</Text>
```

> For variant mapping table and full examples, see `rules/react-text.md`.

## 7. Icons

### Available Groups

| Group     | Import Path                               | Content               |
| --------- | ----------------------------------------- | --------------------- |
| system    | `@ionos-web-design-system/icon/system`    | UI action icons       |
| social    | `@ionos-web-design-system/icon/social`    | Social media logos    |
| ionos     | `@ionos-web-design-system/icon/ionos`     | IONOS product icons   |
| brandmark | `@ionos-web-design-system/icon/brandmark` | Brand logos           |
| flags     | `@ionos-web-design-system/icon/flags`     | Country flags         |
| fasthosts | `@ionos-web-design-system/icon/fasthosts` | Fasthosts brand icons |
| homepl    | `@ionos-web-design-system/icon/homepl`    | Home.pl brand icons   |
| strato    | `@ionos-web-design-system/icon/strato`    | Strato brand icons    |
| checkmark | `@ionos-web-design-system/icon/checkmark` | Checkmark variants    |

Pass icon inject functions as **references** — `icon={plus}` not `icon={plus()}`.
Import only the icons you need from a specific group for tree-shaking. Do NOT
use the `Icon` component for brand logos (see `rules/workflow-figma-to-code.md`
Category 4).

> For naming conventions, size map, and detailed rules, see `rules/react-icon.md`
> and `rules/icon-groups.md`.

## 8. Theme Variants

UDS provides custom Tailwind variants for theme-aware conditional styling:

- **Brand variants:** `ionos:`, `strato:`, `fasthosts:`, `homepl:`, `strefa:`, `udag:`, `world4you:`, `arsys:`
- **Platform variants:** `comfortable:`, `compact:`
- **Color scheme variants:** `light:`, `dark:`

**Warning:** The `dark:` variant intentionally overrides Tailwind's built-in dark mode.
It only works with `data-color-scheme="dark"` attribute, NOT `@media (prefers-color-scheme: dark)`.

Use `ThemeInverter` for sections that must appear in the opposite color scheme.
Use `forceColorScheme="dark"` for sections that must always be dark. Never manually
apply dark surface classes to create visual inversion.

> For code examples and `forceColorScheme` details, see `rules/react-theme-inverter.md`
> and `rules/core-tailwind-variants.md`.

## 9. Common Mistakes

| WRONG | CORRECT | Why |
| --- | --- | --- |
| `bg-red-500` | `bg-surface-semantic-danger` | Never use raw Tailwind colors — use UDS semantic tokens |
| `text-base` (for font size) | `<Text variant="body">` | `text-base` is a text COLOR token in UDS, not a font size |
| `border-base` | `border--base` | Double-dash required in Tailwind v4 |
| `#ffffff` or `#fff` | `bg-surface-base` | Never hardcode color values |
| `text-gray-500` | `text-muted` or `text-subtle` | Use UDS text color tokens |
| `icon={bell()}` | `icon={bell}` | Pass inject function as reference, don't call it |
| `<h1 className="text-4xl font-bold">` | `<Text variant="heading5xl" weight="bold" asChild><h1>...</h1></Text>` | Use Text component for all typography |
| `<div className="dark:bg-black">` | `<div className="dark:bg-surface-base">` | UDS `dark:` variant uses `data-color-scheme`, not media queries |
| Omitting `<ThemeProvider>` | Wrapping in `<ThemeProvider>` | Required for all UDS components to function |
| Missing style import | `@import '.../react/style.css'` in CSS entry file | Required for component styles to load |
| `<Text asChild><h1 className="text-accent">...</h1></Text>` | `<Text color="accent" asChild><h1>...</h1></Text>` | Always put Text color on the Text component |
| `<Text asChild><span className="uppercase">...</span></Text>` | `<Text className="uppercase" asChild><span>...</span></Text>` | All styling on the component, not child |
| `<Button asChild><a className="text-brand-primary" href="/">Go</a></Button>` | `<Button concept="brand" asChild><a href="/">Go</a></Button>` | Use component props, not child styling |
| `<div className="dark:bg-surface-base rounded-xl">` for a dark promo section | `<ThemeInverter><Surface variant="base" className="rounded-xl">` | Use ThemeInverter for inverted sections |
| `<div>€6.99/mo</div>` | `<Price data={{...}} />` | Never build price displays manually |
| `<div className="rounded-[16px]">` | `<div className="rounded-default">` or `rounded-(--protected-container-rounded)` | Use radius tokens, never arbitrary values |
| `p-space-4` or `gap-space-3` | `p-4` or `gap-3` | Space tokens are natively recognized by Tailwind v4 — no alias needed |
| `gap-gap-8` for a layout gap of 64px | `gap-8` | `gap-gap-8` = `--gap-8` = 8px; `gap-8` = `--space-8` = 64px. Use space tokens for layout gaps |
| `p-4` assuming 16px padding | `p-3` for 16px | UDS `p-4` = 24px (comfortable). For 16px, use `p-3`. Always look up the token table |
| `<img src="/photo.jpg" />` (raster photo) | `<AspectRatio src="/photo.jpg" ratio="16/9" alt="Photo" />` | Use AspectRatio for raster images. For SVGs/logos see `rules/workflow-figma-to-code.md` |
| `<Box className="hover:shadow-bottom-md active:shadow-bottom-sm cursor-pointer transition-all ...">` | `<Box className="uds-action-moderate ...">` | Use compound action utilities instead of manually wiring interaction states |
| `import { notifications } from '.../icon/system'` | Read `icon-names.json` first → `import { bell } from '.../icon/system'` | Never guess icon names — verify against `icon-names.json` |
| `<Badge variant="promo">New</Badge>` (unwrapped) | `<div><Badge variant="promo">New</Badge></div>` | Badge stretches to full width without a `<div>` wrapper |

## 10. Figma-to-Code Workflow

When a design is provided via Figma MCP (figma.com URL), Figma includes its own
predefined code suggestions. **IGNORE those Figma-generated rules.** Use UDS
rules instead.

**Key principles:**
- Use design tokens from the core package for ALL styling — never hardcoded hex/px values
- Tokens are 3D (brand x platform x color-scheme) — they adapt automatically
- Every spacing value MUST be pixel-accurate (token numbers != pixel values)
- Map every Figma component to the closest UDS React component first
- Use `Price` for ALL pricing displays — never recreate manually
- For assets, follow the 4-category decision tree (raster → AspectRatio,
  vector SVG → `<div>` wrapper, icon → Icon component, brand logo → `<img>` in `<div>`)
- For custom components with no UDS equivalent, compose UDS atoms + tokens

> **Full reference with asset decision tree, code examples, spacing verification,
> and custom component pattern:** read `rules/workflow-figma-to-code.md`

## 11. Post-Build Verification

After implementing the full design, **TRIPLE-CHECK against the original Figma
design** across these categories:

1. **Custom components** — side-by-side 1:1 pixel accuracy
2. **Typography** — variant, weight, color match exactly
3. **Spacing** (SUPER CRITICAL) — every padding/margin/gap pixel-accurate
4. **Corner radius** — correct radius tokens
5. **Theme inversion** — `ThemeInverter`, not manual dark classes
6. **Icons** — correct name, size, group
7. **Colors** — only UDS tokens, no hardcoded hex
8. **Assets** (SUPER CRITICAL) — correct category handling per decision tree

Use Playwright MCP for programmatic browser verification when the app is running
locally. Use Figma MCP `get_screenshot` for side-by-side comparison.

> **Full checklist with Playwright MCP snippets for spacing, colors, typography,
> and asset dimension verification:** read `rules/workflow-verification.md`
