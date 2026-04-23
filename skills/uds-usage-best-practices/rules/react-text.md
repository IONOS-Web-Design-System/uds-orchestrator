# Text

## Import

```tsx
import Text from '@ionos-web-design-system/react/text';
```

## Props

| Prop        | Type                                                                                                          | Default     | Description                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------- |
| `variant`   | see variants below                                                                                            | `'body'`    | Typography style                    |
| `alignment` | `'left' \| 'center' \| 'right' \| 'justify'`                                                                  | `'left'`    | Text alignment                      |
| `weight`    | `'normal' \| 'bold' \| 'black'`                                                                               | `'normal'`  | Font weight                         |
| `color`     | `'default' \| 'base' \| 'muted' \| 'subtle' \| 'warning' \| 'promotion' \| 'destructive' \| 'accent' \| 'ai'` | `'default'` | Text color                          |
| `asChild`   | `boolean`                                                                                                     | `false`     | Polymorphic rendering               |
| `children`  | `string \| React.ReactNode`                                                                                   | —           | Content (supports markdown strings) |

### Variant values

**Headings**: `heading9xl`, `heading8xl`, `heading7xl`, `heading6xl`,
`heading5xl`, `heading4xl`, `heading3xl`, `heading2xl`, `headingXl`, `headingLg`

**Body**: `bodyXl`, `bodyLg`, `body`, `bodySm`, `bodyXs`

### Figma Style to Text Props

Figma text styles use the naming convention `{size}/{family}-{weight}`. Use this
table to translate any Figma text style to `<Text>` props.

**Head family** (`head` = title font) — maps to heading variants:

| Figma Style        | `variant`    | `weight`   |
| ------------------ | ------------ | ---------- |
| `9xl/head-regular` | `heading9xl` | `'normal'` |
| `9xl/head-semi`    | `heading9xl` | `'bold'`   |
| `9xl/head-bold`    | `heading9xl` | `'black'`  |
| `8xl/head-regular` | `heading8xl` | `'normal'` |
| `8xl/head-semi`    | `heading8xl` | `'bold'`   |
| `8xl/head-bold`    | `heading8xl` | `'black'`  |
| `7xl/head-regular` | `heading7xl` | `'normal'` |
| `7xl/head-semi`    | `heading7xl` | `'bold'`   |
| `7xl/head-bold`    | `heading7xl` | `'black'`  |
| `6xl/head-regular` | `heading6xl` | `'normal'` |
| `6xl/head-semi`    | `heading6xl` | `'bold'`   |
| `6xl/head-bold`    | `heading6xl` | `'black'`  |
| `5xl/head-regular` | `heading5xl` | `'normal'` |
| `5xl/head-semi`    | `heading5xl` | `'bold'`   |
| `5xl/head-bold`    | `heading5xl` | `'black'`  |
| `4xl/head-regular` | `heading4xl` | `'normal'` |
| `4xl/head-semi`    | `heading4xl` | `'bold'`   |
| `4xl/head-bold`    | `heading4xl` | `'black'`  |
| `3xl/head-regular` | `heading3xl` | `'normal'` |
| `3xl/head-semi`    | `heading3xl` | `'bold'`   |
| `3xl/head-bold`    | `heading3xl` | `'black'`  |
| `2xl/head-regular` | `heading2xl` | `'normal'` |
| `2xl/head-semi`    | `heading2xl` | `'bold'`   |
| `2xl/head-bold`    | `heading2xl` | `'black'`  |
| `xl/head-regular`  | `headingXl`  | `'normal'` |
| `xl/head-semi`     | `headingXl`  | `'bold'`   |
| `xl/head-bold`     | `headingXl`  | `'black'`  |
| `lg/head-regular`  | `headingLg`  | `'normal'` |
| `lg/head-semi`     | `headingLg`  | `'bold'`   |
| `lg/head-bold`     | `headingLg`  | `'black'`  |

**Body family** (`body` = base font) — maps to body variants:

| Figma Style         | `variant` | `weight`   |
| ------------------- | --------- | ---------- |
| `xl/body-regular`   | `bodyXl`  | `'normal'` |
| `xl/body-semi`      | `bodyXl`  | `'bold'`   |
| `xl/body-bold`      | `bodyXl`  | `'black'`  |
| `lg/body-regular`   | `bodyLg`  | `'normal'` |
| `lg/body-semi`      | `bodyLg`  | `'bold'`   |
| `lg/body-bold`      | `bodyLg`  | `'black'`  |
| `body/body-regular` | `body`    | `'normal'` |
| `body/body-semi`    | `body`    | `'bold'`   |
| `body/body-bold`    | `body`    | `'black'`  |
| `sm/body-regular`   | `bodySm`  | `'normal'` |
| `sm/body-semi`      | `bodySm`  | `'bold'`   |
| `sm/body-bold`      | `bodySm`  | `'black'`  |
| `xs/body-regular`   | `bodyXs`  | `'normal'` |
| `xs/body-semi`      | `bodyXs`  | `'bold'`   |
| `xs/body-bold`      | `bodyXs`  | `'black'`  |

