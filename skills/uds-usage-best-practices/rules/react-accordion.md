# Accordion

## Import

```tsx
import Accordion, {
  AccordionItem,
} from '@ionos-web-design-system/react/accordion';
```

## Accordion Props

| Prop            | Type                     | Default | Description                                                |
| --------------- | ------------------------ | ------- | ---------------------------------------------------------- |
| `type`          | `'single' \| 'multiple'` | —       | `single` opens one panel at a time, `multiple` allows many |
| `collapsible`   | `boolean`                | `false` | Only for `type="single"`: allows closing all panels        |
| `value`         | `string \| string[]`     | —       | Controlled open panel(s)                                   |
| `defaultValue`  | `string \| string[]`     | —       | Initial open panel(s)                                      |
| `onValueChange` | `(value) => void`        | —       | Callback when open panels change                           |

## AccordionItem Props

| Prop       | Type              | Default      | Description                    |
| ---------- | ----------------- | ------------ | ------------------------------ |
| `value`    | `string`          | —            | Unique identifier for the item |
| `trigger`  | `React.ReactNode` | **required** | Header content                 |
| `children` | `React.ReactNode` | **required** | Panel content                  |

## Usage

### Single collapsible (FAQ)

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1" trigger="What is UDS?">
    UDS is a Universal Design System for building consistent interfaces.
  </AccordionItem>
  <AccordionItem value="item-2" trigger="How do I install it?">
    Install via npm: npm install @ionos-web-design-system/react
  </AccordionItem>
  <AccordionItem value="item-3" trigger="Which frameworks are supported?">
    React and Web Components are supported.
  </AccordionItem>
</Accordion>
```

### Multiple open panels

```tsx
<Accordion type="multiple" defaultValue={['section-1']}>
  <AccordionItem value="section-1" trigger="General Settings">
    General configuration options.
  </AccordionItem>
  <AccordionItem value="section-2" trigger="Advanced Settings">
    Advanced configuration options.
  </AccordionItem>
</Accordion>
```

### Controlled

```tsx
const [value, setValue] = useState<string>('item-1')

<Accordion type="single" collapsible value={value} onValueChange={setValue}>
  <AccordionItem value="item-1" trigger="Section 1">Content 1</AccordionItem>
  <AccordionItem value="item-2" trigger="Section 2">Content 2</AccordionItem>
</Accordion>
```

## Do

- Use `type="single"` with `collapsible` for FAQ sections.
- Use `type="multiple"` when sections are independent and users may need several
  open.
- Provide unique `value` props to each `AccordionItem`.

## Don't

- Nest accordions inside accordions.
- Use `collapsible` with `type="multiple"` — it has no effect.
- Put critical content in collapsed panels that users might miss.
