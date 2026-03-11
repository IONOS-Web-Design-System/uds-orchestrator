# Tabs

## Import

```tsx
import Tabs, { TabItem } from '@ionos-web-design-system/react/tabs';
```

## Tabs Props

| Prop            | Type                         | Default        | Description                      |
| --------------- | ---------------------------- | -------------- | -------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab layout direction             |
| `value`         | `string`                     | —              | Controlled active tab            |
| `defaultValue`  | `string`                     | —              | Initial active tab               |
| `onValueChange` | `(value: string) => void`    | —              | Callback when active tab changes |

## TabItem Props

| Prop       | Type              | Default      | Description           |
| ---------- | ----------------- | ------------ | --------------------- |
| `value`    | `string`          | **required** | Unique tab identifier |
| `children` | `React.ReactNode` | **required** | Tab panel content     |
| `disabled` | `boolean`         | `false`      | Disables the tab      |

Features an animated underline indicator on the active tab.

## Usage

### Horizontal tabs

```tsx
<Tabs defaultValue="tab1">
  <TabItem value="tab1">Tab 1 content</TabItem>
  <TabItem value="tab2">Tab 2 content</TabItem>
  <TabItem value="tab3" disabled>
    Disabled tab content
  </TabItem>
</Tabs>
```

### Vertical tabs

```tsx
<Tabs orientation="vertical" defaultValue="settings">
  <TabItem value="settings">Settings panel content</TabItem>
  <TabItem value="profile">Profile panel content</TabItem>
  <TabItem value="billing">Billing panel content</TabItem>
</Tabs>
```

### Controlled

```tsx
const [activeTab, setActiveTab] = useState('overview')

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabItem value="overview">Overview</TabItem>
  <TabItem value="details">Details</TabItem>
  <TabItem value="reviews">Reviews</TabItem>
</Tabs>
```

## Do

- Always set a `defaultValue` or `value` so a tab is active on render.
- Use `orientation="vertical"` for sidebar-style navigation layouts.
- Keep tab labels concise (1-2 words).

## Don't

- Use tabs for sequential steps — use a stepper component instead.
- Create more than 6-7 tabs — consider alternative navigation patterns.
- Put tabs inside tabs — flatten the information architecture.
