# Disclosure

## Import

```tsx
import Disclosure from '@ionos-web-design-system/react/disclosure';
```

## Props

| Prop           | Type                      | Default    | Description                       |
| -------------- | ------------------------- | ---------- | --------------------------------- |
| `trigger`      | `React.ReactNode`         | _required_ | Header/toggle content             |
| `children`     | `React.ReactNode`         | —          | Expandable content                |
| `icon`         | `() => string`            | —          | Custom icon function              |
| `open`         | `boolean`                 | —          | Controlled open state             |
| `defaultOpen`  | `boolean`                 | `false`    | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | —          | Called when open state changes    |
| `disabled`     | `boolean`                 | `false`    | Disables toggling                 |

## Description

An expandable section that shows/hides content with a plus/minus icon animation.
Supports both controlled and uncontrolled modes.

## Usage

### Uncontrolled (default)

```tsx
<Disclosure trigger="Show more details" defaultOpen={false}>
  <Text>Hidden content revealed on click.</Text>
</Disclosure>
```

### Controlled

```tsx
<Disclosure trigger="Advanced settings" open={isOpen} onOpenChange={setIsOpen}>
  <Text>Settings content here</Text>
</Disclosure>
```

### Initially open

```tsx
<Disclosure trigger="FAQ Answer" defaultOpen>
  <Text>This content is visible by default.</Text>
</Disclosure>
```

### Disabled

```tsx
<Disclosure trigger="Locked section" disabled>
  <Text>Cannot be toggled.</Text>
</Disclosure>
```

## Do

- Use for progressive disclosure of optional or secondary content.
- Use `defaultOpen` for sections that should start expanded.
- Group related disclosures for FAQ-style layouts.

## Don't

- Use for critical information that users must see — show it directly.
- Nest disclosures more than one level deep.
- Mix controlled (`open`) and uncontrolled (`defaultOpen`) props on the same
  instance.
