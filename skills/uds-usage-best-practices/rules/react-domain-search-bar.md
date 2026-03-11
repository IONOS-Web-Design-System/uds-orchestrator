# DomainSearchBar

## Import

```tsx
import DomainSearchBar from '@ionos-web-design-system/react/domain-search-bar';
```

## Props

| Prop               | Type                            | Default                  | Description                        |
| ------------------ | ------------------------------- | ------------------------ | ---------------------------------- |
| `variant`          | `'single-line' \| 'multi-line'` | `'single-line'`          | Layout mode                        |
| `badge`            | `DomainBadgeProps`              | —                        | Optional inline badge display      |
| `value`            | `string`                        | —                        | Controlled input value             |
| `defaultValue`     | `string`                        | —                        | Initial input value (uncontrolled) |
| `keywords`         | `Keyword[]`                     | —                        | Controlled keyword list            |
| `defaultKeywords`  | `Keyword[]`                     | —                        | Initial keywords (uncontrolled)    |
| `placeholder`      | `string`                        | `'Enter domain name...'` | Input placeholder                  |
| `buttons`          | `ButtonConfig[]`                | —                        | Search button configuration        |
| `responsiveButton` | `boolean`                       | `true`                   | Button adapts to screen size       |
| `buttonPosition`   | `'default' \| 'outside'`        | `'default'`              | Button placement                   |
| `disabled`         | `boolean`                       | `false`                  | Disables the search bar            |
| `loading`          | `boolean`                       | `false`                  | Shows loading state                |
| `bulkSearch`       | `boolean`                       | `false`                  | Enable keyword/multi-domain mode   |
| `helperText`       | `string`                        | —                        | Helper text below input            |
| `emphasis`         | `boolean`                       | `false`                  | Light theme for input              |
| `onChange`         | `(value: string) => void`       | —                        | Input change handler               |
| `onSearch`         | `(value: string) => void`       | —                        | Search submit handler              |
| `onKeywordAdd`     | `(keyword: Keyword) => void`    | —                        | Keyword added handler              |
| `onKeywordRemove`  | `(keyword: Keyword) => void`    | —                        | Keyword removed handler            |
| `onKeywordsChange` | `(keywords: Keyword[]) => void` | —                        | All keywords changed handler       |

## Compound Components

- `DomainSearchBar.Badge` — Inline badge within the search bar

## Usage

### Basic search

```tsx
<DomainSearchBar
  placeholder="Find your domain"
  buttons={[{ label: 'Search', onClick: handleSearch }]}
  onSearch={(value) => console.log(value)}
/>
```

### Bulk/multi-domain search

```tsx
<DomainSearchBar
  variant="multi-line"
  bulkSearch
  buttons={[{ label: 'Search All' }]}
  onSearch={handleBulkSearch}
/>
```

### With badge and emphasis

```tsx
<DomainSearchBar
  emphasis
  badge={{ tld: '.com' }}
  buttons={[{ label: 'Search' }]}
  onSearch={handleSearch}
/>
```

### With helper text

```tsx
<DomainSearchBar
  placeholder="yourdomain.com"
  helperText="Enter a domain name to check availability"
  buttons={[{ label: 'Check' }]}
/>
```

## Do

- Use `emphasis` for hero sections with dark backgrounds.
- Use `bulkSearch` with `variant="multi-line"` for multi-domain input.
- Provide `onSearch` for form submission handling.

## Don't

- Use `variant="multi-line"` without `bulkSearch` enabled.
- Omit the `buttons` prop — the search bar needs at least one action button.
- Use `loading` and `disabled` at the same time.
