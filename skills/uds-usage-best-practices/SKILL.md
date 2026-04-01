---
name: uds-usage-best-practices
description: >
  Comprehensive reference for implementing UIs with the UDS (Universal Design
  System). Use when the user asks to build, implement, or code a UI using UDS
  components, look up component usage, understand design tokens, or when the
  user mentions UDS, design system components, or theming. Also use when
  translating Figma designs to UDS React code, verifying implementations against
  Figma, debugging theme or token issues, or whenever "@ionos-web-design-system"
  appears in code. Triggers on mentions of ThemeProvider, ThemeInverter,
  Surface, design tokens, spacing tokens, or multi-brand theming. Does NOT
  trigger on project setup — see uds-project-setup.
---

# UDS Usage Best Practices

Comprehensive reference for implementing UIs with the UDS (Universal Design
System). UDS is a token-driven, multi-brand design system supporting 8 brands, 2
platforms, and 2 color schemes (32 theme combinations). All visual properties
adapt automatically when theme attributes change.

## 1. Reading Order

1. **Read this file first** — critical rules and navigation pointers.
2. **For each component or hook**, read its rule file: `rules/react-{kebab-name}.md`
3. **For component/hook lookup table**: `rules/quick-ref-components.md`
4. **For tokens**: `rules/quick-ref-tokens.md` (quick reference) and
   `rules/core-*.md` (detailed):
   - `rules/core-semantic-tokens.md` — color, spacing overview, radius
   - `rules/core-spacing-tokens.md` — full spacing table with px values
   - `rules/core-corner-radius.md` — corner radius tokens and decision tree
   - `rules/core-gradient-tokens.md` — gradient tokens, directions, and advanced
     usage
   - `rules/core-action-utilities.md` — action interaction utilities
     (hover/active compound classes)
5. **For typography**: `rules/quick-ref-typography.md`
6. **For icons**: `rules/quick-ref-icons.md`, `rules/icon-groups.md`, and
   `rules/core-icon-name-lookup.md`
7. **For Shop-UI organisms**: `rules/shop-ui-*.md`
8. **For Figma-to-code workflow** (token mapping, asset handling, custom
   components): `rules/workflow-figma-to-code.md`
9. **For post-build verification** (checklist, Playwright MCP snippets):
   `rules/workflow-verification.md`
10. **For common mistakes**: `rules/common-mistakes.md`
11. **For full compiled reference**: `AGENTS.md`

## 2. Critical Rules

### ALWAYS

- Use UDS React components — never rebuild from raw HTML/CSS.
- Map every design element to a UDS React component whenever possible. If no
  matching UDS component exists, implement a custom component using UDS design
  tokens primarily.
- Read the component's rule file before using it in code (see
  `rules/quick-ref-components.md` for lookup).
- For bullet lists and rich text content, primarily use the `Text` component
  with markdown string syntax — it automatically renders ordered lists
  (`1. ...`) as `BulletIndex`, unordered lists with `[c]` marker (`- [c] ...`)
  as `BrandCheckmark`, and plain unordered lists (`- ...`) as styled bullets.
  See `rules/quick-ref-typography.md` for examples.
- For brand logo assets, do NOT use the `Icon` component — brand logos need
  exact Figma dimensions, not icon sizing. Instead, wrap a native `<img>` tag
  inside a `<div>` container sized to match the Figma design. Import the SVG
  from the `brandmark` icon group (`@ionos-web-design-system/icon/brandmark`)
  and choose the Light/Dark variant matching the active color scheme (e.g.,
  `ionosLight` for light mode, `ionosDark` for dark mode). See
  `rules/workflow-figma-to-code.md` (Category 4).
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
  See `rules/core-icon-name-lookup.md` for inline lists and the lookup
  procedure.
- Pass icon inject functions directly to `icon` props as references:
  `icon={plus}`.
- For **dynamic/data-driven icon names** (CMS content, API responses, configurable
  dashboards), use `useDynamicIcon` instead of static imports. Define the barrel
  loader at module scope and pass the kebab-case name string. See
  `rules/react-use-dynamic-icon.md` and `rules/quick-ref-icons.md` for the
  decision tree.
- **Distinguish `ButtonIcon` from `Button` icon-only mode.** They look similar
  but are different components with different sizes, tokens, and features. When
  Figma shows an icon-only button, check the Figma component name/layer to
  determine which one to use. See the decision tree below.
- Use `Button` or `Link` with `asChild` for all anchor (`<a>`) elements; apply
  all styling on the component itself, never on the `<a>` child:

  ```tsx
  // Correct
  <Button concept="brand" asChild><a href="/signup">Get Started</a></Button>

  // Wrong
  <Button asChild><a href="/signup" className="text-brand-primary">Get Started</a></Button>
  ```

- Use `ThemeInverter` to wrap any section/card that has a visually inverted
  color mode (e.g., dark sections on a light page). Never manually apply dark
  surface colors to simulate visual inversion. See section 6.
- Set text color only via the `color` prop on the `Text` component — never on
  child elements inside `asChild`.
- Use the `Price` component for all pricing displays — never build price layouts
  manually. See `rules/react-price.md`.
- Use `AspectRatio` for all **raster** images/media from Figma (photos,
  screenshots, PNGs, JPGs) — never raw `<img>` tags for raster assets. Match the
  `ratio` prop to the Figma frame's proportions and verify size accuracy after
  implementation. See `rules/react-aspect-ratio.md`.
