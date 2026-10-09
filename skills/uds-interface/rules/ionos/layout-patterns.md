## Layout Patterns and Component Selection

Interface elements come from the UDS kit (`./kit`, see the prompt section "# UDS kit"). The
patterns below hand-build only the layout `div`s (position, grid, gaps, padding) and place kit
components in them. Never import a raw `@ionos-web-design-system/react/*` component other than
`ThemeProvider`.

### Navigation / Header

```tsx
import { svgData as ionosLogo } from '@ionos-web-design-system/icon/brandmark/ionos-light';
import { KitButton, KitText } from './kit';

<div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '16px 32px', background: 'var(--surface-base)' }}>
  <img src={ionosLogo} alt="IONOS" style={{ height: 24, width: 'auto', display: 'block' }} />
  <div style={{ display: 'flex', gap: 24, flex: 1 }}>
    {[texts.nav1, texts.nav2, texts.nav3].map((item, i) => (
      <KitText key={i} variant="bodySm" weight="bold">{item ?? ''}</KitText>
    ))}
  </div>
  <KitButton label={texts.signIn ?? ''} variant="secondary" size="small" />
</div>
```

### Hero / Banner Section

```tsx
import { KitButton, KitText } from './kit';

// A dark section is a nested root carrying BOTH data-brand and data-color-scheme
// (the core tokens match them on the same element).
<div data-brand={brand} data-color-scheme="dark"
     style={{ background: 'var(--surface-base)', padding: '96px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
  <KitText variant="heading3xl" weight="bold" align="center">{texts.heroTitle ?? ''}</KitText>
  <KitText variant="bodyXl" tone="subtle" align="center">{texts.heroBody ?? ''}</KitText>
  <div style={{ marginTop: 16 }}>
    <KitButton label={texts.heroCta ?? ''} size="large" />
  </div>
</div>
```

### Card Grid

```tsx
import { KitCard, KitText } from './kit';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '48px 32px' }}>
  {[1, 2, 3].map((n) => (
    <KitCard key={n}>
      <KitText variant="headingLg" weight="bold">{texts[`card${n}Title`] ?? ''}</KitText>
      <KitText tone="subtle">{texts[`card${n}Body`] ?? ''}</KitText>
    </KitCard>
  ))}
</div>
```

### Form / Input Section

```tsx
import { KitButton, KitText } from './kit';

<div style={{ maxWidth: 448, margin: '0 auto', padding: '64px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
  <KitText variant="bodySm" tone="subtle">{texts.emailLabel ?? ''}</KitText>
  <div style={{ border: '1px solid var(--border-input-default, #718095)', borderRadius: 8, padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-input-default)' }}><KitText>{texts.emailHint ?? ''}</KitText></div>
  <KitText variant="bodySm" tone="subtle">{texts.passwordLabel ?? ''}</KitText>
  <div style={{ border: '1px solid var(--border-input-default, #718095)', borderRadius: 8, padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-input-default)' }}><KitText>{'••••••••'}</KitText></div>
  <KitButton label={texts.signIn ?? ''} />
</div>
```

### Dashboard / Data Layout

```tsx
import { KitCard, KitText } from './kit';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 32 }}>
  {/* Stat cards */}
  {[1, 2, 3, 4].map((n) => (
    <KitCard key={n}>
      <KitText variant="bodySm" tone="subtle">{texts[`stat${n}Label`] ?? ''}</KitText>
      <KitText variant="heading2xl" weight="bold">{texts[`stat${n}Value`] ?? ''}</KitText>
    </KitCard>
  ))}
</div>
```

Other kit elements fill the same roles: tab strips are `KitTabs`, toggles `KitSwitch`, checkboxes
`KitCheckbox`, initials circles `KitAvatar`, progress bars/rings `KitProgress`, loading rows
`KitSkeleton`, icon actions `KitIconButton`.

---
