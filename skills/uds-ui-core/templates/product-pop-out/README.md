# PromptWindow

The measured Figma prompt window — the template for a FLOATING AI prompt window: the
`corporate_stage` product-pop-out highlight (from the contract rect) or any floating AI window, always
absolute and a direct child of the root, never inside an interface (a prompt inside an interface is
a drawn field + an AI button). Brands: `ionos`, `strato`.

**STRATO is its own design** (`promptWindow.strato.tsx`, Figma 587:6893 / 587:6992): a
hard-light AI-gradient glow (40 % strength) behind 70 % white glass (both from `STRATO_AI_MATERIAL`, the Subtle level), a plus-lighter text glow, Poppins `#29294D`.
`prompt-full` = AI badge + uppercase `label` + prompt (≤ 3 lines); `prompt-simple` = pill with the
prompt (≤ 2 lines) and a round AI button. STRATO adds the optional motion props `glow`, `caret`,
`pulse` and `glowAngleDeg` (see `rules/strato/prompt-window.md`); `actions` and
`sendGlyph` do not apply. Its wrapper deliberately carries no z-index so the glow blends with the
canvas; only the glass card stacks at 100.
`agent-svc` copies this directory into every render workspace as `src/uds/`, where it is
**protected** from codegen overwrite (`agent-svc/src/storage.ts`, `PROTECTED_PREFIXES`).

Geometry is closed; content is open; placement is external. There is no `height`, no
`padding`, no `fontSize`, no `style` passthrough and no `children` — the props are
enumerated, so an attempt to reach inside is a compile error.

## Props

| Prop | Type | Notes |
|---|---|---|
| `variant` | `'prompt-simple' \| 'prompt-full'` | The moderator picks this from the copy's measured length |
| `brand` | `PromptWindowBrand` | Keys `promptWindow.brands.ts`: `ionos` (blue→magenta, white glyph), `strato` (blue→cyan, white glyph, Poppins) |
| `promptText` | `string` | From `texts.promptText`, so market re-renders can translate it |
| `actions` | `readonly [PromptAction, PromptAction]` | `prompt-full` only; defaults to `['edit','regenerate']` |
| `leadingIcon` | `AiIconName \| 'none'` | The gradient-filled AI marker |
| `sendGlyph` | `'arrow' \| 'paper-plane'` | Flat white on the gradient circle |
| `width` / `left` / `bottom` | `number` (px) | The window's rect (absolute, z-index 100) |

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

`filled-ai-phone` ships from UDS icon 0.43 (a handset with a sparkle) and is the AI marker for
call / receptionist / phone-assistant scenarios; use `filled-sparkles` for general AI.
`filled-envelope-ai` was redrawn in 0.43 (the sparkle sits smaller at the lower right); same name, same use.

# The STRATO stage pair (`StagePair`, `StageCard`, `StageBadge`, `StageTile`, `StageText`)

The leg of a STRATO corporate stage with an interface draws TWO layers in one run: an abstract app
frame of the product (the BACKGROUND, behind the character) and a glass highlight card (the
FOREGROUND, in front of it). The stage template (`../strato-stage/`) places them around the character;
the leg never positions itself on the stage. Spec 2026-11-23
(`uds-moderator/docs/superpowers/specs/2026-11-23-strato-stage-three-layers-design.md`, §2 and §2b).

## `stagePair.layout.ts` (pure, no Remotion)

| Export | What it is |
|---|---|
| `CHARACTER_FRAME_ASPECT` | 970.845 / 736.224: the 971 x 736 box of the Figma character component, which is exactly a catalog character PNG. The leg canvas has this aspect. Mirrored by `strato-stage/geometry.ts` and the moderator's `pairLegDims` (both tests compare) |
| `PAIR_SLOTS` | The two slots as fractions (x, y, w, h) of the character frame (the medians of the five Figma final comps, 730:9594): background `{ 0.14, 0.13, 0.50, 0.42 }`, foreground `{ 0.12, 0.24, 0.31, 0.40 }` |
| `pairSlotRects(canvas)` | The slots in px on a canvas of that size |
| `StageLayerContext` | `'background' \| 'foreground' \| 'both'`, default `'both'`: which layer a mount shows |
| `StageSlotContext` / `useStageSlot()` | The size (px) of the box the current layer is drawn into; default 253 x 173 outside a pair |
| `visibleLayers(layer)` | The layers a mount draws, background first |

