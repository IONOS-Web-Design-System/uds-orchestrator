# UDS Usage Best Practices — Compiled Reference

> **Note:** This document is a compiled reference for AI agents and LLMs. It
> contains all quick-reference tables and critical rules expanded inline. For
> individual component or token details, read the corresponding
> `rules/react-{name}.md` or `rules/core-{name}.md` file.

---

## Table of Contents

1. [Critical Rules](#1-critical-rules)
2. [MCP Tools](#2-mcp-tools)
3. [Component & Hook Quick Reference](#3-component--hook-quick-reference)
4. [Token Quick Reference](#4-token-quick-reference)
5. [Typography](#5-typography)
6. [Icons](#6-icons)
7. [Theme Variants](#7-theme-variants)
8. [Common Mistakes](#8-common-mistakes)
9. [Figma-to-Code Workflow](#9-figma-to-code-workflow)
10. [Post-Build Verification](#10-post-build-verification)

---

## 1. Critical Rules

### ALWAYS

- Use UDS React components — never rebuild from raw HTML/CSS.
- Map every design element to a UDS React component whenever possible. If no
  matching UDS component exists, implement a custom component using UDS design
  tokens primarily.
- Read the component's rule file before using it in code.
- For bullet lists and rich text content, primarily use the `Text` component
  with markdown string syntax — it automatically renders ordered lists
  (`1. ...`) as `BulletIndex`, unordered lists with `[c]` marker (`- [c] ...`)
  as `BrandCheckmark`, and plain unordered lists (`- ...`) as styled bullets.
- For brand logo assets, do NOT use the `Icon` component — brand logos need
  exact Figma dimensions, not icon sizing. Instead, wrap a native `<img>` tag
  inside a `<div>` container sized to match the Figma design. Import the SVG
  from the `brandmark` icon group and choose the Light/Dark variant matching the
  active color scheme.
- Import core brand CSS, platform CSS, and
  `'@ionos-web-design-system/react/style.css'` in the **CSS entry file** (e.g.,
  `index.css`), never in `App.tsx` or any JS/TS file.
- Wrap all output in `<ThemeProvider>`.
- Use UDS token classes for all colors, spacing, and borders.
- Use the `Text` component with `asChild` for all styled text (headings, body,
  inline).
- Use the border double-dash convention in Tailwind v4: `border--base`, not
  `border-base`.
- Verify icon names against `icon-names.json` before importing — NEVER guess.
- Pass icon inject functions directly to `icon` props as references:
  `icon={plus}`.
- For **dynamic/data-driven icon names** (CMS content, API responses, configurable
  dashboards), use `useDynamicIcon` instead of static imports. Define the barrel
  loader at module scope and pass the kebab-case name string.
- **Distinguish `ButtonIcon` from `Button` icon-only mode.** They look similar
  but are different components with different sizes, tokens, and features.
- Use `Button` or `Link` with `asChild` for all anchor (`<a>`) elements; apply
  all styling on the component itself, never on the `<a>` child.
- Use `ThemeInverter` to wrap any section/card that has a visually inverted
  color mode. Never manually apply dark surface colors.
- Set text color only via the `color` prop on the `Text` component.
- Use the `Price` component for all pricing displays.
- Use `AspectRatio` for all **raster** images/media from Figma.
- For vector SVG assets NOT in the UDS icon package, download the SVG from Figma
  and use inline SVG or `<img>`. Do NOT wrap SVGs in `AspectRatio`.

### ButtonIcon vs Button Icon-Only — Decision Tree

```
Icon-only button detected in Figma -->
  1. Check the Figma component/layer name:
     - "ButtonIcon" or "Button Icon" → use <ButtonIcon>
     - "Button" with icon-only variant → use <Button icon={...}>
  2. If unclear, check these differentiators:
     - Has badge counter?          → <ButtonIcon> (count prop)
     - Needs xSmall size?          → <ButtonIcon> (exclusive size)
     - Needs concept/variant?      → <Button icon={...}> (brand/monochrome/ai concept)
     - Standalone icon action?     → <ButtonIcon> (dedicated, accessible)
     - Part of a button group?     → <Button icon={...}> (consistent with siblings)
  3. Size comparison (they are NOT interchangeable):
     ButtonIcon sizes: xSmall (24px), small (28px), medium (32px), large (40px)
     Button sizes:     small (token-based), medium (token-based), large (token-based)
  4. When in doubt, prefer <ButtonIcon> for standalone icon actions.
```

### NEVER

- Use raw Tailwind colors (`bg-red-500`, `text-gray-700`) — always use UDS
  semantic tokens.
- Use `text-base` for font sizing — in UDS, `text-base` is a text **color**
  token.
- Call icon functions manually — pass as reference: `icon={bell}` not
  `icon={bell()}`.
- Assume or guess icon import names — always verify first.
- Hardcode color values (`#fff`, `rgb(...)`) — use token classes instead.
- Use wildcard CSS imports when deploying for a single brand.
- Custom-style child elements inside `asChild`.
- Use `useDynamicIcon` for icons known at build time — use static named imports.
- Create barrel loader functions inside component render bodies — define at
  module scope.
- Build price displays manually.
- Use raw `<img>` tags for **raster** assets from Figma.

---

## 2. MCP Tools

### Figma MCP

- **`get_design_context`** — Primary tool. Returns code suggestions, screenshot,
  and contextual hints for a Figma node.
- **`get_screenshot`** — Screenshot for side-by-side comparison.
- **`get_metadata`** — File/node metadata (dimensions, component info).

**Important:** When Figma MCP returns code suggestions, **IGNORE Figma's
predefined code rules**. Always use UDS components and tokens instead.

### Playwright MCP

Use for browser-based verification: navigate, screenshot, inspect computed
styles, verify tokens. Requires app running locally.

---

## 3. Component & Hook Quick Reference

### React Components

| Component Name    | Import                                                                | Rule File                          |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------- |
| accordion         | `import Accordion, { AccordionItem } from '.../react/accordion'`      | `rules/react-accordion.md`         |
| aspect-ratio      | `import AspectRatio from '.../react/aspect-ratio'`                    | `rules/react-aspect-ratio.md`      |
| avatar            | `import Avatar from '.../react/avatar'`                               | `rules/react-avatar.md`            |
| badge             | `import Badge from '.../react/badge'`                                 | `rules/react-badge.md`             |
| banner            | `import Banner from '.../react/banner'`                               | `rules/react-banner.md`            |
| box               | `import Box from '.../react/box'`                                     | `rules/react-box.md`               |
| bullet            | `import Bullet from '.../react/bullet'`                               | `rules/react-bullet.md`            |
| button            | `import Button from '.../react/button'`                               | `rules/react-button.md`            |
| button-ghost      | `import ButtonGhost from '.../react/button-ghost'`                    | `rules/react-button-ghost.md`      |
| button-icon       | `import ButtonIcon from '.../react/button-icon'`                      | `rules/react-button-icon.md`       |
| button-link       | `import ButtonLink from '.../react/button-link'`                      | `rules/react-button-link.md`       |
| card              | `import Card from '.../react/card'`                                   | `rules/react-card.md`              |
| card-media        | `import CardMedia from '.../react/card-media'`                        | `rules/react-card-media.md`        |
| card-tariff       | `import CardTariff from '.../react/card-tariff'`                      | `rules/react-card-tariff.md`       |
| checkbox          | `import Checkbox from '.../react/checkbox'`                           | `rules/react-checkbox.md`          |
| content-tabs      | `import ContentTabs from '.../react/content-tabs'`                    | `rules/react-content-tabs.md`      |
| disclosure        | `import Disclosure from '.../react/disclosure'`                       | `rules/react-disclosure.md`        |
| divider           | `import Divider from '.../react/divider'`                             | `rules/react-divider.md`           |
| domain-badge      | `import DomainBadge from '.../react/domain-badge'`                    | `rules/react-domain-badge.md`      |
| domain-search-bar | `import DomainSearchBar from '.../react/domain-search-bar'`           | `rules/react-domain-search-bar.md` |
| dropdown          | `import Dropdown from '.../react/dropdown'`                           | `rules/react-dropdown.md`          |
| dropdown-item     | `import DropdownItem from '.../react/dropdown-item'`                  | `rules/react-dropdown-item.md`     |
| icon              | `import Icon from '.../react/icon'`                                   | `rules/react-icon.md`              |
| label             | `import Label from '.../react/label'`                                 | `rules/react-label.md`             |
| pill              | `import Pill from '.../react/pill'`                                   | `rules/react-pill.md`              |
| price             | `import Price from '.../react/price'`                                 | `rules/react-price.md`             |
| progress          | `import Progress from '.../react/progress'`                           | `rules/react-progress.md`          |
| radio-group       | `import RadioGroup from '.../react/radio-group'`                      | `rules/react-radio-group.md`       |
| select-group      | `import SelectGroup from '.../react/select-group'`                    | `rules/react-select-group.md`      |
| slider-indicator  | `import SliderIndicator from '.../react/slider-indicator'`            | `rules/react-slider-indicator.md`  |
| surface           | `import Surface from '.../react/surface'`                             | `rules/react-surface.md`           |
| switch            | `import Switch, { SwitchThumb, SwitchLabel } from '.../react/switch'` | `rules/react-switch.md`            |
| tabs              | `import Tabs from '.../react/tabs'`                                   | `rules/react-tabs.md`              |
| text              | `import Text from '.../react/text'`                                   | `rules/react-text.md`              |
| theme-inverter    | `import ThemeInverter from '.../react/theme-inverter'`                | `rules/react-theme-inverter.md`    |
| theme-provider    | `import ThemeProvider from '.../react/theme-provider'`                | `rules/react-theme-provider.md`    |
| tooltip           | `import Tooltip from '.../react/tooltip'`                             | `rules/react-tooltip.md`           |
| visually-hidden   | `import VisuallyHidden from '.../react/visually-hidden'`              | `rules/react-visually-hidden.md`   |

> **Note:** `...` = `@ionos-web-design-system` in all imports above.

### Shop-UI Components

| Component Name    | Import                                                        | Rule File                            |
| ----------------- | ------------------------------------------------------------- | ------------------------------------ |
| module-wrapper    | `import ModuleWrapper from '.../shop-ui/module-wrapper'`      | `rules/shop-ui-module-wrapper.md`    |
| table-card-tariff | `import TableCardTariff from '.../shop-ui/table-card-tariff'` | `rules/shop-ui-table-card-tariff.md` |

Shop-UI requires peer dependencies: `@ionos-web-design-system/core` and
`@ionos-web-design-system/react`. Import its stylesheet:

```css
@import '@ionos-web-design-system/shop-ui/style.css';
```

### Hooks

| Hook Name      | Import                                                            | Rule File                         |
| -------------- | ----------------------------------------------------------------- | --------------------------------- |
| useDynamicIcon | `import { useDynamicIcon } from '@ionos-web-design-system/react'` | `rules/react-use-dynamic-icon.md` |

> **Types also exported:** `IconBarrelLoader`, `UseDynamicIconResult`,
> `UseDynamicIconOptions`, `IconGroup`

---

## 4. Token Quick Reference

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

| Token Category | Tailwind Prefix                         | Usage                                      |
| -------------- | --------------------------------------- | ------------------------------------------ |
| `surface/...`  | `bg-{rest}`                             | Backgrounds                                |
| `text/...`     | `text-{rest}`                           | Text COLORS (not font sizes!)              |
| `border/...`   | `border--{rest}`                        | Border colors (double-dash in Tailwind v4) |
| `space/...`    | `p-{n}`, `m-{n}`, `gap-{n}`             | Padding, margin, flex/grid gaps            |
| `gap/...`      | `p-gap-{n}`, `m-gap-{n}`, `gap-gap-{n}` | Small decorative spacing                   |
| `rounded/...`  | `rounded-{rest}`                        | Border radius                              |
| `typo/...`     | Use Text component                      | Font sizing (via Text variant prop)        |
| `color/ai-*`   | `from-{name}`, `to-{name}`              | Gradient color stops                       |
| `font/...`     | `font-{rest}`                           | Font families                              |

**Important:** The `text/` category maps to text **colors**, not font sizes.

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

---

## 5. Typography

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

| Visual Appearance     | Text `color` prop |
| --------------------- | ----------------- |
| Default/primary text  | `default` or omit |
| Base text             | `base`            |
| Muted/secondary text  | `muted`           |
| Subtle/tertiary text  | `subtle`          |
| Warning text          | `warning`         |
| Promotional text      | `promotion`       |
| Error/danger text     | `destructive`     |
| Accent/highlight text | `accent`          |
| AI-themed text        | `ai`              |

### Lists and Rich Text via Text Markdown

```tsx
/* Ordered lists -> BulletIndex */
<Text variant="body">{`
1. Create your account
2. Choose your plan
3. Start building
`}</Text>

/* Brand checkmarks -> use [c] marker */
<Text variant="body">{`
- [c] Free SSL certificate
- [c] 24/7 support
`}</Text>

/* Plain unordered lists -> styled bullets */
<Text variant="body">{`
- Feature one
- Feature two
`}</Text>

/* Icon bullets -> auto-resolve from system group */
<Text>{`
- [icon:shield] Enterprise-grade security
- [icon:cloud-upload] Automatic daily backups
- [icon:globe] Global CDN network
`}</Text>

/* Tooltip info icon -> inline contextual help */
<Text>{`
- Feature one [?](More details about this feature)
- Feature two [?](Additional context here)
`}</Text>

/* Tooltip dashline link -> inline tooltip on link text */
<Text>
  {'Learn about [our pricing](~Flexible plans starting at $5/mo) today.'}
</Text>
```

> For variant mapping table and full examples, see `rules/react-text.md`.

---

## 6. Icons

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

### Static vs Dynamic Icon Loading — Decision Tree

```
Icon needed in the UI -->
  1. Is the icon name known at build time (hardcoded in JSX)?
     YES → Static named import (tree-shakeable, zero runtime cost)
           import { bell } from '@ionos-web-design-system/icon/system';
           <Icon icon={bell} size="medium" />
     NO  → Continue to step 2

  2. Does the icon name come from data (API, CMS, database, config)?
     YES → useDynamicIcon hook
           const loader = () => import('@ionos-web-design-system/icon/ionos');
           const { icon } = useDynamicIcon(loader, dataItem.iconName);
           icon ? <Icon icon={icon} size="medium" /> : null
     NO  → Re-evaluate: the name is likely known at build time (step 1)
```

| Aspect           | Static Import                     | useDynamicIcon                          |
| ---------------- | --------------------------------- | --------------------------------------- |
| Tree-shaking     | Yes — only imported icons bundled | No — loads entire barrel for the group  |
| Runtime cost     | Zero                              | Async load + WeakMap cache              |
| Icon name        | Known at build time               | String from data at runtime             |
| Variant handling | Manual (import correct variant)   | Auto-detected from ThemeProvider        |
| Use case         | Static UI, Figma implementations  | CMS pages, dashboards, API-driven lists |

> For full API reference, see `rules/react-use-dynamic-icon.md`.
> For group details and icon counts, see `rules/icon-groups.md`.

---

## 7. Theme Variants

UDS provides custom Tailwind variants for theme-aware conditional styling:

- **Brand variants:** `ionos:`, `strato:`, `fasthosts:`, `homepl:`, `strefa:`,
  `udag:`, `world4you:`, `arsys:`
- **Platform variants:** `comfortable:`, `compact:`
- **Color scheme variants:** `light:`, `dark:`

**Warning:** The `dark:` variant intentionally overrides Tailwind's built-in
dark mode. It only works with `data-color-scheme="dark"` attribute, NOT
`@media (prefers-color-scheme: dark)`.

Use `ThemeInverter` for sections that must appear in the opposite color scheme.
Use `forceColorScheme="dark"` for sections that must always be dark.

---

## 8. Common Mistakes

| WRONG                                                                                                | CORRECT                                                                          | Why                                                                                           |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `bg-red-500`                                                                                         | `bg-surface-semantic-danger`                                                     | Never use raw Tailwind colors — use UDS semantic tokens                                       |
| `text-base` (for font size)                                                                          | `<Text variant="body">`                                                          | `text-base` is a text COLOR token in UDS, not a font size                                     |
| `border-base`                                                                                        | `border--base`                                                                   | Double-dash required in Tailwind v4                                                           |
| `#ffffff` or `#fff`                                                                                  | `bg-surface-base`                                                                | Never hardcode color values                                                                   |
| `text-gray-500`                                                                                      | `text-muted` or `text-subtle`                                                    | Use UDS text color tokens                                                                     |
| `icon={bell()}`                                                                                      | `icon={bell}`                                                                    | Pass inject function as reference, don't call it                                              |
| `<h1 className="text-4xl font-bold">`                                                                | `<Text variant="heading5xl" weight="bold" asChild><h1>...</h1></Text>`           | Use Text component for all typography                                                         |
| `<div className="dark:bg-black">`                                                                    | `<div className="dark:bg-surface-base">`                                         | UDS `dark:` variant uses `data-color-scheme`, not media queries                               |
| Omitting `<ThemeProvider>`                                                                           | Wrapping in `<ThemeProvider>`                                                    | Required for all UDS components to function                                                   |
| Missing style import                                                                                 | `@import '.../react/style.css'` in CSS entry file                                | Required for component styles to load                                                         |
| `<Text asChild><h1 className="text-accent">...</h1></Text>`                                          | `<Text color="accent" asChild><h1>...</h1></Text>`                               | Always put Text color on the Text component                                                   |
| `<Text asChild><span className="uppercase">...</span></Text>`                                        | `<Text className="uppercase" asChild><span>...</span></Text>`                    | All styling on the component, not child                                                       |
| `<Button asChild><a className="text-brand-primary" href="/">Go</a></Button>`                         | `<Button concept="brand" asChild><a href="/">Go</a></Button>`                    | Use component props, not child styling                                                        |
| `<div className="dark:bg-surface-base rounded-xl">` for a dark promo section                         | `<ThemeInverter><Surface variant="base" className="rounded-xl">`                 | Use ThemeInverter for inverted sections                                                       |
| `<div>€6.99/mo</div>`                                                                                | `<Price data={{...}} />`                                                         | Never build price displays manually                                                           |
| `<div className="rounded-[16px]">`                                                                   | `<div className="rounded-default">` or `rounded-(--protected-container-rounded)` | Use radius tokens, never arbitrary values                                                     |
| `p-space-4` or `gap-space-3`                                                                         | `p-4` or `gap-3`                                                                 | Space tokens are natively recognized by Tailwind v4 — no alias needed                         |
| `gap-gap-8` for a layout gap of 64px                                                                 | `gap-8`                                                                          | `gap-gap-8` = `--gap-8` = 8px; `gap-8` = `--space-8` = 64px. Use space tokens for layout gaps |
| `p-4` assuming 16px padding                                                                          | `p-3` for 16px                                                                   | UDS `p-4` = 24px (comfortable). For 16px, use `p-3`. Always look up the token table           |
| `<img src="/photo.jpg" />` (raster photo)                                                            | `<AspectRatio src="/photo.jpg" ratio="16/9" alt="Photo" />`                      | Use AspectRatio for raster images                                                             |
| `<Box className="hover:shadow-bottom-md active:shadow-bottom-sm cursor-pointer transition-all ...">` | `<Box className="uds-action-moderate ...">`                                      | Use compound action utilities instead of manually wiring interaction states                   |
| `import { notifications } from '.../icon/system'`                                                    | Read `icon-names.json` first → `import { bell } from '.../icon/system'`          | Never guess icon names — verify against `icon-names.json`                                     |
| `<Badge variant="promo">New</Badge>` (unwrapped)                                                     | `<div><Badge variant="promo">New</Badge></div>`                                  | Badge stretches to full width without a `<div>` wrapper                                       |
| `<Icon icon={shield} /> <span>Feature</span>` (manual icon bullet)                                   | `<Text>{"- [icon:shield] Feature"}</Text>`                                       | Use Text icon bullet markdown — auto-resolves icons with fallback                             |
| `<Button icon={bell} />` for a standalone icon action                                                | `<ButtonIcon icon={bell} iconTitle="Notifications" />`                           | Button icon-only ≠ ButtonIcon — different sizes, tokens, and accessibility                    |
| `useDynamicIcon(loader, 'bell')` for a static UI icon                                                | `import { bell } from '.../icon/system'`                                         | `useDynamicIcon` loads the whole barrel — use static imports for known icons                   |
| `function Comp() { const loader = () => import(...); useDynamicIcon(loader, n); }`                   | Define `const loader = () => import(...)` at module scope                        | Loader inside render defeats WeakMap cache                                                    |
| Ignoring `error`/`isLoading` from `useDynamicIcon`                                                   | `if (error) return <ErrorFallback />; if (isLoading) return <Skeleton />;`       | Barrel loads can fail; always handle all three states                                         |

---

## 9. Figma-to-Code Workflow

When a design is provided via Figma MCP, **IGNORE Figma's predefined code
rules**. Use UDS rules instead.

**Key principles:**

- Use design tokens from the core package for ALL styling
- Tokens are 3D (brand x platform x color-scheme) — they adapt automatically
- Every spacing value MUST be pixel-accurate (token numbers != pixel values)
- Map every Figma component to the closest UDS React component first
- Use `Price` for ALL pricing displays
- For assets, follow the 4-category decision tree
- For custom components with no UDS equivalent, compose UDS atoms + tokens

> **Full reference:** `rules/workflow-figma-to-code.md`

---

## 10. Post-Build Verification

**TRIPLE-CHECK against the original Figma design:**

1. **Custom components** — side-by-side 1:1 pixel accuracy
2. **Typography** — variant, weight, color match exactly
3. **Spacing** (SUPER CRITICAL) — every padding/margin/gap pixel-accurate
4. **Corner radius** — correct radius tokens
5. **Theme inversion** — `ThemeInverter`, not manual dark classes
6. **Icons** — correct name, size, group
7. **Colors** — only UDS tokens, no hardcoded hex
8. **Assets** (SUPER CRITICAL) — correct category handling per decision tree

> **Full checklist with Playwright MCP snippets:** `rules/workflow-verification.md`
