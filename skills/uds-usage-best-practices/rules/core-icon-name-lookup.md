# Icon Name Lookup

**CRITICAL: NEVER guess or assume icon names. Verify before importing.**

Icon names in the UDS icon package use specific naming conventions. Use the
inline lists below for common icons. For icons not listed here, look up
`icon-names.json` before writing any import.

## System Icons (common subset)

Import from `@ionos-web-design-system/icon/system`. Each also has an optional
`300` weight variant (append `300`, e.g. `arrowDown300`) and a `filled` variant
(prefix `filled`, e.g. `filledBell`).

```
accessibility    archive          arrowDown        arrowLeft
arrowRight       arrowTop         at               attachement
award            bankCard         bars             basket
bell             bellRing         bin              block
bolt             bookmark         boxOpen          brush
calendar         camera           cameraViewfinder cart
cartAdd          chat             checkmark        chevronDown
chevronLeft      chevronLeftDouble chevronRight    chevronRightDouble
chevronUp        chip             circleArrowDown  circleArrowLeft
circleArrowRight circleArrowUp    circleCheckmark  circleChevronDown
circleChevronLeft circleChevronRight circleChevronUp circleExclamation
circleHalf       circlePlay       circlePlus       circleX
clipboard        clock            cloud            cloudDone
cloudDownload    cloudOff         cloudUpload      colorPalette
colorize         compass          compassOff       contacts
copy             crop             crosshair        crown
database         deviceDisplay    deviceLaptop     deviceMobile
doNotDisturb     document         documentDelete   documentDownload
documentUpload   doubleArrowRightLeft doubleArrowUpDown download
dragPan          droplet          editSquare       ellipsis
ellipsisVertical emojiHappy1of5   emojiHappy4of5   emojiHappy5of5
envelope         envelopeOpen     fileZip          fire
fireworkRocket   flag             flower           flowerSimple
folder           folderDelete     folderManaged    folderMove
folderOpen       folderPlus       formatAlignCenter formatAlignLeft
formatAlignRight formatBold       formatItalic     formatShapes
formatUnderlined gear             gift             globe
grid2x           grid3x           grid3x2          gridList
hangtag          headset          heart            help
history          home             horizontalAlignCenter hourglass
image            info             invoice          itemsDeselect
key              layout           lifeRing         lightbulb
lightbulbOn      lightbulbShining link             linkOff
list             location         lock             lockOpen
login            logout           mailbox          marketing
matchCase        memory           mic              micOff
minus            moon             openInNew        package
paperPlane       pause            payments         pen
percent          performance      phone            play
plus             power            print            progressActivity
qrCode           redo             refresh          removeModerator
save             saveUnofficial   search           server
setIntersection  share            shield           shieldCheckmark
shieldCrossmark  shuffle          skipBack         skipForward
slider           sliderVertical   sortDown         sortLeft
sortRight        sortUp           speaker          squareCode
squarePlus       stacks           star             stop
sunShining       sync             syncProblem      textDecrease
textIncrease     thumbDown        thumbUp          touch
translate        trip             undo             update
upload           user             userAvatar       userGroup
verticalAlignCenter video         visibility       visibilityOff
volumeOff        volumeOn         warning          xmark
zoomIn           zoomOut
```

## Social Icons (all 15)

Import from `@ionos-web-design-system/icon/social`:

```
apple              atlassianConfluence  atlassianJira  facebook
github             google               googlePlus     instagram
linkedin           rss                  tiktok         wordpress
x                  xing                 youtube
```

## Checkmark Icons (all 6)

Import from `@ionos-web-design-system/icon/checkmark`:

```
ionosLight    ionosDark    fasthostsLight    fasthostsDark
homeplLight   homeplDark
```

## Flag Icons (270)

Import from `@ionos-web-design-system/icon/flags`. Uses lowercase ISO 3166-1
alpha-2 codes: `de`, `us`, `fr`, `gb`, `it`, `es`, `pl`, `nl`, `at`, `ch`, etc.
Regional groups: `arab`, `asean`, `eu`.

## Icon Runtime API

UDS icon exports come in two forms — understand which you need:

### Form 1 — CSS mask (from the barrel index, recommended for UI)

Named exports from `@ionos-web-design-system/icon/<group>` are `() => string` functions that **inject the icon CSS into `<head>` and return the CSS class name** (e.g. `"uds-system-bolt"`). Use this for components that render in a live DOM.

