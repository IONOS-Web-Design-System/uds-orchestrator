# PromptWindow

The measured Figma prompt window for `corporate_stage` product-pop-out composites.
`agent-svc` copies this directory into every render workspace as `src/uds/`, where it is
**protected** from codegen overwrite (`agent-svc/src/storage.ts`, `PROTECTED_PREFIXES`).

Geometry is closed; content is open; placement is external. There is no `height`, no
`padding`, no `fontSize`, no `style` passthrough and no `children` — the props are
enumerated, so an attempt to reach inside is a compile error.

## Props

| Prop | Type | Notes |
|---|---|---|
| `variant` | `'prompt-simple' \| 'prompt-full'` | The moderator picks this from the copy's measured length |
| `brand` | `PromptWindowBrand` | Keys `promptWindow.brands.ts` |
| `promptText` | `string` | From `texts.promptText`, so market re-renders can translate it |
| `actions` | `readonly [PromptAction, PromptAction]` | `prompt-full` only; defaults to `['edit','regenerate']` |
| `leadingIcon` | `AiIconName \| 'none'` | The gradient-filled AI marker |
| `sendGlyph` | `'arrow' \| 'paper-plane'` | Flat white on the gradient circle |
| `width` / `left` / `bottom` | `number` (px) | From the contract rect |

## Where every number came from

Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`.

| | `prompt-simple` (node `398:4507`) | `prompt-full` (node `398:4489`) |
|---|---|---|
| measured | 451 x 72, aspect 6.2639 | 420.11 x 163.42, aspect 2.571 |
| height | derived: `width / 6.2639` | derived: content, bottom-anchored |
| padding | left `W*0.0576`, right `W*0.0177`, none vertical | `W*0.0494` (one value, all four sides) |
| gap | `W*0.044` | `W*0.0371` |
| type | Open Sans, `H*0.236` / `H*0.306` | Overpass, `W*0.0448` / `W*0.0556`, 3-line clamp |
| controls | send `80.6%` of H, glyph `44%` | two rings `W*0.0833` gap `W*0.0154`, send `W*0.084` |
| radius | `9999` (pill) | `W*0.0309` |

Every inset, gap and radius is a ratio of the window's own `width`, **applied in px** — never a
CSS percentage. This README previously claimed percentage padding resolves against the
element's width; it does not, and that claim was the feature's original production defect:

* percentage **`padding`** resolves against the **containing block's** width on all four sides.
  This window is `position:absolute` under the root `AbsoluteFill`, so that is the 1280px
  canvas: `4.94%` painted 63.2px per side instead of 23.9px (2.6x), which is exactly the
  "over-padded, content as a centred island" card that shipped.
* percentage **`gap`** resolves against the element's own *content* box, so it drifts with the
  padding — and in `prompt-full`, a column with `height:auto`, a percentage row-gap resolves
  against an indefinite block size and collapses to **0**.
* percentage **`borderRadius`** resolves horizontally against width but vertically against
  height, so one measured corner becomes an ellipse (14.96 x 5.78 at 484x187).

The inset is still uniform on `prompt-full` — one value, all four sides — because the design
measures it that way. Deriving separate horizontal and vertical insets makes the card look
skewed. The measured Figma ratios are unchanged; only the basis they multiply is px.

## Icons

`system` group only, imported as
`import { svgData as x } from '@ionos-web-design-system/icon/system/<name>'`. Never a
`dist/` segment, never `@ts-ignore`, never the React `<Icon>` component or the inject
functions (both need runtime CSS, unreliable in Remotion's headless renderer).

**AI icons are gradient-filled** (`background: AI_GRADIENT` + mask); every other glyph is
flat (`backgroundColor` + mask). The send button is the trap: the *circle* carries the
gradient, so its *glyph* is flat white. `star` / `filled-star` are never AI icons — and
because `leadingIcon` is typed `AiIconName`, passing one will not compile.

`filled-ai-phone` is documented but absent from the package; `filled-sparkles` is its
fallback.
