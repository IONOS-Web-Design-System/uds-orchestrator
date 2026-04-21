# Tailwind Utility Classes

UDS Core generates custom Tailwind v4 `@utility` classes for typography,
shadows, focus states, and gradients. These are available after importing the
brand and platform CSS.

## Typography Utilities

Custom typography utilities set both `font-size` and `line-height` from UDS
typography tokens. These complement Tailwind's standard `text-{size}` classes
which are also overridden by UDS.

### Custom Composite Utilities

| Class               | Font Size Token    | Line Height Token                | Purpose                             |
| ------------------- | ------------------ | -------------------------------- | ----------------------------------- |
| `text-body`         | `--typo-body-size` | `--typo-body-lineheight-normal`  | Default body text                   |
| `text-body-compact` | `--typo-body-size` | `--typo-body-lineheight-compact` | Body text with tight line height    |
| `text-sm-compact`   | `--typo-sm-size`   | `--typo-sm-lineheight-compact`   | Small text, tight line height       |
| `text-sm-large`     | `--typo-sm-size`   | `--typo-sm-lineheight-large`     | Small text, loose line height       |
| `text-xs-compact`   | `--typo-xs-size`   | `--typo-xs-lineheight-compact`   | Extra-small text, tight line height |
| `text-lg-compact`   | `--typo-lg-size`   | `--typo-lg-lineheight-compact`   | Large text, tight line height       |
| `text-xl-compact`   | `--typo-xl-size`   | `--typo-xl-lineheight-compact`   | Extra-large text, tight line height |

### Composing Text Styles with Tailwind Utilities

UDS provides all the building blocks to compose any text style from atomic
Tailwind utilities — no composite utility classes needed. This gives full control
over font family, size, weight, tracking, and responsive behavior.

#### Text Component Variant → Tailwind Composition

| Text Variant   | Equivalent Tailwind Classes                          |
| -------------- | ---------------------------------------------------- |
| `heading9xl`   | `font-title text-6xl tracking-normal md:text-9xl`    |
| `heading8xl`   | `font-title text-6xl tracking-tight md:text-8xl`     |
| `heading7xl`   | `font-title text-6xl tracking-tight md:text-7xl`     |
| `heading6xl`   | `font-title text-5xl tracking-tight md:text-6xl`     |
| `heading5xl`   | `font-title text-4xl tracking-tight md:text-5xl`     |
| `heading4xl`   | `font-title text-4xl tracking-tight`                 |
| `heading3xl`   | `font-title text-2xl tracking-normal md:text-3xl`    |
| `heading2xl`   | `font-title text-xl tracking-tight md:text-2xl`      |
| `headingXl`    | `font-title text-lg md:text-xl`                      |
| `headingLg`    | `font-title text-body md:text-lg`                    |
| `bodyXl`       | `font-base text-xl`                                  |
| `bodyLg`       | `font-base text-lg`                                  |
| `body`         | `font-base text-body`                                |
| `bodySm`       | `font-base text-sm`                                  |
| `bodyXs`       | `font-base text-xs`                                  |

#### Examples

```html
<!-- Heading with brand-aware tracking -->
<h2 class="font-title text-xl tracking-head font-bold md:text-2xl">
  Feature Title
</h2>

<!-- Body text -->
<p class="font-base text-sm text-subtle">Helper text below the title</p>

<!-- Eyebrow text with special tracking -->
<span class="font-base text-xs tracking-eyebrow uppercase">New Feature</span>
```

#### Tailwind Utilities vs `Text` Component

| Consideration | Tailwind utility composition | `<Text>` component |
| --- | --- | --- |
| **Bundle size** | Zero JS — pure CSS | 34 kB (includes markdown parser, icon loader, 7 sub-components) |
| **Markdown** | No | Yes (`**bold**`, `[links](url)`, lists, `[icon:name]`, badges, tooltips) |
| **Semantic element** | You choose (`<h2>`, `<p>`, `<span>`) | Auto-selects `<p>` or `<div>` based on content |
| **Badge alignment** | Manual | Auto-sets `--uds-badge-vertical-align` for inline badges |
| **Composability** | Mix with any Tailwind class | Props-driven (`variant`, `color`, `weight`, `alignment`) |
| **Performance** | Optimal — no JS, no runtime | 34 kB JS parsed + executed per page |

#### When to use which

**Use Tailwind utility composition when:**
- Rendering plain text without markdown features
- You want zero JS overhead (server-rendered HTML, static pages, non-React)
- Building custom layouts where you control the HTML element
- Performance is critical and every kilobyte matters

