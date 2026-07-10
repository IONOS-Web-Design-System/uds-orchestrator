---
description: "Interactively formulate a UDS visual-asset brief and (optionally) submit it to the uds-moderator"
allowed-tools: ["Read", "Bash", "Write"]
---

# /imagine

Guided formulation of a visual-asset brief for the UDS two-generator pipeline (image-svc +
agent-svc, orchestrated by uds-moderator). You do the prompt engineering FOR the user: they
describe the asset they want, you produce a ready, enriched **UnifiedBrief** and offer to
submit it.

> **Where to run this:** submit, re-render, and status-polling all go **directly to the
> uds-moderator** — it is the sole API gateway (n8n is no longer in the path). Every call
> carries an `Authorization: Bearer <key>` header. By **default** the moderator is the
> **public cloud** instance over HTTPS (`https://uds-moderator.213-165-77-120.sslip.io`),
> reachable from any network — so
> `/imagine` now works from a local session **and** from Claude Code on the web / a cowork
> cloud sandbox, as long as it has the moderator key. If you instead target the **internal
> sandbox** moderator (`http://uds-moderator.sandbox.lan:8080`), that host is corp-VPN-only —
> connect first. See **§ Connecting to the moderator** for the base-URL + key resolution.
> Asset downloads are durable **public IONOS S3 URLs** (no token). If the connectivity
> smoke-test (step 5B.1) fails, do not retry blindly — go to the offline handoff.

## Arguments