**Weight mapping** (Figma names differ from component props):

| Figma Weight | CSS Value | Figma Font Style | Text `weight` |
| ------------ | --------- | ---------------- | ------------- |
| `regular`    | 400       | Regular          | `'normal'`    |
| `semi`       | 600       | SemiBold         | `'bold'`      |
| `bold`       | 700       | Bold             | `'black'`     |

> **Warning:** Figma's `semi` = component `bold`, Figma's `bold` = component
> `black`. Do not use `weight="bold"` when the Figma style says `bold` — use
> `weight="black"` instead.

**Alignment mapping:**

| Figma Text Alignment | Text `alignment` prop |
| -------------------- | --------------------- |
| Left-aligned         | `'left'` (default)    |
| Center-aligned       | `'center'`            |
| Right-aligned        | `'right'`             |
| Justified            | `'justify'`           |

### Markdown features

When `children` is a string, these markdown features are processed
automatically:

- **Bold** and _italic_ formatting
- Links: standard markdown link syntax
- Inline color: `[text](color-name)` — applies a named color
- Inline badge: `[text](badge)`, `[text](badge-price)`, `[text](badge-promo)`
- Inline `Link`: standard markdown `[label](url)` syntax
- Bullet list (`- item`): renders styled bullet dots
- Ordered list (`1. item`): renders `BulletIndex` (numbered bullets)
- Checkmark list (`- [c] item`): renders `BrandCheckmark` icons
- Lists with bullet points and checkmarks
- Icon bullet (`- [icon:name] text`): renders an Icon component as the bullet
  marker. Icons auto-resolve from `@ionos-web-design-system/icon/system`.
  Supports kebab-case (`cloud-upload`) and camelCase (`cloudUpload`). Falls back
  to dot bullet if icon not found.
- Tooltip info icon (`[?](tooltip text)`): renders a small info ButtonIcon
  wrapped in a Tooltip. Works in all list types (unordered, ordered, checkmark)
  and inline in paragraphs.
- Tooltip dashline link (`[text](~tooltip content)`): renders a dashline Link
  wrapped in a Tooltip. The `~` prefix distinguishes from regular links.

Prefer these markdown features over manually composing separate `Bullet`,
`BulletIndex`, or `BrandCheckmark` components.

## Usage

### Headings

```tsx
<Text variant="heading5xl" weight="bold">Page Title</Text>
<Text variant="headingLg">Section Heading</Text>
```

### Body text

```tsx
<Text variant="body">Standard body text for paragraphs.</Text>
<Text variant="bodySm" color="muted">Secondary information.</Text>
<Text variant="bodyXs" color="subtle">Caption or fine print.</Text>
```

### Colors

```tsx
<Text color="accent">Highlighted text</Text>
<Text color="destructive">Error message</Text>
<Text color="ai">AI-generated content</Text>
```

### Color Inheritance Behavior

`color="default"` (the default when no `color` prop is specified) maps to CSS
`color: inherit`. The Text component adopts whatever text color its parent
container provides.

**Why this matters:** Inside `ThemeInverter` or any theme-aware container, Text
with `color="default"` automatically inverts its color along with the container.
But if no ancestor sets a text color, the text may be invisible or wrong.

**Best practice:** Always ensure text color is set — either via the `color` prop
on the Text component itself, or via a text color token on a parent container:

```tsx
{
  /* Option 1: Explicit color prop on Text (preferred) */
}
<ThemeInverter forceColorScheme="dark">
  <Surface variant="base" className="p-4">
    <Text variant="heading2xl" color="base" weight="bold" asChild>
      <h2>This heading is always visible</h2>
    </Text>
    <Text variant="body" color="subtle" asChild>
      <p>Secondary text with proper contrast</p>
    </Text>
  </Surface>
</ThemeInverter>;

{
  /* Option 2: Text color token on parent container — all children inherit */
}
<div className="text-base">
  <Text variant="heading2xl" weight="bold" asChild>
    <h2>Inherits text-base color</h2>
  </Text>
  <Text variant="body" asChild>
    <p>Also inherits text-base color</p>
  </Text>
</div>;
```

**Color values quick reference:**

