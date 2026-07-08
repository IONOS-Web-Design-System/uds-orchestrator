---
description: "Interactively formulate a UDS visual-asset brief and (optionally) submit it to the uds-moderator"
allowed-tools: ["Read", "Bash", "Write"]
---

# /imagine

Guided formulation of a visual-asset brief for the UDS two-generator pipeline (image-svc +
agent-svc, orchestrated by uds-moderator). You do the prompt engineering FOR the user: they
describe the asset they want, you produce a ready, enriched **UnifiedBrief** and offer to
submit it.

> **Where to run this:** submit, status polling, and re-render all go **directly to the
> moderator** at `uds-moderator.sandbox.lan:8080` — n8n is no longer in the runtime path.
> Asset downloads are durable **public IONOS S3 URLs**. Submit + re-render need the moderator
> **bearer token**; polling and `/jobs` are token-free. All hosts are reachable only over the
> IONOS corporate VPN. Run `/imagine` from a **local** Claude Code session (the CLI or the
> Claude Code desktop app) connected to the IONOS VPN. It does **not** work in Claude Code on
> the web / a **cowork cloud sandbox** — those run in a network-isolated VM that cannot reach
> the VPN. If the connectivity smoke-test (step 5B.1) fails, do not retry blindly: tell the
> user to re-run `/imagine` from a local VPN-connected session.

## Arguments

