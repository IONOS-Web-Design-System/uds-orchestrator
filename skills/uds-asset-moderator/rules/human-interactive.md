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

This is the pure `payload` — the moderator's `/create` envelope carries `requestId` and
`callbackUrl` at its own top level (`{ requestId, payload, callbackUrl }`); do NOT put either
inside this shape.

```json
{
  "brief": "<enriched, self-contained creative brief>",
  "brand": "ionos | strato | fasthosts | homepl | strefa | udag | world4you | arsys",
  "colorScheme": "light | dark",
  "mode": "auto | image | illustration | hybrid",
  "showroom": "<use-case id, e.g. dev-local>",
  "dimensions": { "w": <int>, "h": <int> },
  "durationSec": <1–30>,
  "loop": <true | false>,
  "variants": <1–4>,
  "market": "de | en | es | fr | pl | it | nl | gb",
  "references": [{ "url": "<figma.com node URL>" }]
}
```

**`references` (OPTIONAL):** an ordered array of reference objects, each with exactly one of
`url` (a real `figma.com` node URL, prefer `…?node-id=NN-NN`) or `assetSlug` (a pre-published
catalog asset), an optional `role` (`screen-content | reconstruct | style | keyframe`, omit to
auto-classify), and an optional `note` (free-text intent, e.g. "the dashboard on the laptop
screen"). Order matters. Cap 12. Keep links out of the `brief` text.

**Dimension ranges by mode:** image 256–2048 × 256–2048; illustration 320–1920 × 180–1080;
hybrid is the intersection 320–1920 × 256–1080.

**`module` (OPTIONAL, ≤64 chars):** set it only when the user names a specific downstream
component the asset embeds into — `columns`, `customer_testimonial`, `textmedia`, or
`testimonial_slider`. It biases the generators' framing/scale for that component and routes the
result. **Never ask for it**; infer only when clearly stated, and leave it unset otherwise. Set
just the field — image-svc adds its own `Consumer module:` directive from it; do not write that
line into the `brief`.

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

**Aspect-ratio safety (images):** image-svc renders natively at the target aspect ratio — no
centering step. For non-square images, position the focal subject within the frame bounds to
avoid unexpected cropping at the edges; anchor key details to the center-to-midpoint region.

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
   - dimensions (default 1280×720; suggest by mode) and orientation — note the aspect-ratio
     safety rule for non-square images, and that small canvases yield a card/cropped-frame look
   - **for any illustration or hybrid — ASK explicitly, do not assume: still or animated?**
     Default **still** (a single frame). Only if the user wants animation:
       - **what kind of motion** — capture it concretely (e.g. gentle seamless loop,
         entrance reveal, typewriter text, highlight zoom, cursor interaction) and write
         it into the `brief` so the motion is explicit, not implied.
       - `durationSec` (default 3) and whether it should **loop seamlessly** (`loop`,
         default `false` = play once).
     A still needs NO motion language in the brief — leave motion words out entirely so
     the moderator classifies it as a still.

   **Composition pattern — infer first, confirm only when ambiguous:**

   Use the table below to map what you already know (dimensions, brief intent, mode) onto
   a pattern name. Write the chosen name into the `brief` as `Composition pattern: <name> — `.
   Only ask the user if two patterns are plausible and the choice changes the visual
   meaningfully (e.g. "connector line to a specific feature" vs "floating highlight no line").

   | Conditions | Default pattern |
   |---|---|
   | `mode=illustration`, brief describes an inline editing action ("select this text", "resize this image") | `product-frame-zoom-cutout` |
   | `mode=illustration`, brief says "point to / highlight a specific feature inside the app" | `product-frame-connector-line` |
   | `mode=illustration`, landscape canvas too short for a full UI (w > 2×h) | `product-frame-bottom-bleed` |
   | `mode=illustration`, square canvas (w ≈ h, large) | `product-frame-square` |
   | `mode=illustration`, square canvas (w ≈ h, small < 512) | `small-cropped-frame` (or `small-icon-story` for abstract concept) |
   | `mode=illustration`, no special condition above | `product-frame-full` |
   | `mode=hybrid`, `embedStyle` set by moderator | map embedStyle → pattern name (see `shared-brief-enrichment.md`) |

   **If you ask:** frame it as one short question with smart defaults, e.g.:
   > "Should I point the AI highlight at a specific element inside the app with a
   > connector line (like a design tool pointer), or just float it outside freely?
   > Default: floating freely."
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
| **avatar** (headshot / profile picture) | `avatar` | **Face always fully in frame at any angle** | "face clearly visible from hairline to chin" — square (1:1); optionally show occupation context in the background or via a prop |
| **portrait** (person facing camera, character-focused) | `portrait` | **Face always fully in frame** | "full face clearly visible from hairline to chin, <shot distance>"; lead with the face anchor first; vary posture and include work-relevant accessories |
| **scene** (a person mid-action in a setting) | `scene` | NOT guaranteed — only if brief explicitly requests it | name the action and environment; the person fits into the scene; omit face anchor unless the user asks for face visibility |
| **landscape** (environment / product / wide setting) | `scenario` | NOT guaranteed — people secondary or cropped | describe the space/product; any people are incidental |

Decision rule — state it to the user when relevant:
- **If the human is the point** (their face should be recognizable, e.g. "a marketing expert",
  "our consultant", "a happy customer looking at the camera") → choose **portrait** (or
  **avatar** for a headshot). These are the ONLY modes where `uds-image` enforces
  "full face visible from hairline to chin" as a hard rule.
- **Choose `scene` when the activity and setting are the story** and a clear face is not
  required — e.g. a baker arranging pastries, a developer coding, a figure mid-stride. The
  model may crop the face in this mode; that is intentional. Add the face anchor explicitly
  only if the user asks for face visibility in a scene.
- **Choose `scenario` when the product/device is the hero** — face is secondary or absent.

Cautionary example: a "confident female marketing expert presenting to a client" written as a
generic scene came back with **both heads cropped off** — expected for a `scene` type, because
face is not anchored. The fix is to choose **portrait** and write the face-visibility shot, so
`uds-image`'s hard rule applies.

Always put the camera shot in the brief text in plain words (shot distance + "full face
visible" for avatar/portrait). `uds-image` detects the type from these words and maps the
aspect ratio; you do not set the type field — the wording is what triggers the right rule.

## Submit

After the user is happy, OFFER to submit (do not auto-fire). The `/imagine` command owns the
full submission + monitoring logic — see step 5 of `commands/imagine.md` for the canonical
implementation. In brief:

Everything goes **directly to the uds-moderator** — it is the sole API gateway (n8n is retired).
The default target is the **public cloud** moderator over **HTTPS**
(`https://uds-moderator.213-165-77-120.sslip.io`), reachable from any network, so `/imagine` works
from a local session AND from Claude Code on the web / a cowork sandbox — given the bearer key.
Resolve `MODERATOR_BASE` + `MODERATOR_TOKEN` per imagine.md's **Connecting to the moderator**
(env-first: `$MODERATOR_TOKEN` from `~/.claude/settings.json`, else dev secrets, else prompt).

- **Submit:** wrap the pure-brief `payload` (no `requestId`/`callbackUrl` inside it) in the
  moderator envelope `{ "requestId": <id>, "payload": <the pure brief>, "callbackUrl": <cb> }` and
  `POST $MODERATOR_BASE/create` with `Authorization: Bearer $MODERATOR_TOKEN` (→ 202
  `{requestId,status:"accepted"}`; `400` = brief failed the wire-format gate; `401` = bad/missing key).
- **Poll:** `GET $MODERATOR_BASE/jobs/<id>` — **send the bearer** — every 15 s until `status` is
  `done`/`partial`/`error`. Download each `outputs` entry (durable **public IONOS S3 URLs**, no
  auth) to `/tmp` and render: images inline, video/animation as a labelled link to the saved file.
- **Local dev** (`$HOME/pipeline-local/secrets/agent-svc.env` + a local stack): `dev/gen.sh <brief.json>`
  is the shortcut (builds the envelope + supplies the token, targets the local moderator).
- **Sandbox moderator** (opt-in only): set `MODERATOR_BASE=http://uds-moderator.sandbox.lan:8080`
  (corp-VPN only) — not the default.
- **Offline / unreachable** (the smoke-test can't reach `MODERATOR_BASE` — e.g. the sandbox base
  with the VPN off): do NOT show curl or ask the user to poll. Print the finished UnifiedBrief as a
  copy-paste `json` block and tell them to run `/imagine` from a session that can reach the
  moderator and paste the brief — a pasted brief skips the questions and goes straight to submit.
- **Hand back** (user declines): print the UnifiedBrief JSON; offer the `curl` one-liner (with the
  `Authorization: Bearer` header) only if asked.

## After results: proactively offer next steps

Once results render, proactively offer how to move forward. **The options differ by asset type,
and so does the cost — be explicit about which actions are a cheap re-render vs a full new
generation.** The `/imagine` command owns the mechanics (its step 6).

**Illustration / animation** (a re-render reuses the composition — cheap, no new AI gen,
identical motion/layout):
1. **Other languages** — same animation, translated copy, in more markets (re-render).
2. **Different format** — re-encode a variant as `mp4`/`webm`/`gif`/`png` poster (re-render).
3. **Add context & regenerate** — fold new direction into the brief → fresh generation.

Re-render (1 & 2) goes **directly to the moderator**: `POST $MODERATOR_BASE/rerender` with the
flat ReRenderBrief `{requestId, variant, markets, format}` and `Authorization: Bearer $MODERATOR_TOKEN`
(→ 202 `{renderId}`) → poll `GET $MODERATOR_BASE/jobs/<renderId>` (send the bearer) → download each
market's public S3 URL. Use the ORIGINAL `requestId` + the `variant` key from `outputs.videos`.

**Image** — there is **no image re-render**. Photoreal images carry no rendered text, and
`image-download` only serves the already-generated file. So:
1. **Other markets** — a different `market` is a **brand-new generation**, not a translation:
   `market` (+ the showroom prefix) drives the persona's ethnicity/locale (see the `uds-image`
   ethnicity rules), so the person/scene WILL differ. **Notify the user it's a fresh image
   before regenerating.**
2. **Different format** — image-svc returns PNG; other containers aren't a server feature
   (only a new generation changes output). Don't fake a re-render.
3. **Add context & regenerate** — augment the brief → fresh generation.

Any "regenerate" (image markets, or add-context for either type) re-runs the normal submit
path with a NEW `requestId` and an adjusted brief — warn that it's a full generation (minutes,
and a genuinely new result).

Never invent palette hex or brand facts — read them from the uds-style-guide skill.
