# ContentTabs

## Import

```tsx
import ContentTabs, {
  ContentTabItem,
} from '@ionos-web-design-system/react/content-tabs';
```

## ContentTabs Props

| Prop            | Type                      | Default | Description                      |
| --------------- | ------------------------- | ------- | -------------------------------- |
| `value`         | `string`                  | —       | Controlled active tab            |
| `defaultValue`  | `string`                  | —       | Initial active tab               |
| `onValueChange` | `(value: string) => void` | —       | Callback when active tab changes |

Always renders in horizontal orientation.

## ContentTabItem Props

| Prop       | Type              | Default      | Description           |
| ---------- | ----------------- | ------------ | --------------------- |
| `value`    | `string`          | **required** | Unique tab identifier |
| `children` | `React.ReactNode` | **required** | Tab panel content     |
| `disabled` | `boolean`         | `false`      | Disables the tab      |

Specialized tabs variant with bottom shadow styling, designed for page-level
content switching.

## Usage

### Basic

```tsx
<ContentTabs defaultValue="overview">
  <ContentTabItem value="overview">Overview content</ContentTabItem>
  <ContentTabItem value="features">Features content</ContentTabItem>
  <ContentTabItem value="pricing">Pricing content</ContentTabItem>
</ContentTabs>
```

### Controlled

```tsx
const [section, setSection] = useState('overview')

<ContentTabs value={section} onValueChange={setSection}>
  <ContentTabItem value="overview">
    <Text variant="headingLg">Product Overview</Text>
    <Text>Detailed product information here.</Text>
  </ContentTabItem>
  <ContentTabItem value="specs">
    <Text variant="headingLg">Specifications</Text>
    <Text>Technical specifications here.</Text>
  </ContentTabItem>
</ContentTabs>
```

### With disabled tab

```tsx
<ContentTabs defaultValue="current">
  <ContentTabItem value="current">Current plan details</ContentTabItem>
  <ContentTabItem value="upgrade">Upgrade options</ContentTabItem>
  <ContentTabItem value="history" disabled>
    History (coming soon)
  </ContentTabItem>
</ContentTabs>
```

## ContentTabs vs Tabs

| Feature     | ContentTabs        | Tabs                   |
| ----------- | ------------------ | ---------------------- |
| Orientation | Horizontal only    | Horizontal or vertical |
| Styling     | Bottom shadow      | Underline indicator    |
| Use case    | Page-level content | UI-level navigation    |

## Do

- Use ContentTabs for top-level page content switching.
- Always set `defaultValue` so content is visible on initial render.
- Keep tab labels short and descriptive.

## Don't

- Use ContentTabs for navigation — use `Tabs` instead.
- Mix ContentTabs and Tabs in the same view — pick one pattern.
- Nest ContentTabs within other tab components.