## `StagePair` (`StagePair.tsx`)

`<StagePair background={…} foreground={…} layer?={…} />` is the leg composition's only child. It lays
the two children out in their slots on the leg canvas (`useVideoConfig()` is the canvas; each child gets
an absolutely positioned box and a `StageSlotContext` with its size) and draws only the layer it is
asked for: the `layer` prop if given, else `StageLayerContext`. The leg's own render has no provider and
shows both, so its preview and gates see the pair as it will stand. agent-svc's `/compose` mounts the
same leg twice, wrapping each mount in `<StageLayerContext.Provider value="background" | "foreground">`
(imported from `./uds/StagePair`, which re-exports the layout module's context, so it is the one
`StagePair` reads). `renderStagePair` is the hook-free body (the tests call it with an explicit size).

## `StageCard`, `StageBadge`, `StageTile`, `StageText` (`StageCard.tsx`)

The foreground's glass card and its parts. All read the ONE STRATO AI material at the Subtle level
(`STRATO_AI_MATERIAL` in `promptWindow.strato.tsx`), the same constant the STRATO prompt window reads,
so the card and the window cannot drift apart, and all size in px off the slot (`useStageSlot()`).

| | `ai` true | `ai` false |
|---|---|---|
| `<StageCard ai>` glow | the AI gradient at 45°, hard-light, blurred, at 0.40 | the primary blue dimmed towards the ink (`nonAi.glow`), hard-light, at 0.32 |
| glass | white 70 %, backdrop `blur(…) saturate(1.15)`, the window's light rim | the same |
| content | #29294D Poppins (`STAGE_INK`, `STRATO_PROMPT.face`) | the same |
| `<StageBadge>` | the AI gradient circle; glyph defaults to the white `filled-sparkles` | primary blue circle; `glyph` is REQUIRED (a type error without it), e.g. a UDS system icon; never the AI sparkle |
| badge shadow | `0 4px 10px rgba(41,41,77,0.12)` | the same |

- `StageCard` takes the slot width (radius, padding and blurs are ratios of the slot width), hugs its
  content's height (capped at the slot height) and sits vertically centred in its slot; its wrapper
  creates no stacking context, so the glow blends with what lies under the card, as the window's does.
- `StageText` is the stage headline and card text with the window's plus-lighter white halo: it IS the
  window's `GlowText` (exported from `promptWindow.strato.tsx`, not copied), at the prompt-full halo
  ratios (`STRATO_FULL.textGlowBlurOfW` of the slot width, `textGlowAlpha`). By default it is bold,
  uppercase and sized off the card width; `style` overrides any of that. Colour and face are fixed to
  #29294D Poppins. `caret` shows the typing caret.
- `<StageTile ai glyph size?>` is the comp's glass icon tile: a rounded square of `size` x the slot width (default 0.2), radius 0.26 of the tile, the AI gradient (ai) or primary fill, the badge shadow, and a white glyph at 0.55 of the tile. A `glyph` string starting with `data:image/` (a UDS icon's `svgData`) renders as a white masked icon on the tile and on `StageBadge`, never as text.
- `stageAccentFill(ai)` / `stageOutline(ai)`: the feature's accent fill (the AI gradient at 90°, or
  primary) and outline (`#0000FF`, or primary) for bars and outlines inside the card.
- `renderStageCard` / `renderStageBadge` / `renderStageText` are the hook-free bodies (tests).
