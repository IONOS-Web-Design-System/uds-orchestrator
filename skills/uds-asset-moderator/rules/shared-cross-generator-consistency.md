# Cross-generator consistency (all brands)

In `hybrid`, image-svc and agent-svc run from two separate briefs but must look like one
asset. `sharedContext` is the contract that makes that happen — both generators receive it
verbatim, so write it so it reads identically to each:

- **`subject`** — the SAME focal subject named in both sub-briefs. If the imageBrief shows
  "a florist at a counter", the illustrationBrief's UI must concern that same scene, not a
  different one.
- **`paletteRefs`** — brand-palette hex anchors only. Both generators key off these; the
  illustration's chrome and the image's tones must share this family. (Measured image tones
  are appended later as a `Color harmony:` block — see SKILL.md; do not pre-guess them.)
- **`tone`** — 3–5 adjectives that read the same to a photo model and a UI composer
  ("calm, premium, trustworthy"), not generator-specific jargon.
- **`compositionPlan`** — one sentence locating the negative space / panel side / message
  region so the image leaves room exactly where the illustration will place UI (never a
  rendered marketing headline — see `shared-brief-parsing.md` no-marketing-heading).
- **Brand product icons** — when a graphic symbolizes a product/service concept, name the
  concept in the `illustrationBrief` only ("the brand product icon for automated cloud
  backups"), per `shared-product-icon-substitution.md`. NEVER name one in an `imageBrief`:
  image-svc runs a diffusion model with no access to the icon package, so the request is
  meaningless there and pollutes the scene description.

The orchestrator owns the compositing mechanics. It appends the `[HYBRID EMBED CONTRACT]`
(per `embedStyle`) to the illustrationBrief itself, so:
- the **imageBrief** describes only the full scene (clean, with the stated negative space —
  see `shared-hybrid-decomposition.md`), never UI, text, or a device screen to fill;
- the **illustrationBrief** describes only the feature UI, never re-describing the scene;
- both must be consistent with the `embedStyle` chosen (background-pointer / interface-asset
  / background-full) — pick the style first, then write briefs that fit its contract.

Single vs hybrid: in single-generator modes there is no second brief to align, but
`sharedContext` is still the through-line from plan to generator — keep `subject`/`tone`
faithful to the enriched `feature` so the delivered asset matches the plan's intent.
