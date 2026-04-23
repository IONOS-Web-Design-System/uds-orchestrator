# ComparisonTable

Product / plan comparison organism. Combines `CardTariff` columns in a sticky
header with `Table` rows grouped by collapsible `Accordion` sections, and
optionally a "show differences" `Switch` that hides rows where every cell is
equal across columns.

Desktop (`lg+`) renders the full grid — all tariff cards in the header, all
columns in every row. Mobile / tablet renders a horizontal carousel of tariff
cards with `SliderIndicator` dots; rows show only the column aligned to the
current carousel page. The header becomes sticky once the user scrolls past its
initial position and the prices collapse to save vertical space.

## Import

```tsx
import ComparisonTable from '@ionos-web-design-system/react/comparison-table';
import type {
  ComparisonTableProps,
  ComparisonTableRow,
  TableSection,
} from '@ionos-web-design-system/react/comparison-table';
```

## Props

| Prop                      | Type                  | Default | Description                                                                                                       |
| ------------------------- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `tariffCardsColumns`      | `CardTariffProps[]`   | —       | **Required.** One entry per column. Each is spread as props onto `CardTariff`. A column whose `badgeText` is truthy is auto-highlighted in rows via `desktopVariant="highlight"`. |
| `sections`                | `TableSection[]`      | —       | **Required.** Comparison rows grouped by `Accordion` section. See `TableSection` shape below.                     |
| `showDifferencesLabel`    | `string`              | —       | Label for the "show differences" `Switch`. When omitted the switch is not rendered.                               |
| `showDifferencesDefault`  | `boolean`             | `false` | Initial state of the "show differences" switch.                                                                   |
| `mobileCellMinWidth`      | `number`              | `243`   | Minimum cell / card width in px inside the mobile carousel and the mobile cell grid.                              |
| `stickyHeaderZIndex`      | `number`              | `100`   | `z-index` value applied to the sticky header wrapper.                                                             |
| `className`               | `string`              | —       | Merged onto the root `<div>`.                                                                                     |

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`.

### `TableSection` shape

| Field           | Type                    | Description                                                                                          |
| --------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `title`         | `string`                | **Required.** Section heading in the `AccordionItem` trigger. Also used as the section's unique key. |
| `rows`          | `ComparisonTableRow[]`  | **Required.** Rows in the section (uses the same shape as `Table`'s `rows`, plus `cellsToCompare`).  |
| `isDefaultOpen` | `boolean`               | When true, the section starts open. The first section defaults to open if this is undefined.        |
| `icon`          | `InjectIconFunction`    | Icon passed to the `AccordionItem` trigger (appears next to the heading).                            |

### `ComparisonTableRow` shape

Extends `TableRow` (see `table.md`):

| Field            | Type                                | Description                                                                                  |
| ---------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `title`          | `string`                            | **Required here.** Row label.                                                                |
| `cells`          | `React.ReactNode[]`                 | **Required.** One node per column (string, number, `<Icon>`, etc.).                          |
| `tooltip`        | `React.ReactNode`                   | Info-icon tooltip next to the row title.                                                     |
| `cellsToCompare` | `Array<string \| number \| boolean>`| Primitive values used by "show differences" to decide row equality. Falls back to `cells` when omitted — but if `cells` contains React elements (icons), supply primitives here for correct diffing. |

## Usage

### Typical four-plan comparison

```tsx
import ComparisonTable, { type TableSection } from '@ionos-web-design-system/react/comparison-table';
import Icon from '@ionos-web-design-system/react/icon';
import Button from '@ionos-web-design-system/react/button';
import { filledCircleCheckmark, filledMinus } from '@ionos-web-design-system/icon/system';

const CHECK = <Icon icon={filledCircleCheckmark} size="medium" />;
const MINUS = <Icon icon={filledMinus} size="medium" />;

const columns = [
  {
    title: 'Start',
    priceData: /* PriceData */,
    button: <Button className="w-full" size="small">Choose</Button>,
  },
  {
    title: 'Professional',
    badgeText: 'SPECIAL OFFER', // triggers row highlight in this column
    priceEmphasis: true,
    priceData: /* PriceData */,
    button: <Button className="w-full" size="small">Choose</Button>,
  },
  {
    title: 'Premium',
    priceData: /* PriceData */,
    button: <Button className="w-full" size="small">Choose</Button>,
  },
];

