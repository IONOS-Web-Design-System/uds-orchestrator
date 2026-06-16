# Human-interactive formulation (the `/imagine` flow)

This rule is for a HUMAN forming an asset brief interactively — it is intentionally NOT a
`shared-*` rule, so the moderator does not inline it into the machine plan prompt. The same
classification, enrichment, param-mapping, and consistency rules apply; only the delivery
differs (a guided conversation that ends in a ready brief).

## Goal

Take a person's rough idea and a few answers, and produce a valid **UnifiedBrief** (the
moderator `/create` payload) whose `brief` text is already enriched per
`shared-brief-enrichment.md`. Do the prompt engineering FOR the user — they describe intent,
you write the brief.

## UnifiedBrief shape (target output)

```json
{
  "requestId": "<kebab, ≤56 chars, unique>",
  "brief": "<enriched, self-contained creative brief>",
  "brand": "ionos | strato | fasthosts | homepl | strefa | udag | world4you | arsys",
  "colorScheme": "light | dark",
  "mode": "auto | image | illustration | hybrid",
  "showroom": "<use-case id, e.g. dev-local>",
  "dimensions": { "w": <int>, "h": <int> },
  "durationSec": <1–10>,
  "loop": <true | false>,
  "variants": <1–4>,
  "market": "de | en | es | fr | pl | it | nl | gb",
  "callbackUrl": "<url>"
}
```

**Dimension ranges by mode:** image 256–2048 × 256–2048; illustration 320–1920 × 180–1080;
hybrid is the intersection 320–1920 × 256–1080. There is no `module` field — it is downstream-only.

**`loop` (boolean, default `false`):** only meaningful for an **animated** illustration/hybrid.
`true` constrains the animation to a seamless loop (final frame == first frame) for continuous
`<video loop>` playback; `false` plays once. Leave `false` unless the user wants looping motion.

