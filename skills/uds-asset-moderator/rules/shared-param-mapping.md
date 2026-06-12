# Param → prompt mapping (all brands)

The brief carries structured params alongside the free text. Let them bias the plan; the
free text always wins on subject, params win on format and context.

- **`showroom`** — an open-ended use-case identifier (e.g. `de-app-builder`,
  `dev-local`). Treat it as context about where the asset will live, NOT a fixed lookup.
  Read its intent from its words: `*-app-builder` / `*-panel` / `*-console` lean toward a
  product UI → `illustration`; `marketing-*` / `*-hero` / `*-campaign` lean toward a
  pictured scene → `image` or `hybrid`; a market prefix (`de-`, `gb-`) reinforces locale.
  When the identifier is uninformative (`dev-local`), ignore it and decide from the brief.
- **`brand`** — selects palette, typography, and identity via the inlined uds-style-guide.
  Every `paletteRefs` hex MUST come from that brand's palette.
- **`colorScheme`** (`light`|`dark`) — a tonal intent the brief should reflect: `dark` →
  darker grounds, luminous accents; state it in `compositionPlan`/`tone` so measured hybrid
  tones land in the right family.
- **`market`** (`de|en|es|fr|pl|it|nl|gb`) — locale for copy language and, for people in
  imagery, regionally plausible persona cues (defer specifics to the uds-image skill).
- **`dimensions`** — drive framing and, for hybrid, `embedStyle` eligibility
  (`background-pointer` needs w ≥ 800 AND h ≥ 450). Portrait vs landscape changes
  composition; say so. **Crop-safety:** image-svc generates a square frame and then
  center-crops it to the requested ratio, so a non-square target trims one axis —
  **landscape** (w > h) trims TOP and BOTTOM, **portrait** (h > w) trims LEFT and RIGHT.
  The image `feature` and `sharedContext.compositionPlan` MUST keep the full focal subject
  inside the surviving central band (the horizontal band for landscape, the vertical band
  for portrait) with generous margins on the trimmed edges, so the crop never clips it.
  Square targets just keep the subject centered.
- **`durationSec`** / **`variants`** — `durationSec` only matters for
  `illustrationBrief.intent:animation`; a still wants no motion language. `variants` is the
  fan-out count — keep the brief general enough to yield distinct variants.

Note: **`module`** is NOT a moderator brief field — it is a downstream agent-svc passthrough
(consumer routing). Do not expect or emit it here.
