# Component & Hook Quick Reference

Find the component name, then use the corresponding import and rule file.

## React Components

| Component Name    | Import                                                                                                     | Rule File                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| accordion         | `import Accordion, { AccordionItem } from '.../react/accordion'`                                           | `rules/react-accordion.md`         |
| aspect-ratio      | `import AspectRatio from '.../react/aspect-ratio'`                                                         | `rules/react-aspect-ratio.md`      |
| avatar            | `import Avatar from '.../react/avatar'`                                                                    | `rules/react-avatar.md`            |
| badge             | `import Badge from '.../react/badge'`                                                                      | `rules/react-badge.md`             |
| banner            | `import Banner from '.../react/banner'`                                                                    | `rules/react-banner.md`            |
| box               | `import Box from '.../react/box'`                                                                          | `rules/react-box.md`               |
| breadcrumbs       | `import { Breadcrumbs, BreadcrumbsItem } from '.../react'`                                                 | `rules/react-breadcrumbs.md`       |
| bullet            | `import Bullet from '.../react/bullet'`                                                                    | `rules/react-bullet.md`            |
| button            | `import Button from '.../react/button'`                                                                    | `rules/react-button.md`            |
| button-ghost      | `import ButtonGhost from '.../react/button-ghost'`                                                         | `rules/react-button-ghost.md`      |
| button-icon       | `import ButtonIcon from '.../react/button-icon'`                                                           | `rules/react-button-icon.md`       |
| button-link       | `import ButtonLink from '.../react/button-link'`                                                           | `rules/react-button-link.md`       |
| button-toggle     | `import ButtonToggle from '.../react/button-toggle'`                                                       | `rules/react-button-toggle.md`     |
| card              | `import Card from '.../react/card'` _(deprecated — use card-media, card-tariff, or tile-domain)_           | `rules/react-card.md`              |
| card-media        | `import CardMedia from '.../react/card-media'`                                                             | `rules/react-card-media.md`        |
| card-tariff       | `import CardTariff from '.../react/card-tariff'`                                                           | `rules/react-card-tariff.md`       |
| cell-select       | `import CellSelect, { CellSelectGroup } from '.../react/cell-select'`                                      | `rules/react-cell-select.md`       |
| checkbox          | `import Checkbox from '.../react/checkbox'`                                                                | `rules/react-checkbox.md`          |
| combobox          | `import Combobox from '.../react/combobox'`                                                                | `rules/react-combobox.md`          |
| comparison-table  | `import ComparisonTable from '.../react/comparison-table'`                                                 | `rules/react-comparison-table.md`  |
| content-tabs      | `import ContentTabs from '.../react/content-tabs'`                                                         | `rules/react-content-tabs.md`      |
| disclosure        | `import Disclosure from '.../react/disclosure'`                                                            | `rules/react-disclosure.md`        |
| divider           | `import Divider from '.../react/divider'`                                                                  | `rules/react-divider.md`           |
| domain-badge      | `import DomainBadge from '.../react/domain-badge'`                                                         | `rules/react-domain-badge.md`      |
| domain-offer      | `import DomainOffer from '.../react/domain-offer'`                                                         | `rules/react-domain-offer.md`      |
| domain-search-bar | `import DomainSearchBar from '.../react/domain-search-bar'`                                                | `rules/react-domain-search-bar.md` |
| dropdown          | `import Dropdown from '.../react/dropdown'` _(deprecated — use selectbox)_                                 | `rules/react-dropdown.md`          |
| dropdown-item     | `import DropdownItem from '.../react/dropdown-item'`                                                       | `rules/react-dropdown-item.md`     |
| selectbox         | `import Selectbox, { SelectboxItem } from '.../react/selectbox'`                                           | `rules/react-selectbox.md`         |
| form              | `import Form, { FormField } from '.../react/form'`                                                         | `rules/react-form.md`              |
| hero-tile         | `import HeroTile from '.../react/hero-tile'`                                                               | `rules/react-hero-tile.md`         |
| icon              | `import Icon from '.../react/icon'`                                                                        | `rules/react-icon.md`              |
| input-field       | `import InputField from '.../react/input-field'`                                                           | `rules/react-input-field.md`       |
| input-search      | `import InputSearch from '.../react/input-search'`                                                         | `rules/react-input-search.md`      |
| input-text-area   | `import InputTextArea from '.../react/input-text-area'`                                                    | `rules/react-input-text-area.md`   |
| label             | `import Label from '.../react/label'`                                                                      | `rules/react-label.md`             |
| picture           | `import Picture from '.../react/picture'`                                                                  | `rules/react-picture.md`           |
| pill              | `import Pill from '.../react/pill'`                                                                        | `rules/react-pill.md`              |
| price             | `import Price from '.../react/price'`                                                                      | `rules/react-price.md`             |
| progress          | `import Progress from '.../react/progress'`                                                                | `rules/react-progress.md`          |
| radio-group       | `import RadioGroup from '.../react/radio-group'`                                                           | `rules/react-radio-group.md`       |
| select-group      | `import SelectGroup from '.../react/select-group'`                                                         | `rules/react-select-group.md`      |
| sidebar           | `import Sidebar, { SidebarProvider, SidebarItem, SidebarGroup, SidebarSkeleton } from '.../react/sidebar'` | `rules/react-sidebar.md`           |
| skeleton          | `import Skeleton from '.../react/skeleton'`                                                                | `rules/react-skeleton.md`          |
| slider-indicator  | `import SliderIndicator from '.../react/slider-indicator'`                                                 | `rules/react-slider-indicator.md`  |
| surface           | `import Surface from '.../react/surface'`                                                                  | `rules/react-surface.md`           |
| switch            | `import Switch, { SwitchThumb, SwitchLabel } from '.../react/switch'`                                      | `rules/react-switch.md`            |
| table             | `import Table from '.../react/table'`                                                                      | `rules/react-table.md`             |
| tabs              | `import Tabs from '.../react/tabs'`                                                                        | `rules/react-tabs.md`              |
| text              | `import Text from '.../react/text'`                                                                        | `rules/react-text.md`              |
| theme-inverter    | `import ThemeInverter from '.../react/theme-inverter'`                                                     | `rules/react-theme-inverter.md`    |
| theme-provider    | `import ThemeProvider from '.../react/theme-provider'`                                                     | `rules/react-theme-provider.md`    |
| tile-domain       | `import TileDomain from '.../react/tile-domain'`                                                           | `rules/react-tile-domain.md`       |
| tooltip           | `import Tooltip from '.../react/tooltip'`                                                                  | `rules/react-tooltip.md`           |
| visually-hidden   | `import VisuallyHidden from '.../react/visually-hidden'`                                                   | `rules/react-visually-hidden.md`   |

> **Note:** `...` = `@ionos-web-design-system` in all imports above.

## Hooks

| Hook Name      | Import                                                            | Rule File                         |
| -------------- | ----------------------------------------------------------------- | --------------------------------- |
| useDynamicIcon | `import { useDynamicIcon } from '@ionos-web-design-system/react'` | `rules/react-use-dynamic-icon.md` |

> **Types also exported:** `IconBarrelLoader`, `UseDynamicIconResult`,
> `UseDynamicIconOptions`, `IconGroup`