const sections: TableSection[] = [
  {
    title: 'Management',
    rows: [
      { title: 'Admin panel', cells: ['proprietary', 'proprietary', 'proprietary'] },
      {
        title: 'SSH console',
        tooltip: 'Secure Shell access for advanced management.',
        cells: [MINUS, CHECK, CHECK],
        cellsToCompare: [false, true, true], // primitives for diff detection
      },
    ],
  },
  {
    title: 'Security',
    icon: /* InjectIconFunction */,
    rows: [
      { title: 'SSL certificate', cells: ['Included', 'Included', 'Included'] },
      {
        title: 'Daily backup',
        cells: [MINUS, CHECK, CHECK],
        cellsToCompare: [false, true, true],
      },
    ],
  },
];

<ComparisonTable
  showDifferencesLabel="Show only differences"
  tariffCardsColumns={columns}
  sections={sections}
/>;
```

### Starting state for open sections

- If a section has `isDefaultOpen: true` → always starts open.
- If a section has `isDefaultOpen: false` → always starts closed.
- If `isDefaultOpen` is `undefined` → the first section starts open and the
  rest start closed.

### Sticky header tuning

```tsx
<ComparisonTable
  {...rest}
  stickyHeaderZIndex={200}    // raise above a site-wide sticky nav
  mobileCellMinWidth={280}    // wider mobile cards/cells
/>
```

## "Show differences" behaviour

When `showDifferencesLabel` is supplied, a `Switch` appears in the desktop
header. Toggling it on filters out any row where all `cellsToCompare` values
are equal (falling back to `cells` when `cellsToCompare` is missing).

- For numeric / string rows, omit `cellsToCompare` — `cells` is compared.
- For icon rows (check / minus), **always provide** `cellsToCompare` with
  primitive booleans — comparing React elements by reference produces
  false negatives.

## Responsive layout

- **Desktop (`lg+`)** — grid with one column per `tariffCardsColumns` entry
  plus a leading "switch" column; all rows show all columns at once.
- **Mobile / tablet (`<lg`)** — horizontal carousel of `CardTariff`s with
  `SliderIndicator` dots; the visible cell column follows the active carousel
  page.
- **Sticky header** — once the header scrolls off-screen it fixes to the top,
  hides prices (`hidePrice`), and uses `shadow-xs` (or `shadow-md` on
  `homepl`). A spacer preserves the original height.

## Composition

Under the hood `ComparisonTable` composes:

- `CardTariff` — one per column in the header
- `Accordion` / `AccordionItem` — one per section
- `Table` — per section body (re-using `highlightedColumnIndex`)
- `SliderIndicator` — mobile pagination dots
- `Switch` + `SwitchLabel` — desktop "show differences" toggle
- Internal hooks: `useComparisonTableScroll`, `useComparisonTableSticky`

If you need one of those primitives standalone, import them directly instead of
wrapping `ComparisonTable`.

## Accessibility

- The accordion body sets `aria-live="polite"` so screen readers announce
  section toggles and "show differences" filter changes.
- Individual rows follow `Table`'s ARIA roles (`role="row"`, `role="cell"`).
- Icon cells are purely visual — provide `cellsToCompare` with primitives so
  the "show differences" filter doesn't depend on element reference equality.
- Row tooltips render an `info` `ButtonIcon` that is keyboard-focusable via
  `Tooltip`.

## Do

- Use for 2–5 plan comparisons. Above 5 columns the mobile carousel becomes
  unusable and the desktop grid over-wraps.
- Mark the promoted column with `badgeText` on its `CardTariffProps`; the
  matching cells are highlighted on desktop automatically.
- Provide `cellsToCompare` whenever `cells` contains React nodes (icons,
  badges, custom elements) to get correct "show differences" filtering.
- Set `stickyHeaderZIndex` higher than your site-wide sticky header / nav bar
  when both are on the page.
- Pre-open the section that's most relevant via `isDefaultOpen` (first
  section is already opened by default).

## Don't

- Hand-roll the carousel / sticky behaviour — this component already
  coordinates scroll, carousel position, and header stickiness via internal
  hooks.
- Put different numbers of `cells` across rows — every row must have exactly
  `tariffCardsColumns.length` cells.
- Assume `cells` comparison is deep-equal — it uses `Array.every` on raw
  values, so React elements always compare as unequal. Use `cellsToCompare`.
- Wrap `ComparisonTable` in a container that constrains width with
  `overflow: hidden` — mobile carousel breakout uses negative margins to
  reach the viewport edges.
- Mix `CardTariff` rendering outside the component with it inside — the
  component owns the sticky / carousel coordination for its cards.
