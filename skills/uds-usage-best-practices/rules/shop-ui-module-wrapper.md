# ModuleWrapper

Layout wrapper that frames a content section with heading, subheading, and
optional CTA buttons.

## Import

```tsx
import ModuleWrapper from '@ionos-web-design-system/shop-ui/module-wrapper';
```

## Props

| Prop            | Type                         | Default        | Description                    |
| --------------- | ---------------------------- | -------------- | ------------------------------ |
| `heading`       | `string`                     | —              | Main heading text              |
| `subheading`    | `string`                     | —              | Secondary heading text         |
| `headingLayout` | `'vertical' \| 'horizontal'` | `'vertical'`   | Heading/subheading arrangement |
| `children`      | `ReactNode`                  | **(required)** | Content area                   |
| `buttons`       | `ModuleWrapperButton[]`      | —              | Bottom button group            |
| `spacing`       | `'default' \| 'compact'`     | `'default'`    | Internal spacing               |

### ModuleWrapperButton

```ts
{
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'tertiary'
  concept?: 'brand' | 'monochrome'
  size?: 'small' | 'medium' | 'large'
}
```

## Usage

### Standard layout with CTAs

```tsx
<ModuleWrapper
  heading="Our Products"
  subheading="Choose the right plan for your needs"
  buttons={[
    { label: 'View all', variant: 'secondary' },
    { label: 'Get started', variant: 'primary' },
  ]}
>
  <div>Product cards here</div>
</ModuleWrapper>
```

### Horizontal heading with compact spacing

```tsx
<ModuleWrapper heading="Features" headingLayout="horizontal" spacing="compact">
  <div>Feature grid</div>
</ModuleWrapper>
```

### Content only (no heading)

```tsx
<ModuleWrapper>
  <div>Standalone content block</div>
</ModuleWrapper>
```

## Do's and Don'ts

- **Do**: Use `headingLayout="horizontal"` when the subheading is short or acts
  as a tagline.
- **Do**: Use `buttons` for CTAs that relate to the entire section content.
- **Do**: Use `spacing="compact"` for dense layouts like feature grids.
- **Don't**: Use more than 3 buttons — prioritize actions and reduce decision
  fatigue.
- **Don't**: Nest ModuleWrapper inside another ModuleWrapper — use a single
  wrapper per section.