- For vector SVG assets NOT in the UDS icon package (illustrations, decorative
  graphics), download the SVG from Figma and use inline SVG or `<img>` per the
  Figma MCP suggestions. Do NOT wrap SVGs in `AspectRatio`.

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
  4. When in doubt, prefer <ButtonIcon> for standalone icon actions —
     it enforces accessibility (required iconTitle) and has purpose-built sizing.
```

### NEVER

- Use raw Tailwind colors (`bg-red-500`, `text-gray-700`) — always use UDS
  semantic tokens (`bg-surface-semantic-danger`, `text-muted`).
- Use `text-base` for font sizing — in UDS, `text-base` is a text **color**
  token. Use the `Text` component with `variant="body"` for body text.
- Call icon functions manually — pass as reference: `icon={bell}` not
  `icon={bell()}`.
- Assume or guess icon import names — always verify first.
- Hardcode color values (`#fff`, `rgb(...)`) — use token classes instead.
- Use wildcard CSS imports (`brands/*`, `platforms/*`) when deploying for a
  single brand — import only the specific brand/platform.
- Custom-style child elements inside `asChild` — `Text`, `Button`, `Link`, and
  all `asChild` components must have all visual customization on the component
  itself, not its child.
- Use `useDynamicIcon` for icons known at build time — it loads the entire barrel
  (no tree-shaking). Use static named imports instead:
  `import { bell } from '.../icon/system'`.
- Create barrel loader functions inside component render bodies — define them at
  module scope for stable WeakMap caching.
- Build price displays manually — always use the `Price` component (see
  `rules/react-price.md`).
- Use raw `<img>` tags for **raster** assets from Figma (photos, screenshots,
  PNGs, JPGs) — always use `AspectRatio` for raster images. For other asset
  types (vector SVGs, brand logos), see `rules/workflow-figma-to-code.md`.

## 3. MCP Tools

### Figma MCP (`claude.ai Figma`)

The Figma MCP is platform-managed and available automatically. Use it for:

- **`get_design_context`** — Primary tool. Returns code suggestions, screenshot,
  and contextual hints for a Figma node. Extract `fileKey` and `nodeId` from
  Figma URLs.
- **`get_screenshot`** — Get a screenshot of a Figma node for side-by-side
  comparison during post-build verification.
- **`get_metadata`** — Get file/node metadata (dimensions, component info).

**Auth troubleshooting:** If Figma MCP calls fail with auth errors, ask the user
to re-authenticate via the Figma MCP connection in their Claude Code settings.
The MCP uses OAuth and tokens may expire.

**Important:** When Figma MCP returns code suggestions, **IGNORE Figma's
predefined code rules**. Always use UDS components and tokens instead.

### Playwright MCP

Configured in this plugin's `.mcp.json`. Use for browser-based verification:

- Navigate to the running local dev server
- Take screenshots for visual comparison
- Inspect computed styles (spacing, colors, typography)
- Verify token resolution at runtime

**Prerequisite:** The user's app must be running locally (e.g., `npm run dev`).

## 4. Quick References

Detailed reference tables are in dedicated rule files (loaded on-demand):

- **Component & hook lookup** — `rules/quick-ref-components.md`
  (35+ React components, Shop-UI, hooks with imports and rule file paths)
- **Token naming & Tailwind mapping** — `rules/quick-ref-tokens.md`
  (variable translation, category prefixes, border double-dash convention)
- **Typography** — `rules/quick-ref-typography.md`
  (Text decision tree, color props, markdown list syntax)
- **Icons** — `rules/quick-ref-icons.md`
  (9 groups, static vs dynamic loading decision tree)
- **Common mistakes** — `rules/common-mistakes.md`
  (27 WRONG/CORRECT pairs with explanations)

## 5. Theme Variants

UDS provides custom Tailwind variants for theme-aware conditional styling:

- **Brand variants:** `ionos:`, `strato:`, `fasthosts:`, `homepl:`, `strefa:`,
  `udag:`, `world4you:`, `arsys:`
- **Platform variants:** `comfortable:`, `compact:`
- **Color scheme variants:** `light:`, `dark:`

**Warning:** The `dark:` variant intentionally overrides Tailwind's built-in
dark mode. It only works with `data-color-scheme="dark"` attribute, NOT
`@media (prefers-color-scheme: dark)`.

Use `ThemeInverter` for sections that must appear in the opposite color scheme.
Use `forceColorScheme="dark"` for sections that must always be dark. Never
manually apply dark surface classes to create visual inversion.

> For code examples and `forceColorScheme` details, see
> `rules/react-theme-inverter.md` and `rules/core-tailwind-variants.md`.

## 6. Figma-to-Code Workflow

When a design is provided via Figma MCP (figma.com URL), Figma includes its own
predefined code suggestions. **IGNORE those Figma-generated rules.** Use UDS
rules instead.

**Key principles:**

- Use design tokens from the core package for ALL styling — never hardcoded
  hex/px values
- Tokens are 3D (brand x platform x color-scheme) — they adapt automatically
- Every spacing value MUST be pixel-accurate (token numbers != pixel values)
- Map every Figma component to the closest UDS React component first
- Use `Price` for ALL pricing displays — never recreate manually
- For assets, follow the 4-category decision tree (raster -> AspectRatio, vector
  SVG -> `<div>` wrapper, icon -> Icon component, brand logo -> `<img>` in `<div>`)
- For custom components with no UDS equivalent, compose UDS atoms + tokens

> **Full reference with asset decision tree, code examples, spacing
> verification, and custom component pattern:** read
> `rules/workflow-figma-to-code.md`

## 7. Post-Build Verification

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
