# Icon Groups

All 9 icon groups with import paths, icon counts, and usage details.

---

## system (674 icons)

Core UI icons for navigation, actions, and status indicators.

```ts
import {
  plus,
  minus,
  arrowDown,
  checkmark,
  chevronDown,
  xmark,
  bell,
} from '@ionos-web-design-system/icon/system';
```

Many icons have a `300` weight variant for a lighter appearance (e.g.,
`plus300`, `arrowDown300`).

Common icons: `accessibility`, `archive`, `arrowDown`, `arrowLeft`,
`arrowRight`, `arrowUp`, `bell`, `bin`, `bookmark`, `calendar`, `camera`,
`cart`, `chat`, `checkmark`, `chevronDown`, `chevronLeft`, `chevronRight`,
`chevronUp`, `clipboard`, `clock`, `cloud`, `copy`, `download`, `edit`, `eye`,
`filter`, `globe`, `heart`, `home`, `info`, `link`, `lock`, `mail`, `menu`,
`minus`, `notification`, `plus`, `search`, `settings`, `share`, `star`,
`upload`, `user`, `xmark`.

---

## social (15 icons)

Social media platform logos.

```ts
import {
  github,
  linkedin,
  youtube,
  facebook,
  x,
} from '@ionos-web-design-system/icon/social';
```

All icons: `apple`, `atlassianConfluence`, `atlassianJira`, `facebook`,
`github`, `google`, `googlePlus`, `instagram`, `linkedin`, `rss`, `tiktok`,
`wordpress`, `x`, `xing`, `youtube`.

---

## ionos (844 icons)

IONOS product-specific icons with light and dark variants for every icon.

```ts
import {
  cloudDataBackupLight,
  cloudDataBackupDark,
  domainTldDeLight,
} from '@ionos-web-design-system/icon/ionos';
```

Naming pattern: `{name}Light` / `{name}Dark`. Always use the variant matching
the active color scheme.

Purpose: Product illustrations, feature icons, and service-specific imagery.

---

## brandmark (57 icons)

Brand logos with light and dark variants.

```ts
import {
  ionosLight,
  ionosDark,
  stratoLight,
  stratoDark,
  fasthostsLight,
  world4youLight,
  arsysLight,
} from '@ionos-web-design-system/icon/brandmark';
```

Naming pattern: `{brand}Light` / `{brand}Dark`. Includes logos for IONOS,
Strato, Fasthosts, Home.pl, World4You, Arsys, and other group brands.

> **WARNING: Do NOT use the `Icon` component for brand logos.** The `Icon`
> component applies fixed icon sizing that distorts logo proportions. Instead,
> wrap a native `<img>` inside a `<div>` container sized to match the Figma
> design's exact dimensions. Choose the Light/Dark variant matching the active
> color scheme.

```tsx
// CORRECT — div controls size, img fills container
import ionosLightSrc from '@ionos-web-design-system/icon/brandmark/ionosLight?url';

<div className="w-[120px] h-[32px]">
  <img src={ionosLightSrc} className="h-full w-full" alt="IONOS" />
</div>

// WRONG — Icon component distorts logo proportions
import { ionosLight } from '@ionos-web-design-system/icon/brandmark';
import Icon from '@ionos-web-design-system/react/icon';

<Icon icon={ionosLight} size="xLarge" />  // ← distorted, don't do this
```

See SKILL.md section 10 (Category 4) for the full brand logo workflow.

---

## flags (270 icons)

Country and region flags using ISO country codes.

```ts
import { de, us, fr, gb, it, es } from '@ionos-web-design-system/icon/flags';
```

Uses lowercase ISO 3166-1 alpha-2 codes: `de`, `us`, `fr`, `gb`, `it`, `es`,
`pl`, `nl`, `at`, `ch`, etc.

Regional groups also available: `arab`, `asean`, `eu`.

---

## fasthosts (484 icons)

Fasthosts brand-specific icons with light and dark variants.

```ts
import {
  airplayLight,
  airplayDark,
  anchorLight,
  appsLight,
} from '@ionos-web-design-system/icon/fasthosts';
```

Naming pattern: `{name}Light` / `{name}Dark`. Always use the variant matching
the active color scheme.

Purpose: UI and product icons tailored to the Fasthosts brand.

---

## homepl (520 icons)

Home.pl brand-specific icons with light and dark variants.

```ts
import {
  accountSecurityLight,
  accountSecurityDark,
  addressBookLight,
} from '@ionos-web-design-system/icon/homepl';
```

Naming pattern: `{name}Light` / `{name}Dark`. Always use the variant matching
the active color scheme.

Purpose: UI and product icons tailored to the Home.pl brand.

---

## strato (110 icons)

Strato brand product icons. All icons use the `ProductIcons` suffix.

```ts
import {
  iconAdvantagesAwardProductIcons,
  iconAdvantagesComfortableProductIcons,
  iconBackupControlProductIcons,
} from '@ionos-web-design-system/icon/strato';
```

Naming pattern: `{name}ProductIcons`.

Purpose: Product and service icons for the Strato brand.

---

## checkmark (6 icons)

Brand-specific checkmark icons in light/dark pairs.

```ts
import {
  ionosLight,
  ionosDark,
  fasthostsLight,
  fasthostsDark,
  homeplLight,
  homeplDark,
} from '@ionos-web-design-system/icon/checkmark';
```

All 6 icons: `ionosLight`, `ionosDark`, `fasthostsLight`, `fasthostsDark`,
`homeplLight`, `homeplDark`.

Use these when a branded checkmark is needed instead of the generic system
checkmark.

---

## Quick Reference

| Group     | Import Path                               | Count | Variants       |
| --------- | ----------------------------------------- | ----- | -------------- |
| system    | `@ionos-web-design-system/icon/system`    | 674   | Weight (`300`) |
| social    | `@ionos-web-design-system/icon/social`    | 15    | None           |
| ionos     | `@ionos-web-design-system/icon/ionos`     | 851   | Light/Dark     |
| brandmark | `@ionos-web-design-system/icon/brandmark` | 57    | Light/Dark     |
| flags     | `@ionos-web-design-system/icon/flags`     | 270   | None           |
| fasthosts | `@ionos-web-design-system/icon/fasthosts` | 484   | Light/Dark     |
| homepl    | `@ionos-web-design-system/icon/homepl`    | 520   | Light/Dark     |
| strato    | `@ionos-web-design-system/icon/strato`    | 110   | ProductIcons   |
| checkmark | `@ionos-web-design-system/icon/checkmark` | 6     | Light/Dark     |