```ts
import { bolt, arrowRight } from '@ionos-web-design-system/icon/system';
import { ionosLight } from '@ionos-web-design-system/icon/brandmark';

// Call to inject CSS + get class name
const boltClass = bolt();          // → "uds-system-bolt"
const logoClass = ionosLight();    // → "uds-brandmark-ionos-light"

// Use as className on a styled div (needs CSS mask setup)
<div className={logoClass} style={{ width: 80, height: 24 }} />
```

### Form 2 — SVG data URI (from individual icon paths, for backgroundImage)

Each individual icon path exports a `svgData` named constant — a base64 data URI. Use this when you need `backgroundImage: url(...)` (e.g. Remotion wireframes with an IONOS logo).

```ts
import { svgData as ionosLightSvg } from '@ionos-web-design-system/icon/brandmark/ionos-light';
import { svgData as boltSvg } from '@ionos-web-design-system/icon/system/bolt';

// Use directly as a data URI
<div style={{ backgroundImage: `url(${ionosLightSvg})`, width: 80, height: 24,
              backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
```

**❌ WRONG** — properties that don't exist:
```ts
bolt.svgData   // TypeError — svgData is not a property on () => string
bolt.svg       // TypeError — svg does not exist
```

**Import path — CRITICAL for webpack/Remotion bundling:** Always import from the named sub-path alias using named exports from the index. Never import individual icon files from internal `dist/` paths — those are NOT in the package `exports` map and will fail with "not exported under conditions" in webpack.

```ts
// ❌ WRONG — individual file imports fail webpack/Remotion bundling
import bolt from '@ionos-web-design-system/icon/dist/system/bolt';
import arrowRight from '@ionos-web-design-system/icon/dist/system/arrow-right';
import { ionosLight } from '@ionos-web-design-system/icon/dist/brandmark/ionos-light';

// ✓ CORRECT — always import named exports from the entry-point alias
import { bolt, arrowRight } from '@ionos-web-design-system/icon/system';
import { ionosLight } from '@ionos-web-design-system/icon/brandmark';
```

The rule: `@ionos-web-design-system/icon/<group>` is the only valid import pattern — never `icon/dist/<group>/<name>`.

## Icons NOT in the Lists Above

For **ionos**, **brandmark**, **fasthosts**, **homepl**, and **strato** icons,
or any system icon not listed above, look up `icon-names.json`:

**File path:** `node_modules/@ionos-web-design-system/icon/dist/icon-names.json`

**Quick search command** (replace `search-term` with your query):

```bash
node -e "const d=require('./node_modules/@ionos-web-design-system/icon/dist/icon-names.json');const s=process.argv[1];Object.entries(d).forEach(([g,v])=>{const a=Array.isArray(v)?v:Object.values(v).flat();const m=a.filter(n=>n.includes(s));if(m.length)console.log(g+':',m.join(', '))})" "search-term"
```

If the file is not found, the icon package may not be installed.

## JSON Structure

The JSON groups have different shapes:

| Groups                                                   | Structure                           | Example                                                           |
| -------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `system`, `social`, `flags`                              | Flat array of kebab-case names      | `["arrow-down", "bell"]`                                          |
| `ionos`, `brandmark`, `fasthosts`, `homepl`, `checkmark` | `{ "light": [...], "dark": [...] }` | `{ "light": ["account-security"], "dark": ["account-security"] }` |
| `strato`                                                 | `{ "product-icons": [...] }`        | `{ "product-icons": ["icon-advantages-award"] }`                  |

## Naming Conversion (JSON → JS Import)

The JSON file uses **kebab-case**. JS exports use **camelCase** + a
group-specific suffix:

| Group type                                                                   | Conversion                 | Example                                                     |
| ---------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| Flat arrays (`system`, `social`, `flags`)                                    | camelCase only             | `arrow-down` → `arrowDown`                                  |
| Light/Dark groups (`ionos`, `brandmark`, `fasthosts`, `homepl`, `checkmark`) | camelCase + `Light`/`Dark` | `account-security` (light) → `accountSecurityLight`         |
| Strato                                                                       | camelCase + `ProductIcons` | `icon-advantages-award` → `iconAdvantagesAwardProductIcons` |
| System `300` weight                                                          | camelCase, numeric suffix  | `arrow-down-300` → `arrowDown300`                           |