- `$ARGUMENTS` — a free-text description of the asset the user wants (e.g. "a dark, cinematic
  hero for the AI website builder showing a storefront and a floating assistant panel"). May
  be empty — if so, ask the user what they want to create.
- `$ARGUMENTS` may instead be a **complete UnifiedBrief JSON** handed off from another session
  (e.g. an `/imagine` run inside a cowork sandbox that couldn't submit). The user may paste the
  JSON directly or send it as `submit this imagine brief: { … }`. When the input already
  contains a full UnifiedBrief, **skip the interview** and go straight to submit — see the
  Pre-flight note below.

## UnifiedBrief wire format

**This is the exact `UnifiedBrief` shape the moderator accepts.** At submit it becomes the
`payload` inside the `/create` envelope `{ requestId, payload, callbackUrl }` (step 5B.2).
Memorize it — wrong field names cause a silent `400` with no useful error message.

```json
{
  "requestId": "kebab-case-slug-max-56-chars",
  "brand": "ionos",
  "mode": "illustration",
  "market": "de",
  "colorScheme": "light",
  "showroom": "dev-local",
  "brief": "…enriched brief text…",
  "dimensions": { "w": 1280, "h": 720 },
  "durationSec": 5,
  "loop": false,
  "variants": 1,
  "callbackUrl": "https://n8nwh.ionos.org/webhook/mock-callback"
}
```

**Critical field rules — verify every brief against these before sending:**

| Field | Correct | Common mistake |
|---|---|---|
| `dimensions` | `{ "w": 1280, "h": 720 }` | ❌ `{ "width": 1280, "height": 720 }` — **causes 400** |
| `embedStyle` | **not a top-level field** | ❌ do not include — it is an internal moderator plan value, not part of the UnifiedBrief; adding it does not change rendering and may cause rejection |
| `style` | **not a field** | ❌ do not include — there is no `style` key in the schema |
| `brand` | one of `ionos strato fasthosts homepl strefa udag world4you arsys` | ❌ anything else causes 400 |
| `mode` | one of `auto image illustration hybrid` | ❌ anything else causes 400 |
| `market` | one of `de en es fr pl it nl gb` | ❌ `uk` is rejected (ISO 639-1 reads it as Ukrainian) |
| `variants` | 1–4 | ❌ ≥ 5 causes 400 |
| `durationSec` | 1–30 | ❌ > 30 causes 400 |
| `dimensions.w` | 256–2048 | ❌ out of range causes 400 |
| `dimensions.h` | 180–2048 | ❌ out of range causes 400 |
| `requestId` | ≤ 56 chars | ❌ longer is rejected |
| `module` | *(optional)* ≤ 64 chars — a downstream **component** the asset embeds into: `columns`, `customer_testimonial`, `textmedia`, `testimonial_slider` | ❌ don't invent one; **omit** unless the asset clearly targets a specific component (it biases the generators' framing/scale + routes the result) |

> **STOP before every submit:** run through this table. A `400` from the safe-gate gives no
> field-level error message — you will not know which field failed without checking this list.

## Instructions

**Pre-flight — is this already a finished brief?** If `$ARGUMENTS` (or the user's message)
already contains a complete UnifiedBrief JSON — it has at least `brief`, `brand`, and `mode`
or `dimensions` — do NOT re-interview the user. Parse it, validate it against the
**§ UnifiedBrief wire format** table above (check field names, allowed values, and ranges),
correct any issues silently, then jump straight to step 4 (show it back for a final OK) and
step 5 (submit). Load any rules from step 1 only if you need them to validate. Otherwise
proceed normally from step 1.

1. **Load the rules** (read, do not summarize to the user):
   - `skills/uds-asset-moderator/SKILL.md` — mode rubric, `===PLAN===` contract, embedStyle.
   - `skills/uds-asset-moderator/rules/shared-brief-enrichment.md`
   - `skills/uds-asset-moderator/rules/shared-param-mapping.md`
   - `skills/uds-asset-moderator/rules/shared-cross-generator-consistency.md`
   - `skills/uds-asset-moderator/rules/shared-moderation-principles.md` — the image/illustration/
     hybrid classification rubric; use it to infer `mode` when the user leaves it `auto`.
   - `skills/uds-asset-moderator/rules/human-interactive.md` — the conversation flow you follow.
   - `skills/uds-style-guide/SKILL.md` — brand palette/typography (never invent hex/brand facts).
   - When the asset is (or includes) an **image**, also read `skills/uds-image/SKILL.md` and
     the matching `skills/uds-image/rules/image-type-*.md` (`avatar`, `portrait`,
     `person-scenario`, `scenario`) — these own the camera-shot/face-visibility vocabulary you
     must put into the brief so faces aren't cropped (see human-interactive.md "Image assets").

2. **Follow `human-interactive.md`.** Infer everything you can from `$ARGUMENTS` (likely
   mode, asset type, mood), restate your read in one sentence, then ask only for what is
   genuinely missing or ambiguous — one short batch with smart defaults (brand=ionos,
   colorScheme=light, mode=auto, showroom=dev-local, dimensions 1280×720, durationSec=3,
   loop=false, variants=1, market=de). For any **illustration or hybrid**, ask explicitly
   whether it should be a **still** (single frame, the default) or **animated**; if animated,
   also ask **what kind of motion** is wanted and write that motion description into the
   `brief` (a still gets no motion words; see the "still or animated" round in
   `human-interactive.md`). For an **animated** asset, also confirm whether it should
   **loop seamlessly** (`loop:true`) or play once (`loop:false`, the default).
   Mind the canvas-size → hybrid-look and image crop-safety notes in `human-interactive.md`.
   **Module (optional — do NOT ask):** if the user names a specific downstream component the
   asset will embed into (a `columns` card, a `customer_testimonial`, a `textmedia` block, a
   `testimonial_slider`), note it for step 3's `module` field so the generators bias framing/scale
   for that component. Infer only when clearly stated; otherwise leave `module` unset.

3. **Enrich and assemble** the `UnifiedBrief` JSON (shape and dimension ranges per
   `human-interactive.md`). Write the `brief` text yourself using the enrichment +
   param-mapping rules. Generate a kebab-case `requestId` (≤56 chars) from the subject, and set
   a `callbackUrl` (polling doesn't use it — default `https://n8nwh.ionos.org/webhook/mock-callback`).
   If you inferred a downstream component in step 2, set the optional top-level `module` field to
   it (e.g. `"module": "customer_testimonial"`). Do **not** hand-write a `Consumer module:` line
   into the `brief` — image-svc adds that itself from the `module` field.

4. **Show the user** the assembled UnifiedBrief JSON plus a one-line plain-English summary of
   what will be generated. Let them tweak any field before submitting.

5. **Offer to submit (do not auto-fire).** Ask: submit now, or hand back the brief?
   Detect context first, then use the matching path:

   **A. Local dev** (`$HOME/pipeline-local/secrets/agent-svc.env` exists):
   Write the payload to a temp `*.json` and run `dev/gen.sh <file>` from the uds-moderator
   checkout — it builds the `{requestId, payload, callbackUrl}` envelope, supplies the bearer
   token, and prints inspect commands.

   **B. External / VPN** (default when local dev stack is absent):
   Everything goes **directly to the moderator** at `http://uds-moderator.sandbox.lan:8080`
   (n8n is not in the path). **Submit** (`POST /create`) and **re-render** (`POST /rerender`)
   need the moderator **bearer token**; **status polling** (`GET /jobs/<requestId>`) is
   token-free (protected by network isolation + the unguessable `requestId`). **Downloads** are
   durable **public IONOS S3 URLs**. All are reachable only over the IONOS VPN.

   **Bearer token:** read `AGENT_AUTH_TOKEN` from `$HOME/pipeline-local/secrets/agent-svc.env`
   if that file exists (it doubles as the moderator token); otherwise ask the user once for the
   moderator token (`MODERATOR_AUTH_TOKEN`) and hold it for the session. **Never print the token
   value back to the user.** Below, `$TOKEN` stands for this value.

   **First-time setup (show this the first time the external path is used):**
   > **VPN required:** `uds-moderator.sandbox.lan` is only reachable over the IONOS internal
   > VPN. Connect before running `/imagine`. Submitting also needs the moderator bearer token
   > (auto-read from your `pipeline-local` secrets if present, otherwise I'll ask for it once).

   1. **Smoke-test connectivity** before submitting (only on first use per session). Test the
      **moderator** — it's the one host everything now talks to (submit, poll, re-render), so if
      `/health` answers, the VPN is up and the whole flow is reachable:
      ```bash
      curl -s -o /dev/null -w "%{http_code}" --max-time 8 \
        "http://uds-moderator.sandbox.lan:8080/health"
      ```
      - `200` → connected (moderator reachable — proceed to step 2).
      - curl error / timeout / DNS failure / non-200 → **not reachable from this session.** Do NOT
        show the user curl commands or ask them to poll anything, and do not retry blindly. Go to
        **"Offline / sandbox handoff"** below. This is the expected path inside a cowork cloud
        sandbox (network-isolated, no VPN) and also when the local VPN is simply not connected.

   2. **Submit** to the moderator's `POST /create`. Wrap the flat UnifiedBrief in the envelope
      `{ requestId, payload, callbackUrl }`: `requestId` is the brief's own id, `payload` is the
      **entire** UnifiedBrief, and the top-level `callbackUrl` is where the moderator would push
      the result — `/imagine` polls instead, so a placeholder like
      `https://n8nwh.ionos.org/webhook/mock-callback` is fine (delivery failing is harmless).

      > **⛔ MANDATORY pre-send check — do not skip this step.**
      > Before running the curl below, verify the UnifiedBrief (the `payload`) against the
      > wire-format table in **§ UnifiedBrief wire format** above. Specifically confirm:
      > 1. `dimensions` uses `"w"` and `"h"` — **not** `"width"` / `"height"`.
      > 2. `embedStyle` and `style` are **absent** from the brief.
      > 3. `brand`, `mode`, and `market` are one of their listed allowed values.
      > 4. `variants` ≤ 4, `durationSec` ≤ 30, `dimensions.w` 256–2048, `dimensions.h` 180–2048.
      > 5. `requestId` ≤ 56 chars and a `callbackUrl` is present (in both the brief and envelope).
      > If any check fails, fix the brief and show the corrected JSON to the user before sending.

      ```bash
      curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"requestId":"<id>","payload":<flat UnifiedBrief JSON>,"callbackUrl":"https://n8nwh.ionos.org/webhook/mock-callback"}' \
        "http://uds-moderator.sandbox.lan:8080/create"
      ```
      Confirm `"status":"accepted"` in the response. `401` → wrong/missing bearer token; `400` →
      the brief failed validation (check the wire-format table). Show the body and stop on either.

   3. **Monitor in background** — poll the moderator's status endpoint **directly** (token-free;
      NOT n8n). Write a polling script to `/tmp/poll-<requestId>.sh`:
      ```bash
      #!/usr/bin/env bash
      REQ="$1"
      for i in $(seq 1 90); do
        RESP=$(curl -s --max-time 10 \
          "http://uds-moderator.sandbox.lan:8080/jobs/$REQ")
        STATUS=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "unknown")
        echo "[$i/90] $STATUS"
        # done|partial|error are terminal; planning|running are in-flight (keep polling)
        if [[ "$STATUS" == "done" || "$STATUS" == "error" || "$STATUS" == "partial" ]]; then
          echo "$RESP" > "/tmp/$REQ-result.json"
          echo "COMPLETE: $STATUS"
          break
        fi
        sleep 15
      done
      ```
      Run it with `run_in_background: true` passing `<requestId>` as the only arg. Tell the user:
      *"Job `<requestId>` submitted — monitoring in background (polls every 15 s, up to 22 min)."*

   4. **Download bytes + render** once the background Bash notifies completion: read
      `/tmp/<requestId>-result.json`. Its `outputs` object holds `images` and/or `videos` maps
      (`{ "<variant>": "<url>" }`); the URLs are **durable public IONOS S3 URLs**
      (`https://s3-eu-central-2.ionoscloud.com/…/<variant>.<ext>`) — reachable over the VPN, no
      token. For each `<variant>: <url>` pair across both maps:
      - Derive the extension from the URL path's file suffix: `.png`/`.jpg`/`.jpeg`/`.webp` →
        image; `.mp4`/`.webm`/`.gif` → video; default `png`.
      - Download to a local file:
        ```bash
        curl -fsSL "<url>" -o "/tmp/<requestId>-<variant>.<ext>"
        ```
      - **Image** → display inline: `![<variant>](/tmp/<requestId>-<variant>.<ext>)`
      - **Video / animation** → labelled link (Claude Desktop cannot inline-play video):
        `[<variant> — saved animation](/tmp/<requestId>-<variant>.<ext>)`
      Render all variants. On `error` status, display the `error` field instead. If a single
      variant download fails, report that variant and continue rendering the rest.

   **Offline / sandbox handoff** (when step 1's smoke-test can't reach the pipeline — e.g. a
   cowork cloud sandbox, or the VPN is not connected): you still did the prompt-engineering
   here; hand the finished brief off for a local session to submit. **No terminal, no curl, no
   manual polling for the user.**
   1. Tell the user plainly: *"I can't reach the IONOS asset pipeline from this session (it's
      network-isolated / off-VPN), so I can't generate the image right here — but your brief is
      ready to go."*
   2. Print the complete **UnifiedBrief as a single copy-paste ` ```json ` block** (the full
      flat brief, including `requestId` + `callbackUrl`).
   3. Give these next steps in plain language:
      > **To generate it:** open a **local Claude Code session** — the Claude Code **desktop
      > app** or the `claude` CLI — while connected to the IONOS VPN. Run **`/imagine`** and
      > **paste the brief above** when asked (or send it as `submit this imagine brief: <paste>`).
      > It will submit, wait, and show the finished image(s) right in the chat — you don't need
      > a terminal. (The pasted brief skips the questions and goes straight to submit.)
   4. Only if the user explicitly asks to run it themselves in a terminal, give them the raw
      `curl` submit one-liner (step 5B.2 — including the `Authorization: Bearer` header; they
      supply their own moderator token) + the poll command. Otherwise don't show curl at all.

   **Hand back (user declines to submit, reachable or not):** print the UnifiedBrief JSON for
   them to keep. Offer the `curl` one-liner only if they want to fire it manually.

6. **Offer next steps (proactive menu, after every result).** Once results render, proactively
   present how to move forward. The available options and their **cost** differ by asset type —
   show only the ones that apply and state the cost plainly. This continues the already-reachable
   session from step 5B (no new smoke-test); if any call can't reach the pipeline, fall back to
   the **Offline / sandbox handoff**.

   **If the result is an illustration / animation** (it has **video** variants — re-render is
   cheap: it reuses the composition, no new AI generation, identical motion/layout):
   - **(1) Other languages** — same animation, translated copy, in more markets → **step 6A**.
   - **(2) Different format** — re-encode a variant as `mp4`/`webm`/`gif`/`png` poster → **step 6A**.
   - **(3) Add context & regenerate** — fold new direction into the brief, fresh generation → **step 6B**.

   **If the result is an image** (photoreal images have **no rendered text and no re-render
   path** — the stored S3 file is all there is):
   - **(1) Other markets** — there is **no image “re-render.”** A different `market` is a
     **brand-new generation**: `market` (and the showroom prefix) drives the persona's
     ethnicity/locale (see `uds-image` ethnicity rules), so the person/scene **will look
     different**. **Tell the user plainly it's a fresh image — a new generation, not a
     translation, and the result will differ** — then proceed via **step 6B** with the new market.
   - **(2) Different format** — image-svc returns the stored format (PNG). Other containers are
     not a server feature; only a new generation changes the output. Say so — do **not** fake a
     re-render. (A local file conversion is the user's own step, out of scope here.)
   - **(3) Add context & regenerate** — augment the brief, fresh generation → **step 6B**.

   **Step 6A — Re-render (illustration / animation only).** Localises an existing animation into
   more markets (and/or re-encodes the format) by re-rendering the composition — no new AI
   generation. Goes directly to the moderator.
   1. Ask **which markets** (`de`/`en`/`es`/`fr`/`pl`/`it`/`nl`/`gb`) and, for option (2),
      **which format** (`mp4`/`webm`/`gif`/`png` poster) — ask the format each time. `us`/`uk`
      are **not** valid markets.
   2. **Use the ORIGINAL `requestId`** from step 5B (the one you submitted) plus the **`variant`
      key** from the result's `outputs.videos` map (e.g. `v1`). The moderator resolves the
      internal illustration sub-render itself — do **not** pass a `-illus` id.
   3. **Submit** to the moderator's `POST /rerender` (bearer token; no `callbackUrl` — the
      result is poll-only):
      ```bash
      curl -s -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"requestId":"<original-requestId>","variant":"<v>","markets":["en","fr"],"format":"mp4"}' \
        "http://uds-moderator.sandbox.lan:8080/rerender"
      ```
      Capture `renderId` from the `202` response. `404 run_not_found` → not an illustration /
      unknown requestId; `400 rerender_rejected` → bad market or variant (the `detail` field
      lists the valid values); `401` → bad token. Show the body and stop on any of these.
   4. **Poll `/jobs/<renderId>`** (token-free, same as a first run) — the moderator tracks the
      re-render as its own job keyed by `renderId`. Background poller to `/tmp/poll-<renderId>.sh`:
      ```bash
      #!/usr/bin/env bash
      RID="$1"
      for i in $(seq 1 60); do
        RESP=$(curl -s --max-time 10 "http://uds-moderator.sandbox.lan:8080/jobs/$RID")
        STATUS=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "unknown")
        echo "[$i/60] $STATUS"
        if [[ "$STATUS" == "done" || "$STATUS" == "error" || "$STATUS" == "partial" ]]; then
          echo "$RESP" > "/tmp/$RID-result.json"; echo "COMPLETE: $STATUS"; break
        fi
        sleep 15
      done
      ```
      Run with `run_in_background: true`, passing `<renderId>`. Tell the user the re-render is running.
   5. **Download + render each market** once complete: read `/tmp/<renderId>-result.json`; its
      `outputs.videos` is a **`{ "<market>": "<S3 url>" }`** map. For each market, download the
      public S3 URL (extension from the URL path suffix) to `/tmp/<renderId>-<market>.<ext>`, then
      render: `mp4`/`webm`/`gif` → labelled link `[<market>](/tmp/<renderId>-<market>.<ext>)`;
      `png` poster → inline `![<market>](/tmp/<renderId>-<market>.png)`. Report any market whose
      URL is missing or whose download failed.

   **Step 6B — Regenerate (new generation; image or illustration).** Start from the existing
   UnifiedBrief, apply the change — for "other markets" set the new `market` **and** the showroom
   prefix (so the ethnicity/locale rules pick it up); for "add context" append the user's new
   direction into the `brief` text — then **mint a NEW `requestId`** and submit it through
   **step 5B exactly like a first run** (`POST /create` → poll the moderator `/jobs` → download →
   render). Warn the user up front: this is a **full generation** (takes the usual minutes and
   produces a fresh, different result — not a copy of the previous one).

Keep it conversational and fast. Never block on questions you can answer from the brief or
sensible defaults.