**Use the `Text` component when:**
- Content includes markdown (`**bold**`, `[links](url)`, `- lists`, `[icon:name]`)
- Inline badges, tooltips, or colored text spans are needed
- Content is user-generated or CMS-driven (may contain markdown)
- You need automatic block/inline element detection

**Use `TextBase` (internal UDS component) when:**
- Building UDS components that need typography styling without markdown
- You want the component API (`variant`, `color` props) but not the markdown
  parser overhead (~4 kB vs 34 kB)

### Standard Text Size Overrides

UDS overrides Tailwind's built-in text size classes via `@theme` so they use UDS
typography tokens:

| Tailwind Class | Maps To                                            |
| -------------- | -------------------------------------------------- |
| `text-xs`      | `--typo-xs-size` + `--typo-xs-lineheight-normal`   |
| `text-sm`      | `--typo-sm-size` + `--typo-sm-lineheight-normal`   |
| `text-lg`      | `--typo-lg-size` + `--typo-lg-lineheight-normal`   |
| `text-xl`      | `--typo-xl-size` + `--typo-xl-lineheight-normal`   |
| `text-2xl`     | `--typo-2xl-size` + `--typo-2xl-lineheight-normal` |
| `text-3xl`     | `--typo-3xl-size` + `--typo-3xl-lineheight-normal` |
| `text-4xl`     | `--typo-4xl-size` + `--typo-4xl-lineheight-normal` |
| `text-5xl`     | `--typo-5xl-size` + `--typo-5xl-lineheight-normal` |
| `text-6xl`     | `--typo-6xl-size` + `--typo-6xl-lineheight-normal` |
| `text-7xl`     | `--typo-7xl-size` + `--typo-7xl-lineheight-normal` |
| `text-8xl`     | `--typo-8xl-size` + `--typo-8xl-lineheight-normal` |
| `text-9xl`     | `--typo-9xl-size` + `--typo-9xl-lineheight-normal` |

These values are platform-dependent — `comfortable` and `compact` produce
different sizes and line heights.

### Font Family Classes

| Tailwind Class | Token              | Purpose                   |
| -------------- | ------------------ | ------------------------- |
| `font-base`    | `--uds-font-base`  | Body text, UI labels      |
| `font-title`   | `--uds-font-title` | Headings and display text |
| `font-code`    | `--uds-font-code`  | Code blocks, monospace    |
| `font-print`   | `--uds-font-print` | Print stylesheets         |

### Font Weight Classes

| Tailwind Class | Token                      |
| -------------- | -------------------------- |
| `font-normal`  | `--uds-font-weight-normal` |
| `font-bold`    | `--uds-font-weight-bold`   |
| `font-black`   | `--uds-font-weight-black`  |

### Letter Spacing (Tracking)

Brand-specific tracking utilities for precise letter-spacing control:

| Tailwind Class      | Token                              | Purpose                             |
| ------------------- | ---------------------------------- | ----------------------------------- |
| `tracking-body`     | `--uds-font-letter-spacing-body`   | Body text tracking (0 for most brands, 0.0006rem for fasthosts) |
| `tracking-head`     | `--uds-font-letter-spacing-head`   | Heading text tracking (0 for all brands) |
| `tracking-eyebrow`  | `--uds-font-letter-spacing-eyebrow`| Eyebrow/overline tracking (0.0025rem–0.0037rem) |

These complement Tailwind's built-in `tracking-tight` (-0.025em), `tracking-normal` (0),
and `tracking-wide` (0.025em). Use UDS tracking tokens when you need brand-aware
letter-spacing that may vary across brands.

---

## Shadow Utilities

Directional shadow utilities for top and bottom elevations. Each size produces a
multi-layer `box-shadow`.

### Top Shadows

| Class           | Intensity         |
| --------------- | ----------------- |
| `shadow-top-xs` | Minimal shadow    |
| `shadow-top-sm` | Subtle shadow     |
| `shadow-top-md` | Medium shadow     |
| `shadow-top-lg` | Pronounced shadow |
| `shadow-top-xl` | Maximum shadow    |

### Bottom Shadows

| Class              | Intensity         |
| ------------------ | ----------------- |
| `shadow-bottom-xs` | Minimal shadow    |
| `shadow-bottom-sm` | Subtle shadow     |
| `shadow-bottom-md` | Medium shadow     |
| `shadow-bottom-lg` | Pronounced shadow |
| `shadow-bottom-xl` | Maximum shadow    |

```html
<div class="shadow-bottom-md">Card with medium bottom shadow</div>
<header class="shadow-bottom-sm">Subtle header shadow</header>
```

---

## Focus Utilities

Two focus indicator styles for keyboard accessibility:

### `uds-focus-ring`

A box-shadow-based focus ring that uses `--surface-base` as an inner ring and
`--protected-keyboard-focus` as the outer ring. Applied on `:focus-visible`.

