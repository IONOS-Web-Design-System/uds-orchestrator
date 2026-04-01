# Typography Quick Reference

## Text Component Decision Tree

```
Styled text detected -->
  1. ALWAYS use <Text variant="..." weight="..." color="..."> for styled text
  2. Use asChild to render the correct semantic HTML element:
     - Headings   --> <Text variant="heading5xl" asChild><h1>...</h1></Text>
     - Paragraphs --> <Text variant="body" asChild><p>...</p></Text>
     - Inline     --> <Text variant="bodySm" asChild><span>...</span></Text>
  3. Only use raw text color tokens (text-subtle, text-muted) when
     Text component is unsuitable or unavailable
```

## Color Prop

| Visual Appearance     | Text `color` prop |
| --------------------- | ----------------- |
| Default/primary text  | `default` or omit |
| Base text             | `base`            |
| Muted/secondary text  | `muted`           |
| Subtle/tertiary text  | `subtle`          |
| Warning text          | `warning`         |
| Promotional text      | `promotion`       |
| Error/danger text     | `destructive`     |
| Accent/highlight text | `accent`          |
| AI-themed text        | `ai`              |

## Lists and Rich Text via Text Markdown

Use the `Text` component with markdown strings for bullet lists:

```tsx
{
  /* Ordered lists -> BulletIndex */
}
<Text variant="body">{`
1. Create your account
2. Choose your plan
3. Start building
`}</Text>;

{
  /* Brand checkmarks -> use [c] marker */
}
<Text variant="body">{`
- [c] Free SSL certificate
- [c] 24/7 support
`}</Text>;

{
  /* Plain unordered lists -> styled bullets */
}
<Text variant="body">{`
- Feature one
- Feature two
`}</Text>;

{
  /* Icon bullets -> auto-resolve from system group */
}
<Text>{`
- [icon:shield] Enterprise-grade security
- [icon:cloud-upload] Automatic daily backups
- [icon:globe] Global CDN network
`}</Text>;

{
  /* Tooltip info icon -> inline contextual help */
}
<Text>{`
- Feature one [?](More details about this feature)
- Feature two [?](Additional context here)
`}</Text>;

{
  /* Tooltip dashline link -> inline tooltip on link text */
}
<Text>
  {'Learn about [our pricing](~Flexible plans starting at $5/mo) today.'}
</Text>;
```

> For variant mapping table and full examples, see `rules/react-text.md`.