**Canvas size shapes the hybrid look — set dimensions to match the intent (the moderator picks
the embed style, you don't set it):**
- **Large canvas (w ≥ 800 AND h ≥ 450):** the design-tool "pointer" look (headline selection
  marquee + connector + feature panel over a backdrop card) is available. Use a large landscape
  canvas when the user wants that "AI acting on the user's content" treatment.
- **Small canvas (under ~512px on both axes):** the moderator builds a compact composition — a
  contained **image-card with edge chips**, or a **cropped product frame** (the UI bleeds off
  the canvas, large icons), never a whole UI shrunk to fit. The pointer look is unavailable here
  (it auto-demotes). So for square/banner/badge sizes, expect a card or cropped-frame result.

**Crop-safety (images):** image-svc renders a square then center-crops to the requested ratio —
**landscape** (w > h) trims top & bottom, **portrait** (h > w) trims left & right. Keep the focal
subject centered with margin on the trimmed axis; say so in the brief for non-square images.

## Conversation flow

1. **Start from `$ARGUMENTS`.** Infer everything you can (likely mode via the classification
   rubric, asset type, mood). Restate your read of the idea in one sentence.
2. **Ask only for what's genuinely missing or ambiguous — one short batch, not 1-at-a-time
   interrogation.** Offer smart defaults the user can accept with one word:
   - brand (default `ionos`), colorScheme (default `light`)
   - mode if the brief is ambiguous between image/illustration/hybrid (else infer, say so)
   - for any **image** (or the image half of a hybrid): the **image mode** and **camera
     shot** — see "Image assets: mode & camera shot" below. This is REQUIRED, not optional:
     a missing shot is why faces get cropped.
   - **if the image features a screen-based product (laptop / tablet / phone) as a focus:
     ACTIVELY ASK two things — (a) the natural use moment, and (b) what the screen should show.**
     Lead with the moment: who is using it and doing what, as people really do — an owner tapping
     a phone to pay at the counter, someone typing at a laptop, two colleagues over a dashboard.
     Then the interface content (default: the product the `showroom` refers to — shop admin,
     campaign dashboard, builder canvas — else the scenario). Write the brief so the screen is
     read **through a natural camera angle** (over-the-shoulder / from above), the full screen
     clearly visible — NEVER the subject holding the device up to the lens, and never a lone idle
     device. For a pixel-accurate UI, suggest `hybrid` mode instead.
   - fidelity/tone for illustrations (standard vs decorative/cinematic)
   - dimensions (default 1280×720; suggest by mode) and orientation — note the crop-safety
     rule for non-square images, and that small canvases yield a card/cropped-frame look
   - for illustration/hybrid: still vs animated; if animated → `durationSec` (default 3) AND
     whether it should **loop seamlessly** (`loop`, default `false` = play once)
   - variants (default 1)
   - `showroom` — where the asset will live (e.g. `app-builder`, `marketing-hero`,
     `de-campaign`, `dev-local`); it biases mode + tone. Default `dev-local` if they don't care.
   - market (default `de`)
3. **Enrich.** Apply `shared-brief-enrichment.md` + `shared-param-mapping.md` to write the
   final `brief` text. For hybrid, keep it one coherent idea; the moderator will decompose.
4. **Show the assembled UnifiedBrief JSON** and a one-line plain-English summary of what will
   be generated (mode + subject + format). Let the user tweak before submitting.

## Image assets: mode & camera shot

For every image (and the image half of a hybrid) you MUST settle two things and write them
explicitly into the brief — leaving them implicit lets the image model crop heads off. Ask
the user which of these they want; map their answer to the downstream `uds-image` type and
state the camera shot in words.

| You ask the user | uds-image type | Face guarantee | Shot to write into the brief |
|---|---|---|---|
| **avatar** (headshot / profile picture) | `avatar` | **Head & face always fully in frame** | "tightly-framed avatar, head and shoulders, full face from hairline to chin clearly visible, eyes to camera" — square (1:1) |
| **portrait** (a specific person, recognizable) | `portrait` | **Head & face always fully in frame** | "portrait of <person>, waist-up, full face from hairline to chin clearly visible, facing camera, in <their setting>" |
| **scene** (a person mid-action in a setting) | `person-scenario` | NOT guaranteed — face may be partial/cropped | name the action and environment; the person is context, not the anchor |
| **landscape** (environment / product / wide setting) | `scenario` | NOT guaranteed — people secondary or cropped | describe the space/product; any people are incidental |

Decision rule — state it to the user when relevant:
- **If the human is the point** (their face should be recognizable, e.g. "a marketing expert",
  "our consultant", "a happy customer looking at the camera") → choose **portrait** (or
  **avatar** for a headshot). These are the ONLY modes where `uds-image` enforces
  "full face visible from hairline to chin" as a hard rule.
- **Choose scene/landscape only when a clear, uncropped face is genuinely not required** —
  e.g. hands on a keyboard, a figure walking away, a room. In these modes the model is
  allowed to crop the head, so never use them when the person must be seen.

Cautionary example: a "confident female marketing expert presenting to a client" written as a
generic scene came back with **both heads cropped off** — correct because the system read it
as `scenario` (face croppable). The fix is to choose **portrait** and write the face-visibility
shot, so `uds-image`'s hard rule applies.

Always put the camera shot in the brief text in plain words (shot distance + "full face
visible" for avatar/portrait). `uds-image` detects the type from these words and maps the
aspect ratio; you do not set the type field — the wording is what triggers the right rule.

## Submit

After the user is happy, OFFER to submit (do not auto-fire):
- On yes: `POST` the envelope `{requestId, payload, callbackUrl}` to the local moderator
  `/create` with `Authorization: Bearer <MODERATOR_AUTH_TOKEN>`. Locally the token and a
  working `callbackUrl` mirror `uds-moderator/dev/gen.sh` (token from the dev env; callback
  defaults to the moderator's own shim). Prefer reusing `dev/gen.sh <brief.json>` if the
  moderator dev stack is the target — it builds the envelope and prints inspect commands.
- On no: hand back the JSON (and the `dev/gen.sh` one-liner) so the user fires it themselves.

Never invent palette hex or brand facts — read them from the uds-style-guide skill.
