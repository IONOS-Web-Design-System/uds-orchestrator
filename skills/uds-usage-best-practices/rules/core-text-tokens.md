# Text Tokens

Text tokens control text colors, typography sizing, font families, and font
weights. They adapt automatically to the active theme.

## Text Color Tokens

### Base Text Colors

| Token             | Tailwind Class  | Purpose                      |
| ----------------- | --------------- | ---------------------------- |
| `--text-base`     | `text-base`     | Primary body text            |
| `--text-subtle`   | `text-subtle`   | Secondary/de-emphasized text |
| `--text-disabled` | `text-disabled` | Disabled state text          |

### Invert Text Colors

For text on inverted/contrasting backgrounds:

| Token                  | Tailwind Class       |
| ---------------------- | -------------------- |
| `--text-base-invert`   | `text-base-invert`   |
| `--text-subtle-invert` | `text-subtle-invert` |

### Semantic Text Colors

Each semantic family includes a base and bolder variant:

| Family      | Base Token                | Bolder Token                     |
| ----------- | ------------------------- | -------------------------------- |
| **Danger**  | `--text-semantic-danger`  | `--text-semantic-danger-bolder`  |
| **Success** | `--text-semantic-success` | `--text-semantic-success-bolder` |
| **Caution** | `--text-semantic-caution` | `--text-semantic-caution-bolder` |
| **Promo**   | `--text-semantic-promo`   | `--text-semantic-promo-bolder`   |
| **Neutral** | `--text-semantic-neutral` | `--text-semantic-neutral-bolder` |
| **AI**      | `--text-semantic-ai`      | `--text-semantic-ai-bolder`      |

Tailwind usage: `text-semantic-danger`, `text-semantic-success-bolder`, etc.

### Link Colors

| Token                  | Tailwind Class       | State          |
| ---------------------- | -------------------- | -------------- |
| `--text-link-default`  | `text-link-default`  | Resting        |
| `--text-link-hover`    | `text-link-hover`    | Hovered        |
| `--text-link-active`   | `text-link-active`   | Clicked/active |
| `--text-link-disabled` | `text-link-disabled` | Disabled       |

## Typography Tokens

### Font Sizes

Typography size tokens follow a scale from `xs` to `9xl`:

| Token                           | Usage                    |
| ------------------------------- | ------------------------ |
| `--typo-body-size`              | Default body text size   |
| `--typo-body-lineheight-normal` | Default body line height |

Size scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`,
`7xl`, `8xl`, `9xl`

### Tailwind Text Size Classes

UDS overrides Tailwind's standard text size classes via `@theme` so they use UDS
typography tokens. These are platform-dependent (`comfortable` vs `compact`):

| Tailwind Class                | Mapped Token         |
| ----------------------------- | -------------------- |
| `text-xs`                     | `--typo-xs-size`     |
| `text-sm`                     | `--typo-sm-size`     |
| `text-lg`                     | `--typo-lg-size`     |
| `text-xl`                     | `--typo-xl-size`     |
| `text-2xl` through `text-9xl` | `--typo-{size}-size` |

Custom composite utilities that set **both** font-size and line-height:

| Tailwind Class      | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `text-body`         | Body text with normal line height         |
| `text-body-compact` | Body text with compact line height        |
| `text-sm-compact`   | Small text with compact line height       |
| `text-sm-large`     | Small text with large line height         |
| `text-xs-compact`   | Extra-small text with compact line height |
| `text-lg-compact`   | Large text with compact line height       |
| `text-xl-compact`   | Extra-large text with compact line height |

See [tailwind-utilities.md](../tailwind-utilities.md) for full details.

### Font Families

| Token              | Tailwind Class | Purpose                            |
| ------------------ | -------------- | ---------------------------------- |
| `--uds-font-base`  | `font-base`    | Body text, UI labels, descriptions |
| `--uds-font-title` | `font-title`   | Headings and display text          |
| `--uds-font-code`  | `font-code`    | Code blocks and monospaced content |
| `--uds-font-print` | `font-print`   | Print stylesheets                  |

Usage in CSS:

```css
font-family: var(--uds-font-base);
font-family: var(--uds-font-title);
font-family: var(--uds-font-code);
```

Or with Tailwind classes:

```html
<h1 class="font-title text-3xl">Heading</h1>
<p class="font-base text-body">Body paragraph</p>
<code class="font-code text-sm">Code snippet</code>
```

### Font Weights

| Token                      | Tailwind Class | Value           |
| -------------------------- | -------------- | --------------- |
| `--uds-font-weight-normal` | `font-normal`  | Regular weight  |
| `--uds-font-weight-bold`   | `font-bold`    | Bold weight     |
| `--uds-font-weight-black`  | `font-black`   | Heaviest weight |

## Usage Examples

```html
<!-- Standard text hierarchy -->
<h1 class="text-base" style="font-family: var(--uds-font-title)">Page Title</h1>
<p class="text-subtle">Supporting description text</p>

<!-- Semantic text -->
<span class="text-semantic-danger">This field is required</span>
<span class="text-semantic-success">Payment confirmed</span>

<!-- Links -->
<a class="text-link-default hover:text-link-hover active:text-link-active">
  Learn more
</a>

<!-- Inverted text on dark background -->
<div class="bg-surface-base-invert">
  <p class="text-base-invert">White text on dark background</p>
</div>
```

## Best Practices

**DO:**

- Use `text-base` for primary content and `text-subtle` for secondary content.
- Use semantic text colors for validation messages and status indicators.
- Use link tokens for all interactive text links.
- Pair `--uds-font-title` with headings and `--uds-font-base` with body text.

**DON'T:**

- Apply raw color utilities (`text-gray-500`) — they bypass theming.
- Use `text-disabled` for decorative de-emphasis — use `text-subtle` instead.
- Mix font families arbitrarily — follow the title/body/code convention.
