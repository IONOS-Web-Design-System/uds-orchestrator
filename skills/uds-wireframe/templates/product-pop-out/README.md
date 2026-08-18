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
| padding | `0 1.77% 0 5.76%` | `4.94%` (one value, all sides) |
| gap | `4.4%` | `3.71%` |
| type | Open Sans, `H*0.236` / `H*0.306` | Overpass, `W*0.0448` / `W*0.0556`, 3-line clamp |
| controls | send `80.6%` of H, glyph `44%` | two rings `W*0.0833` gap `1.54%`, send `W*0.084` |
| radius | `9999` (pill) | `3.09%` |

Percentage padding resolves against **width** on every side — that is why one value keeps
the inset uniform at any aspect, and why deriving separate horizontal and vertical insets
makes the card look skewed.

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