| `color` prop    | CSS class applied              | When to use                            |
| --------------- | ------------------------------ | -------------------------------------- |
| `'default'`     | `text-inherit`                 | Inherit from parent (use with caution) |
| `'base'`        | `text-(--text-base)`           | Primary text — default readable color  |
| `'muted'`       | `text-disabled`                | Disabled or secondary text             |
| `'subtle'`      | `text-subtle`                  | Tertiary text, captions, fine print    |
| `'warning'`     | `text-semantic-caution-bolder` | Warning messages                       |
| `'promotion'`   | `text-semantic-promo-bolder`   | Promotional / sale text                |
| `'destructive'` | `text-semantic-danger-bolder`  | Error messages                         |
| `'accent'`      | `text-accent`                  | Highlighted / branded text             |
| `'ai'`          | `text-semantic-ai-bolder`      | AI-generated content indicators        |

### Markdown string

```tsx
<Text>This supports **bold**, *italic*, and [colored text](accent)</Text>
```

### Icon bullets

```tsx
// Icons auto-resolve from system group
<Text>{`
- [icon:shield] Enterprise-grade security
- [icon:cloud-upload] Automatic daily backups
- [icon:globe] Global CDN network
`}</Text>
```

### Tooltip info icon

```tsx
<Text>{`
- Feature one [?](More details about this feature)
- Feature two [?](Additional context here)
`}</Text>
```

### Tooltip dashline link

```tsx
<Text>
  {'Learn about [our pricing](~Flexible plans starting at $5/mo) today.'}
</Text>
```

### Combined markdown features

```tsx
<Text>{`
- [icon:shield] **Security** — DDoS protection and [WAF](~Web Application Firewall) included [?](SOC 2 compliant)
`}</Text>
```

### Polymorphic rendering

```tsx
<Text variant="headingLg" asChild>
  <h2>Rendered as h2 element</h2>
</Text>
```

## Do

- Use heading variants for headings and body variants for content.
- Match `weight` to visual hierarchy — `bold` for emphasis, `black` for display.
- Use `asChild` to render semantic HTML elements (h1-h6, p, span).
- Set text color **only** via the `color` prop on `Text` — never on the child
  element inside `asChild`:

  ```tsx
  // Correct
  <Text color="accent" asChild><h1>Title</h1></Text>

  // Wrong
  <Text asChild><h1 className="text-accent">Title</h1></Text>
  ```

- Put **all** style customizations (color, variant, weight, alignment, extra
  `className`) on the `Text` component, not the child element.
- Use `className` on `Text` for utilities not covered by props:
  ```tsx
  <Text className="uppercase" asChild><span>UPPERCASE</span></Text>
  <Text className="truncate" variant="body">Long text that truncates…</Text>
  ```
- Set `color="base"` or `color="subtle"` on Text inside ThemeInverter containers
  to ensure proper color inversion. Relying on `color="default"` (inherit)
  inside theme-switched contexts can produce invisible text.
- Use a text color token on a parent container (`className="text-base"`) when
  multiple Text children should share the same color.
- When translating Figma text styles, use the mapping table above. Pay special
  attention to weight: Figma `semi` → `weight="bold"`, Figma `bold` →
  `weight="black"`.
- Use `Text` markdown syntax for lists and inline components instead of manually
  composing separate components:

  ```tsx
  // Inline badge via markdown
  <Text>{"Plan includes [SSL](badge) and [24/7 support](badge-promo)"}</Text>

  // Checkmark list — renders BrandCheckmark automatically
  <Text variant="body">{`
  - [c] Free SSL certificate
  - [c] 24/7 support
  `}</Text>

  // Numbered list — renders BulletIndex automatically
  <Text variant="body">{`
  1. Create account
  2. Choose plan
  3. Start building
  `}</Text>
  ```

- Use `[icon:name]` bullet syntax for feature lists with custom icons instead of
  manually composing `Icon` + list markup.
- Use `[?](text)` for contextual help tooltips in lists and paragraphs.

## Don't

- Skip heading levels (e.g., `heading5xl` to `headingLg` without intermediate
  sizes).
- Use `color="destructive"` for non-error content.
- Apply heading variants to long paragraphs of text.
- Apply color classes or any style classes to child elements inside `asChild` —
  put all styling on the `Text` component itself.
- Manually compose `Bullet`, `BulletIndex`, or `BrandCheckmark` components when
  `Text` markdown handles them automatically.
- Map Figma weight names literally — Figma `bold` is NOT `weight="bold"`, it is
  `weight="black"` (700). Figma `semi` (600) maps to `weight="bold"`.
- Rely on `color="default"` (inherit) inside ThemeInverter or inverted sections
  without ensuring a parent sets the text color — the inherited value may not
  match the new background.
- Manually compose `Icon` + `Tooltip` + `ButtonIcon` for info tooltips when
  `[?](text)` markdown handles it.
- Use `[icon:name]` for icons outside of bullet list items — the syntax only
  works as a bullet marker.
