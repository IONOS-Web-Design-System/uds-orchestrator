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

### Letter Spacing

| Tailwind Theme Alias            | Token                               |
| ------------------------------- | ----------------------------------- |
| `--font-letter-spacing-body`    | `--uds-font-letter-spacing-body`    |
| `--font-letter-spacing-head`    | `--uds-font-letter-spacing-head`    |
| `--font-letter-spacing-eyebrow` | `--uds-font-letter-spacing-eyebrow` |

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

| Gradient Pair       | Classes                                   | Purpose               |
| ------------------- | ----------------------------------------- | --------------------- |
| AI Primary          | `from-ai-primary-start to-ai-primary-end` | Primary AI gradient   |
| AI Secondary        | `from-ai-secondary-start to-ai-secondary-end` | Secondary AI gradient |
| AI Tertiary         | `from-ai-tertiary-start to-ai-tertiary-end` | Tertiary AI gradient  |
| AI Subtle           | `from-ai-subtle-start to-ai-subtle-end`   | Subtle AI gradient    |
| Brand Gradient      | `from-gradient-start to-gradient-end`      | Base brand gradient   |

### Usage

Gradient stop classes define the colors. You must also apply a gradient
direction:

```html
<!-- AI-themed gradient background -->
<div class="from-ai-primary-start to-ai-primary-end bg-linear-to-r">AI feature banner</div>

<!-- Brand gradient -->
<div class="from-gradient-start to-gradient-end bg-linear-to-br">Brand gradient background</div>
```

Gradient tokens are brand-specific — each brand defines its own gradient colors
in the brand CSS file.

> For comprehensive gradient usage including text gradients, border gradients,
> icon gradients, custom angles, and animation — see
> `rules/core-gradient-tokens.md`.

---

## Tailwind v3 Differences

In Tailwind v3 (via the `udsTokens` plugin), these custom `@utility` classes are
**not available**. Instead:

- **Typography**: Use raw token values in CSS
  (`font-size: var(--typo-body-size)`)
- **Shadows**: Use raw token values or define custom utilities in your Tailwind
  config
- **Focus**: Apply via custom CSS using the same token references
- **Gradients**: Use raw token values for gradient stops

Standard text size and font family/weight classes work in both v3 and v4 via the
plugin's theme extension.

## Best Practices

**DO:**

- Use `text-body` as the default for paragraph text, not `text-base` (which is a
  color class in UDS).
- Use `-compact` variants for UI elements needing tighter spacing (buttons,
  badges, table cells).
- Combine `from-*/to-*` stop classes with `bg-linear-to-*` direction classes.
- Use `uds-focus-ring` on buttons and `uds-focus-outline` on links for
  consistent focus styling.

**DON'T:**

- Use Tailwind's default `text-base` for font sizing — in UDS, `text-base` is a
  **text color** class (maps to `--text-base`), not a font size.
- Apply shadow utilities without considering the UDS elevation hierarchy (xs
  through xl).
- Mix custom focus styles with `uds-focus-ring`/`uds-focus-outline` — pick one
  approach.
