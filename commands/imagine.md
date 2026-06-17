---
description: "Interactively formulate a UDS visual-asset brief and (optionally) submit it to the uds-moderator"
allowed-tools: ["Read", "Bash", "Write"]
---

# /imagine

Guided formulation of a visual-asset brief for the UDS two-generator pipeline (image-svc +
agent-svc, orchestrated by uds-moderator). You do the prompt engineering FOR the user: they
describe the asset they want, you produce a ready, enriched **UnifiedBrief** and offer to
submit it.

> **Where to run this:** the external submit / poll / download steps reach `n8nwh.ionos.org`,
> an IONOS-internal host. Run `/imagine` from a **local** Claude Code session (the CLI or the
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

## Instructions

**Pre-flight — is this already a finished brief?** If `$ARGUMENTS` (or the user's message)
already contains a complete UnifiedBrief JSON — it has at least `brief`, `brand`, and `mode`
or `dimensions` — do NOT re-interview the user. Parse it, sanity-check it (required fields
present; dimension ranges per `human-interactive.md`), then jump straight to step 4 (show it
back for a final OK) and step 5 (submit). Load any rules from step 1 only if you need them to
validate. Otherwise proceed normally from step 1.

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
   loop=false, variants=1, market=de). For an **animated** asset, also confirm whether it
   should **loop seamlessly** (`loop:true`) or play once (`loop:false`, the default). Mind the
   canvas-size → hybrid-look and image crop-safety notes in `human-interactive.md`.

3. **Enrich and assemble** the `UnifiedBrief` JSON (shape and dimension ranges per
   `human-interactive.md`). Write the `brief` text yourself using the enrichment +
   param-mapping rules. Generate a kebab-case `requestId` (≤56 chars) from the subject, and set
   a `callbackUrl` (polling doesn't use it — default `https://n8nwh.ionos.org/webhook/mock-callback`).

4. **Show the user** the assembled UnifiedBrief JSON plus a one-line plain-English summary of
   what will be generated. Let them tweak any field before submitting.

5. **Offer to submit (do not auto-fire).** Ask: submit now, or hand back the brief?
   Detect context first, then use the matching path:

   **A. Local dev** (`$HOME/pipeline-local/secrets/agent-svc.env` exists):
   Write the payload to a temp `*.json` and run `dev/gen.sh <file>` from the uds-moderator
   checkout — it builds the `{requestId, payload, callbackUrl}` envelope, supplies the bearer
   token, and prints inspect commands.

   **B. External / VPN** (default when local dev stack is absent):
   No token required — the `/imagine` bridge endpoints (`imagine-trigger` / `imagine-jobs`) are
   unauthenticated and protected by network isolation. The only requirement is the IONOS VPN,
   since `n8nwh.ionos.org` is corp-internal (NXDOMAIN publicly, RFC1918).

   **First-time setup (show this the first time the external path is used):**
   > **VPN required:** `n8nwh.ionos.org` is only reachable over the IONOS internal VPN.
   > Connect before running `/imagine`. No token or config is needed.

   1. **Smoke-test connectivity** before submitting (only on first use per session):
      ```bash
      curl -s -o /dev/null -w "%{http_code}" --max-time 8 \
        "https://n8nwh.ionos.org/webhook/imagine-jobs?requestId=smoke-test"
      ```
      - `404` → connected (requestId just not found — proceed to step 2).
      - curl error / timeout / DNS failure → **not reachable from this session.** Do NOT show
        the user curl commands or ask them to poll anything, and do not retry blindly. Go to
        **"Offline / sandbox handoff"** below. This is the expected path inside a cowork cloud
        sandbox (network-isolated, no VPN) and also when the local VPN is simply not connected.

   2. **Submit** the **UnifiedBrief directly** to the imagine intake — send the brief JSON as the
      request body. Do **NOT** wrap it in a `{requestId, payload, callbackUrl}` envelope: the
      `imagine-trigger` endpoint expects the flat UnifiedBrief, which already carries its own
      `requestId`, `callbackUrl`, `brand`, `mode`, `dimensions`, etc. (Ensure step 3 put
      `requestId` and a `callbackUrl` — e.g. `https://n8nwh.ionos.org/webhook/mock-callback` —
      inside the brief.)
      ```bash
      curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '<UnifiedBrief JSON, flat — includes requestId and callbackUrl>' \
        "https://n8nwh.ionos.org/webhook/imagine-trigger"
      ```
      Confirm `status: "accepted"` in the response. If the body lacks it, the moderator safe-gate
      rejected the brief — show the body and stop.

   3. **Monitor in background** — write a polling script to `/tmp/poll-<requestId>.sh`:
      ```bash
      #!/usr/bin/env bash
      REQ="$1"
      for i in $(seq 1 90); do
        RESP=$(curl -s --max-time 10 \
          "https://n8nwh.ionos.org/webhook/imagine-jobs?requestId=$REQ")
        STATUS=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "unknown")
        echo "[$i/90] $STATUS"
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
      `/tmp/<requestId>-result.json`. Its `variantUrls` map values are **unauthenticated n8n
      proxy URLs** (`…/webhook/image-download?…` / `…/webhook/download?…`) — VPN-reachable, not
      internal-VM URLs. For each `<variant>: <url>` pair:
      - Derive the extension from the URL's `format=` query param: `png`/`jpg`/`jpeg`/`webp` →
        image; `mp4`/`webm`/`gif` → video; default `png`.
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
      `curl` submit one-liner (step 2) + the poll command. Otherwise don't show curl at all.

   **Hand back (user declines to submit, reachable or not):** print the UnifiedBrief JSON for
   them to keep. Offer the `curl` one-liner only if they want to fire it manually.

Keep it conversational and fast. Never block on questions you can answer from the brief or
sensible defaults.
