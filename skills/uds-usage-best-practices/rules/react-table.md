# Table

Comparison-style data table for feature matrices and tariff sheets. Renders
rows with equal-width cells using CSS Grid; on desktop the row title appears as
the first column, on mobile it stacks above the cells and the cell grid scrolls
horizontally. Not a general-purpose data grid — use it for fixed content like
"Feature × Plan" layouts.

## Import

```tsx
import Table from '@ionos-web-design-system/react/table';
// or, with exported types:
// import Table, { type TableProps, type TableRow } from '@ionos-web-design-system/react/table';
```

## Composition

Two usage modes:

1. **Data mode (recommended)** — pass `rows` prop with titles + cell content;
   `Table` handles the internal `Row` / `Cell` layout and the alternating mobile
   variant.
2. **Composition mode** — compose `<Table.Row>` and `<Table.Cell>` manually
   when you need custom controls per cell (links, buttons, badges) beyond what
   `TableRow.cells` accepts.

## Props

| Prop                     | Type                | Default | Description                                                                                 |
| ------------------------ | ------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `rows`                   | `TableRow[]`        | —       | **Required.** Array of rows. See `TableRow` shape below.                                    |
| `highlightedColumnIndex` | `number`            | `-1`    | 0-based index of the column to highlight on desktop. `-1` disables highlighting.             |
| `mobileCellMinWidth`     | `number`            | `243`   | Minimum cell width in px on mobile. Controls the horizontal-scroll breakpoint of the grid.  |
| `className`              | `string`            | —       | Merged onto the scroll wrapper.                                                             |

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`.

### `TableRow` shape

| Field     | Type                | Description                                                                          |
| --------- | ------------------- | ------------------------------------------------------------------------------------ |
| `title`   | `string`            | Row label. Desktop: first-column cell. Mobile: block above the cells.                |
| `tooltip` | `React.ReactNode`   | Tooltip content shown next to the title via an `info` `ButtonIcon`.                  |
| `cells`   | `React.ReactNode[]` | **Required.** Cell contents — strings, numbers, icons, or any node. One per column.  |

## `Table.Row` Props

| Prop                  | Type                        | Default       | Description                                                    |
| --------------------- | --------------------------- | ------------- | -------------------------------------------------------------- |
| `children`            | `React.ReactNode`           | —             | **Required.** `Table.Cell` children (one per column).          |
| `title`               | `string`                    | —             | Row title (same rendering as `TableRow.title`).                |
| `tooltip`             | `React.ReactNode`           | —             | Tooltip content next to the title.                             |
| `mobileVariant`       | `'default' \| 'highlight'`  | `'default'`   | Mobile row background. `Table` alternates automatically.       |
| `mobileCellMinWidth`  | `number`                    | `243`         | Minimum cell width in px on mobile.                            |

Extends `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`.

## `Table.Cell` Props

| Prop              | Type                              | Default     | Description                                                     |
| ----------------- | --------------------------------- | ----------- | --------------------------------------------------------------- |
| `children`        | `React.ReactNode`                 | —           | Cell content. Non-string children are wrapped via `TextBase asChild`. |
| `desktopVariant`  | `'default' \| 'highlight'`        | `'default'` | Background variant on desktop. Used internally to light up `highlightedColumnIndex`. |
| `align`           | `'left' \| 'center' \| 'right'`   | `'left'`    | Horizontal alignment of cell content.                           |

Extends `React.HTMLAttributes<HTMLDivElement>`.

## Usage

### Feature comparison with a highlighted plan column

```tsx
import Table, { type TableRow } from '@ionos-web-design-system/react/table';
import Icon from '@ionos-web-design-system/react/icon';
import { filledCircleCheckmark, filledMinus } from '@ionos-web-design-system/icon/system';

const CHECK = <Icon icon={filledCircleCheckmark} size="medium" color="base" />;
const MINUS = <Icon icon={filledMinus} size="medium" color="base" />;

const rows: TableRow[] = [
  { title: 'Admin panel', cells: ['proprietary', 'proprietary', 'proprietary', 'proprietary'] },
  { title: 'SSH console', cells: [MINUS, MINUS, CHECK, CHECK] },
  { title: 'FTP accounts', cells: ['unlimited', 'unlimited', 'unlimited', 'unlimited'] },
  { title: 'Server storage', cells: ['70 GB', '150 GB', '250 GB', '400 GB'] },
  { title: 'Annual transfer', cells: ['1 TB', '2 TB', '5 TB', '10 TB'] },
];

<Table rows={rows} highlightedColumnIndex={2} />;
```

### Row title with an info tooltip

```tsx
<Table
  rows={[
    {
      title: 'Annual transfer',
      tooltip: 'Total outbound traffic included per billing year.',
      cells: ['1 TB', '2 TB', '5 TB', '10 TB'],
    },
  ]}
/>
```

### Rows without titles (cell-only grid)

```tsx
<Table rows={rows.map(({ cells }) => ({ cells }))} />
```

### Composition mode with custom cell controls

```tsx
<Table.Row title="Select plan">
  <Table.Cell align="center"><Button>Starter</Button></Table.Cell>
  <Table.Cell align="center"><Button>Pro</Button></Table.Cell>
  <Table.Cell align="center" desktopVariant="highlight"><Button concept="brand">Premium</Button></Table.Cell>
  <Table.Cell align="center"><Button>Enterprise</Button></Table.Cell>
</Table.Row>
```

## Responsive behavior

- **Desktop (`lg`+)** — title is the first cell in a `grid-cols: auto-cols-fr`
  grid, making all cells equal width.
- **Mobile (`<lg`)** — title renders as a separate block above the cells; the
  cell grid becomes horizontally scrollable with each cell sized to at least
  `mobileCellMinWidth`. Scrollbars are hidden (`scrollbar-width: none`).
- Rows alternate `mobileVariant` on mobile (`default` / `highlight`) to create
  zebra striping — `Table` handles this automatically when using `rows`.

## Accessibility

- Root uses `role="table"`, rows use `role="row"`, cells use `role="cell"` —
  NOT semantic `<table>` / `<tr>` / `<td>`. This keeps the grid layout and
  mobile stacking simple, at the cost of native table semantics.
- If you need screen-reader-grade tabular semantics (column headers, sortable
  columns, captions), this component is **not the right primitive** — build a
  native `<table>` instead.
- Row titles are rendered with `TextBase` (weight bold, body-sm) — ensure they
  read as short, recognisable labels.

## Do

- Use `Table` for fixed comparison grids: feature × plan, specs tables, tariff
  sheets.
- Pass cells as a node array — mix strings, numbers, `<Icon>`, `<Badge>`,
  `<Pill>` freely.
- Use `highlightedColumnIndex` to call out a recommended plan on desktop.
- Supply `tooltip` on rows whose label needs explanation, not a separate legend.
- Compose with `Table.Row` / `Table.Cell` when a row needs controls that
  `TableRow.cells` can't easily express.

## Don't

- Use this for sortable, filterable, or virtualized data — it is not a data
  grid.
- Rely on native `<table>` semantics — the internal `role` attributes are ARIA
  roles on `<div>` elements.
- Mix `rows` + `Table.Row` children at the same time — pick one mode per
  `<Table>`.
- Hardcode column widths via `className` on cells — cells are sized by the CSS
  grid (`auto-cols-fr` on desktop).
- Use for page-length data (hundreds of rows) — each row mounts its own grid,
  which isn't virtualized.
