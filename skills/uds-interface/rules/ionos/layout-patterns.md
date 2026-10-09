## Layout Patterns and Component Selection

Interface elements come from the UDS kit (`./kit`, see the prompt section "# UDS kit"). The
patterns below hand-build only the layout `div`s (position, grid, gaps, padding, plane fills) and
place kit components in them; tiers and type roles follow `ionos/visual-language.md`. Never import
a raw `@ionos-web-design-system/react/*` component other than `ThemeProvider`.

### Header

```tsx
import { svgData as ionosLogo } from '@ionos-web-design-system/icon/brandmark/ionos-light';
import search from '@ionos-web-design-system/icon/system/search';
import bell from '@ionos-web-design-system/icon/system/bell';
import { KitIcon, KitIconButton, KitText } from './kit';

<div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '12px 32px', background: 'var(--surface-base)', borderBottom: '1px solid var(--border-base)' }}>
  <img src={ionosLogo} alt="IONOS" style={{ height: 22, width: 'auto', display: 'block' }} />
  <div style={{ flex: 1, maxWidth: 420, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'var(--surface-subtle)' }}>
    <KitIcon icon={search} size="small" />
    <KitText variant="bodySm" tone="subtle">{texts.searchHint ?? ''}</KitText>
  </div>
  <KitIconButton icon={bell} title={texts.notifications ?? ''} />
</div>
```

### Page plane, title and card grid

```tsx
import { KitButton, KitCard, KitText } from './kit';

<div style={{ background: 'var(--surface-subtle)', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <KitText variant="heading4xl">{texts.pageTitle ?? ''}</KitText>
      <KitText variant="bodyLg" tone="subtle">{texts.pageIntro ?? ''}</KitText>
    </div>
    <KitButton label={texts.primaryCta ?? ''} />
  </div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
    {[1, 2, 3].map((n) => (
      <KitCard key={n}>
        <KitText variant="headingLg" weight="semibold">{texts[`card${n}Title`] ?? ''}</KitText>
        <KitText tone="subtle">{texts[`card${n}Body`] ?? ''}</KitText>
      </KitCard>
    ))}
  </div>
</div>
```

### Form

A white card on the plane; fields are drawn (the only stroked element), labels `bodySm` semibold.

```tsx
<KitCard>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 448 }}>
    <KitText variant="headingXl" weight="semibold">{texts.formTitle ?? ''}</KitText>
    <KitText variant="bodySm" weight="semibold">{texts.emailLabel ?? ''}</KitText>
    <div style={{ border: '1px solid var(--border-input-default, #718095)', borderRadius: 8, padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-input-default)' }}><KitText>{texts.emailHint ?? ''}</KitText></div>
    <KitButton label={texts.submit ?? ''} />
  </div>
</KitCard>
```

### Dashboard / data

Stat tiles are `KitCard`s on the plane (gap 8): label `bodySm` `tone="subtle"`, value
`heading2xl` `weight="semibold"`. A list or table sits in ONE white card; its rows are separated by
spacing or a hairline divider, and a selected row is a `surface-subtle` band.

Other kit elements fill the same roles: tab strips are `KitTabs`, toggles `KitSwitch`, checkboxes
`KitCheckbox`, initials circles `KitAvatar`, progress bars/rings `KitProgress`, loading rows
`KitSkeleton`, status chips `KitPill`.