- `$ARGUMENTS` — a free-text description of the asset the user wants (e.g. "a dark, cinematic
  hero for the AI website builder showing a storefront and a floating assistant panel"). May
  be empty — if so, ask the user what they want to create.
- `$ARGUMENTS` may instead be a **complete UnifiedBrief JSON** handed off from another session
  (e.g. an `/imagine` run that couldn't reach the moderator). The user may paste the
  JSON directly or send it as `submit this imagine brief: { … }`. When the input already
  contains a full UnifiedBrief, **skip the interview** and go straight to submit — see the
  Pre-flight note below.

## UnifiedBrief wire format

**This is the exact `UnifiedBrief` shape the moderator accepts as the `payload`.** At submit,
you wrap this brief in the moderator's `{ requestId, payload, callbackUrl }` envelope and POST
it to **`<MODERATOR_BASE>/create`** with a bearer key (step 5B.2). Memorize the shape — wrong
field names cause a silent `400` with no useful error message.

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
| `figmaUrl` | *(optional)* a real `figma.com` URL — a design **reference**, used as the **auto/unroled shorthand for a SINGLE link**. Prefer a full **node** URL (`…?node-id=NN-NN`) so the moderator renders that exact node, not the whole file; it inspects the node and auto-classifies the role. When you know the role the reference should play (see `figmaReferences`), use that field instead — **even for one link**. | ❌ don't bury the link in `brief` — it must be this **top-level field**; a non-`figma.com` URL **causes 400** |
| `figmaReferences` | *(optional)* an **ordered array** of `{ "url": "<figma.com node URL>", "role"?: … }` — the way to assign an **explicit role**, for a **single OR multiple** links. The moderator now honors an explicit role in **any** mode (it no longer infers it from mode alone), so this is the reliable lever. Roles: **`screen-content`** = show this UI design ON a device's screen in the asset (needs a **node** URL; use image/hybrid mode); **`reconstruct`** = rebuild/animate the design as the asset itself (illustration/hybrid); **`style`** = brand/aesthetic reference only; **`keyframe`** = one frame of an ordered animation storyboard. Omit `role` to auto-classify. Order matters. Wins over `figmaUrl`. Cap 12. | ❌ don't put multiple links in one `figmaUrl` string; ❌ don't bury them in `brief` |

> **STOP before every submit:** run through this table. A `400` from the safe-gate gives no
> field-level error message — you will not know which field failed without checking this list.
>
> **Figma reference (`figmaUrl` / `figmaReferences`):** these are **top-level siblings** of
> `brief`, never part of the `brief` text. The canonical JSON example above omits both (they're
> optional). One link with **no** specific role → `"figmaUrl": "https://www.figma.com/design/<key>/<name>?node-id=12-34"`.
> A link with an **explicit role** (`screen-content` / `reconstruct` / `style`), or several ordered
> links, → use the top-level array instead:
> `"figmaReferences": [{ "url": "https://www.figma.com/design/<key>/<name>?node-id=12-34", "role": "screen-content" }, …]`.
> Never set both — `figmaReferences` wins if present.

## Connecting to the moderator

Before any moderator call (submit / re-render / poll), resolve **two values** — do this once
per session and reuse them. All three call types send `-H "Authorization: Bearer $MODERATOR_TOKEN"`.

**`MODERATOR_BASE`** (base URL, no trailing slash):
1. `$MODERATOR_BASE` if set in the environment.
2. else a `MODERATOR_BASE=` line in `$HOME/pipeline-local/secrets/agent-svc.env`, if that file exists.
3. else the default **`https://uds-moderator.213-165-77-120.sslip.io`** (the public cloud moderator, HTTPS via Caddy + Let's Encrypt).
   *(This sslip.io name is a temporary stopgap; swap to `https://uds-moderator.ionos.org` here once corporate DNS provisions it — a one-value change.)*
   For the internal sandbox moderator instead, set `MODERATOR_BASE=http://uds-moderator.sandbox.lan:8080` (corp-VPN only).

**`MODERATOR_TOKEN`** (the bearer key for this client) — resolution order:
1. **`$MODERATOR_TOKEN`** — its **default home is the `env` block of the user's Claude Code
   settings, `~/.claude/settings.json`** (Claude Code exports that env to every tool run). This is
   where external users store their key once (see **First-time token setup** below). A shell
   `export MODERATOR_TOKEN=…` works too.
2. else the dev-stack fallback: `AGENT_AUTH_TOKEN=` (or `MODERATOR_AUTH_TOKEN=`) in
   `$HOME/pipeline-local/secrets/agent-svc.env`.
3. else **prompt once**, then persist to `~/.claude/settings.json` via the setup script (below) so
   future sessions never prompt again — and use the just-entered value for the current run too.

Resolve both at the start of the submit path (env-first — the settings.json `env` provides them):

```bash
PL="$HOME/pipeline-local/secrets"
MODERATOR_BASE="${MODERATOR_BASE:-$(grep -h '^MODERATOR_BASE=' "$PL/agent-svc.env" "$PL/imagine.env" 2>/dev/null | tail -1 | cut -d= -f2-)}"
MODERATOR_BASE="${MODERATOR_BASE:-https://uds-moderator.213-165-77-120.sslip.io}"
MODERATOR_TOKEN="${MODERATOR_TOKEN:-$(grep -h -E '^(MODERATOR_TOKEN|AGENT_AUTH_TOKEN|MODERATOR_AUTH_TOKEN)=' "$PL/imagine.env" "$PL/agent-svc.env" 2>/dev/null | tail -1 | cut -d= -f2-)}"
```

### First-time token setup (how a user adds their key to the environment)

The token lives in the **user's own environment, never in this command** (the command ships to
everyone via the plugin — a key baked in here would leak to all). An operator issues the user a
`client` key out-of-band; the user stores it **once**:

- **Recommended — run the setup script** (merge-safe: writes `env.MODERATOR_TOKEN` into
  `~/.claude/settings.json`, preserving everything else; refuses to clobber invalid JSON):
  ```bash
  node <uds-orchestrator-plugin-dir>/scripts/set-moderator-token.mjs
  # prompts (hidden) for the key. Add `--base <url>` to also pin a non-default MODERATOR_BASE.
  ```
- **Or add it manually** to `~/.claude/settings.json`:
  ```json
  { "env": { "MODERATOR_TOKEN": "<your-client-key>" } }
  ```
Either way, **restart the Claude Code session** so the `env` is picked up. Afterwards `/imagine`
finds the key automatically — no prompt, no key in the command. (The key sits in plaintext in the
user's own config, same as any API key in a dotfile; rotate/revoke via the moderator allowlist.)

**If `/imagine` reaches submit with no token** (resolution 1–2 empty): ask the user for their key,
use it for the current run, **and** persist it by running the setup script with the value piped in
(locate `scripts/set-moderator-token.mjs` in this plugin's own directory) so they're set next time:
```bash
MODERATOR_TOKEN="<the key the user gave>" node <plugin-dir>/scripts/set-moderator-token.mjs
```
Never proceed to a mutation (`/create`, `/rerender`) without a token — they return `401`. Always
send the bearer on `/jobs` polling too, so it keeps working now that per-client keys are enforced.

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
   **Figma reference (optional — detect, do NOT ask for one):** if the user's message contains a
   `figma.com` URL, treat it as a design **reference**, not part of the description — keep the raw
   link OUT of the `brief` text. Then decide the reference's **role** from the user's intent. The
   moderator honors an explicit role in **any** mode, so the role — not the mode — is what reliably
   gets the reference used correctly; do **not** leave a clear role to be guessed:
   - **`screen-content`** — the user wants this UI/screen design shown **on a device's screen** in
     the asset ("our eshop on a laptop", "the app running on a phone", "this dashboard on a
     monitor"). This is the common case for a pasted product/UI design. It needs a **node** URL (the
     moderator renders that node and composites it) — if the link has no `?node-id=`, ask for a
     specific node URL, since without it there is nothing to put on the screen. Pick **image** mode
     (or **hybrid** if the scene also animates) — a device screen has no place in a pure illustration.
   - **`reconstruct`** — the user wants the design itself **rebuilt / animated** as the asset
     (design → animated layers, e.g. a login→dashboard flow). Pick **illustration** or **hybrid** mode.
   - **`style`** — the design is only a **brand / aesthetic** reference (colors, mood, look), not
     literal content to reproduce. Any mode.
   - **omit the role** only when the intent is genuinely unclear — the moderator auto-classifies.
   **Restate in one line** what the reference will do so the user can steer, then carry it (with its
   role) to step 3.
   **Multiple Figma links:** if the message contains **more than one** `figma.com` URL, collect
   them **in the order given** for step 3's `figmaReferences` array. Tag each entry's `role` per the
   rubric above; an ordered animation sequence (a numbered list of frames, "as a storyboard") →
   `role:"keyframe"` for each. Keep every URL out of the `brief` text — but do write the per-beat
   motion description (what happens between/at each keyframe) into `brief`.

3. **Enrich and assemble** the `UnifiedBrief` JSON (shape and dimension ranges per
   `human-interactive.md`). Write the `brief` text yourself using the enrichment +
   param-mapping rules. Generate a kebab-case `requestId` (≤56 chars) from the subject, and set
   a `callbackUrl` (polling doesn't use it — default `https://n8nwh.ionos.org/webhook/mock-callback`).
   If you inferred a downstream component in step 2, set the optional top-level `module` field to
   it (e.g. `"module": "customer_testimonial"`). Do **not** hand-write a `Consumer module:` line
   into the `brief` — image-svc adds that itself from the `module` field.
   **Figma reference:** if you inferred an explicit **role** in step 2 (`screen-content` /
   `reconstruct` / `style` / `keyframe`) — for one link OR several — set the top-level
   `figmaReferences` array of `{ "url": "...", "role": "..." }` in order (cap 12 entries) and
   **omit `figmaUrl`**. Only when a **single** link has **no** role (genuinely auto) use the
   top-level `figmaUrl` shorthand instead. Never set both on the same brief. In every case the
   link(s) must **not** also appear in the `brief` text — the moderator inspects the top-level
   field and threads it to the generators; a link left only inside `brief` is ignored. For a
   `screen-content` reference, make sure the URL includes `?node-id=` (no node ⇒ nothing to
   composite onto the screen).

4. **Show the user** the assembled UnifiedBrief JSON plus a one-line plain-English summary of
   what will be generated. Let them tweak any field before submitting.

5. **Offer to submit (do not auto-fire).** Ask: submit now, or hand back the brief?
   Detect context first, then use the matching path:

   **A. Local dev** (`$HOME/pipeline-local/secrets/agent-svc.env` exists AND a local uds-moderator
   stack is running): write the payload to a temp `*.json` and run `dev/gen.sh <file>` from the
   uds-moderator checkout — it builds the `{requestId, payload, callbackUrl}` envelope, supplies
   the bearer token, targets the local moderator, and prints inspect commands. This is a shortcut
   for the local-stack workflow; the remote path (B) works too if you set `MODERATOR_BASE`.

   **B. Direct to moderator** (default): submit, re-render, and poll all go **directly to the
   moderator** at `MODERATOR_BASE`, each with the bearer key. Resolve `MODERATOR_BASE` +
   `MODERATOR_TOKEN` per **§ Connecting to the moderator** first. Downloads are durable **public
   IONOS S3 URLs** (no token).

   **First-time setup (show this the first time the direct path is used):**
   > **Moderator key required.** `/imagine` submits straight to the uds-moderator with a bearer
   > key. By default it targets the **public cloud** moderator (reachable from anywhere). Store your
   > key once — run `node <plugin-dir>/scripts/set-moderator-token.mjs` (writes `env.MODERATOR_TOKEN`
   > into `~/.claude/settings.json`) or add `{"env":{"MODERATOR_TOKEN":"<key>"}}` there yourself, then
   > restart the session — see **§ Connecting to the moderator → First-time token setup**. Without it
   > I'll ask once and persist it for you. To use the internal **sandbox** moderator instead, set
   > `MODERATOR_BASE=http://uds-moderator.sandbox.lan:8080` and connect to the IONOS VPN first.

   1. **Smoke-test connectivity** before submitting (only on first use per session). Hit the
      moderator's `/health` (free, no token):
      ```bash
      curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$MODERATOR_BASE/health"
      ```
      - `200` → reachable — proceed to step 2.
      - curl error / timeout / DNS failure / non-200 → **not reachable from this session.** Do NOT
        show the user curl commands or ask them to poll anything, and do not retry blindly. Go to
        **"Offline / handoff"** below. (Expected if `MODERATOR_BASE` is the sandbox host and the
        VPN is not connected. The public cloud default should be reachable from any network.)

   2. **Submit** to `POST $MODERATOR_BASE/create` — wrap the flat UnifiedBrief in the moderator's
      envelope `{ "requestId": <brief.requestId>, "payload": <flat UnifiedBrief>, "callbackUrl":
      <brief.callbackUrl> }` and send the bearer. The `callbackUrl` may be the mock placeholder
      (`/imagine` polls instead of receiving a push, so a failed delivery is harmless).

      > **⛔ MANDATORY pre-send check — do not skip this step.**
      > Before running the curl below, verify the UnifiedBrief against the wire-format table in
      > **§ UnifiedBrief wire format** above. Specifically confirm:
      > 1. `dimensions` uses `"w"` and `"h"` — **not** `"width"` / `"height"`.
      > 2. `embedStyle` and `style` are **absent** from the brief.
      > 3. `brand`, `mode`, and `market` are one of their listed allowed values.
      > 4. `variants` ≤ 4, `durationSec` ≤ 30, `dimensions.w` 256–2048, `dimensions.h` 180–2048.
      > 5. `requestId` ≤ 56 chars and `callbackUrl` is present.
      > 6. Any Figma reference with an inferred **role** (`screen-content` / `reconstruct` /
      >    `style` / `keyframe`) — single or multiple — is in the top-level `figmaReferences`
      >    **ordered array** of `{url, role}` (each `url` a real `figma.com` URL, ≤12) with
      >    `figmaUrl` **absent**. A `screen-content` entry's URL includes `?node-id=`.
      > 7. A **single, unroled** Figma link may instead use the top-level `figmaUrl` string (a real
      >    `figma.com` URL). Never set both `figmaUrl` and `figmaReferences`; never embed a link in
      >    `brief`. Omit both fields entirely if there is no reference.
      > If any check fails, fix the brief and show the corrected JSON to the user before sending.

      Build the envelope and submit (the payload here is the flat UnifiedBrief you assembled):
      ```bash
      curl -s -X POST \
        -H "Authorization: Bearer $MODERATOR_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"requestId":"<requestId>","payload":<flat UnifiedBrief JSON>,"callbackUrl":"<callbackUrl>"}' \
        "$MODERATOR_BASE/create"
      ```
      Confirm `"status":"accepted"` in the response (`202`). `401` → the bearer key is missing or
      wrong (re-check `MODERATOR_TOKEN`); `400` → the brief failed validation (check the wire-format
      table — brand/mode/variants/duration/dimensions gates). Show the body and stop on either.

   3. **Monitor in background** — poll the moderator's status endpoint (send the bearer; it's
      accepted whether or not `/jobs` is currently enforced). Write a polling script to
      `/tmp/poll-<requestId>.sh`:
      ```bash
      #!/usr/bin/env bash
      REQ="$1"; BASE="$2"; TOK="$3"
      for i in $(seq 1 90); do
        RESP=$(curl -s --max-time 10 -H "Authorization: Bearer $TOK" "$BASE/jobs/$REQ")
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
      Run it with `run_in_background: true`, passing `<requestId>`, `$MODERATOR_BASE`, and
      `$MODERATOR_TOKEN` as the three args. Tell the user:
      *"Job `<requestId>` submitted — monitoring in background (polls every 15 s, up to 22 min)."*

   4. **Download bytes + render** once the background Bash notifies completion: read
      `/tmp/<requestId>-result.json`. Its `outputs` object holds `images` and/or `videos` maps
      (`{ "<variant>": "<url>" }`); the URLs are **durable public IONOS S3 URLs** — reachable
      without a token. For each `<variant>: <url>` pair across both maps:
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

   **Offline / handoff** (when step 1's smoke-test can't reach the moderator — e.g. the sandbox
   base is set but the VPN is off, or a fully network-isolated session): you still did the
   prompt-engineering here; hand the finished brief off for a session that can reach it. **No
   terminal, no curl, no manual polling for the user.**
   1. Tell the user plainly: *"I can't reach the uds-moderator from this session, so I can't
      generate the image right here — but your brief is ready to go."*
   2. Print the complete **UnifiedBrief as a single copy-paste ` ```json ` block** (the full
      flat brief, including `requestId` + `callbackUrl`).
   3. Give these next steps in plain language:
      > **To generate it:** open a Claude Code session that can reach the moderator (the desktop
      > app or `claude` CLI; the default cloud moderator works from any network — a sandbox base
      > needs the IONOS VPN). Run **`/imagine`** and **paste the brief above** when asked (or send
      > it as `submit this imagine brief: <paste>`). It will submit, wait, and show the finished
      > image(s) right in the chat — you don't need a terminal. (The pasted brief skips the
      > questions and goes straight to submit.)
   4. Only if the user explicitly asks to run it themselves in a terminal, give them the raw
      `curl` submit one-liner (step 5B.2 — including the `Authorization: Bearer` header with
      their key) + the poll command. Otherwise don't show curl at all.

   **Hand back (user declines to submit, reachable or not):** print the UnifiedBrief JSON for
   them to keep. Offer the `curl` one-liner (with the bearer header) only if they want to fire it manually.

6. **Offer next steps (proactive menu, after every result).** Once results render, proactively
   present how to move forward. The available options and their **cost** differ by asset type —
   show only the ones that apply and state the cost plainly. This continues the already-reachable
   session from step 5B (no new smoke-test); if any call can't reach the moderator, fall back to
   the **Offline / handoff**.

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
   generation. Goes **directly to the moderator** `POST $MODERATOR_BASE/rerender` with the bearer.
   1. Ask **which markets** (`de`/`en`/`es`/`fr`/`pl`/`it`/`nl`/`gb`) and, for option (2),
      **which format** (`mp4`/`webm`/`gif`/`png` poster) — ask the format each time. `us`/`uk`
      are **not** valid markets.
   2. **Use the ORIGINAL `requestId`** from step 5B (the one you submitted) plus the **`variant`
      key** from the result's `outputs.videos` map (e.g. `v1`). The moderator resolves the
      internal illustration sub-render itself — do **not** pass a `-illus` id.
   3. **Submit** `POST $MODERATOR_BASE/rerender` with the bearer (no `callbackUrl` — the result is
      poll-only). The body is the flat rerender request, **not** a `/create` envelope:
      ```bash
      curl -s -X POST \
        -H "Authorization: Bearer $MODERATOR_TOKEN" -H "Content-Type: application/json" \
        -d '{"requestId":"<original-requestId>","variant":"<v>","markets":["en","fr"],"format":"mp4"}' \
        "$MODERATOR_BASE/rerender"
      ```
      Capture `renderId` from the `202` response. `401` → bad/missing bearer key;
      `400 {"error":"rerender_rejected",...}` → missing/empty `requestId`/`variant` or an invalid
      market/variant (the moderator relays the reason in `detail`); `404 {"error":"run_not_found"}`
      → unknown `requestId`; `502 {"error":"rerender_trigger_failed"}` → the render backend couldn't
      be reached. Show the body and stop on any error.
   4. **Poll `$MODERATOR_BASE/jobs/<renderId>`** (send the bearer) — the moderator tracks the
      re-render as its own job keyed by `renderId`. Background poller to `/tmp/poll-<renderId>.sh`:
      ```bash
      #!/usr/bin/env bash
      RID="$1"; BASE="$2"; TOK="$3"
      for i in $(seq 1 60); do
        RESP=$(curl -s --max-time 10 -H "Authorization: Bearer $TOK" "$BASE/jobs/$RID")
        STATUS=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "unknown")
        echo "[$i/60] $STATUS"
        if [[ "$STATUS" == "done" || "$STATUS" == "error" || "$STATUS" == "partial" ]]; then
          echo "$RESP" > "/tmp/$RID-result.json"; echo "COMPLETE: $STATUS"; break
        fi
        sleep 15
      done
      ```
      Run with `run_in_background: true`, passing `<renderId>`, `$MODERATOR_BASE`, `$MODERATOR_TOKEN`.
      Tell the user the re-render is running.
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
   **step 5B exactly like a first run** (envelope → `POST $MODERATOR_BASE/create` with the bearer →
   poll `/jobs` → download → render). Warn the user up front: this is a **full generation** (takes
   the usual minutes and produces a fresh, different result — not a copy of the previous one).

Keep it conversational and fast. Never block on questions you can answer from the brief or
sensible defaults.