```css
/* Generated CSS */
&:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--surface-base),
    0 0 0 4px var(--protected-keyboard-focus);
}
```

### `uds-focus-outline`

An outline-based focus indicator with offset. Applied on `:focus-visible`.

```css
/* Generated CSS */
&:focus-visible {
  outline: 2px solid var(--protected-keyboard-focus);
  outline-offset: 2px;
}
```

```html
<button class="uds-focus-ring">Ring-style focus</button>
<a class="uds-focus-outline" href="/page">Outline-style focus</a>
```

---

## Gradient Utilities

UDS gradient colors are registered as `@theme inline` color tokens, so they work
as standard Tailwind v4 `from-*/to-*` gradient stop classes. Combine with a
`bg-linear-to-*` direction class to render the gradient.

### Standard Gradient Pairs

| Gradient Pair  | Classes                                       | Purpose               |
| -------------- | --------------------------------------------- | --------------------- |
| AI Primary     | `from-ai-primary-start to-ai-primary-end`     | Primary AI gradient   |
| AI Secondary   | `from-ai-secondary-start to-ai-secondary-end` | Secondary AI gradient |
| AI Tertiary    | `from-ai-tertiary-start to-ai-tertiary-end`   | Tertiary AI gradient  |
| AI Subtle      | `from-ai-subtle-start to-ai-subtle-end`       | Subtle AI gradient    |
| Brand Gradient | `from-gradient-start to-gradient-end`         | Base brand gradient   |

### Usage

Gradient stop classes define the colors. You must also apply a gradient
direction:

```html
<!-- AI-themed gradient background -->
<div class="from-ai-primary-start to-ai-primary-end bg-linear-to-r">
  AI feature banner
</div>

<!-- Brand gradient -->
<div class="from-gradient-start to-gradient-end bg-linear-to-br">
  Brand gradient background
</div>
```

Gradient tokens are brand-specific — each brand defines its own gradient colors
in the brand CSS file.

> For comprehensive gradient usage including text gradients, border gradients,
> icon gradients, custom angles, and animation — see
> `rules/core-gradient-tokens.md`.

---

## Action Interaction Utilities

Compound interaction classes that bundle cursor, transition, and optional
shadow/border effects for idle, hover, and active states.

| Class                 | Transition   | Description                                    |
| --------------------- | ------------ | ---------------------------------------------- |
| `uds-action-loud`     | duration-300 | Maximum emphasis — border + shadow effects     |
| `uds-action-moderate` | duration-300 | Balanced — subtle to medium shadow effects     |
| `uds-action-quiet`    | duration-200 | Low-key — minimal shadow, slight lift on hover |
| `uds-action-whisper`  | duration-200 | Cursor + transition only, no visual decoration |

> For decision tree, brand-specific behavior, and full usage guide — see
> `rules/core-action-utilities.md`.

---

## Tailwind v3 Differences

In Tailwind v3, `@utility` directives are not supported. However, the same
utilities are generated as plain CSS classes in the v3 bundle files
(`dist/v3/{brand}-{platform}.css`):

- **Typography**: `.text-body`, `.text-body-compact`, etc. are available as plain
  classes.
- **Shadows**: `.shadow-top-*` / `.shadow-bottom-*` are available as plain
  classes.
- **Focus**: `.uds-focus-ring` / `.uds-focus-outline` are available as plain
  classes.
- **Gradients**: Use raw token values for gradient stops.

Standard text size, font family/weight, and tracking classes work in both v3 and
v4 via the plugin's theme extension.

## Best Practices

**DO:**

- Compose text styles from atomic utilities (`font-title text-xl tracking-head
  md:text-2xl`) instead of importing the `Text` component for plain text.
- Use `text-body` as the default for paragraph text, not `text-base` (which is a
  color class in UDS).
- Use `tracking-body`/`tracking-head`/`tracking-eyebrow` for brand-aware
  letter-spacing.
- Use `-compact` variants for UI elements needing tighter spacing (buttons,
  badges, table cells).
- Combine `from-*/to-*` stop classes with `bg-linear-to-*` direction classes.
- Use `uds-focus-ring` on buttons and `uds-focus-outline` on links for
  consistent focus styling.

**DON'T:**

- Import the `Text` component just for plain text rendering — use `uds-*`
  utilities or `TextBase` instead for better bundle size.
- Use Tailwind's default `text-base` for font sizing — in UDS, `text-base` is a
  **text color** class (maps to `--text-base`), not a font size.
- Apply shadow utilities without considering the UDS elevation hierarchy (xs
  through xl).
- Mix custom focus styles with `uds-focus-ring`/`uds-focus-outline` — pick one
  approach.
