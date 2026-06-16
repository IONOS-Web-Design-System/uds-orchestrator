---
description: "Interactively formulate a UDS visual-asset brief and (optionally) submit it to the uds-moderator"
allowed-tools: ["Read", "Bash", "Write"]
---

# /imagine

Guided formulation of a visual-asset brief for the UDS two-generator pipeline (image-svc +
agent-svc, orchestrated by uds-moderator). You do the prompt engineering FOR the user: they
describe the asset they want, you produce a ready, enriched **UnifiedBrief** and offer to
submit it.

## Arguments

- `$ARGUMENTS` — a free-text description of the asset the user wants (e.g. "a dark, cinematic
  hero for the AI website builder showing a storefront and a floating assistant panel"). May
  be empty — if so, ask the user what they want to create.

## Instructions

1. **Load the rules** (read, do not summarize to the user):
   - `skills/uds-asset-moderator/SKILL.md` — mode rubric, `===PLAN===` contract, embedStyle.
   - `skills/uds-asset-moderator/rules/shared-brief-enrichment.md`
   - `skills/uds-asset-moderator/rules/shared-param-mapping.md`
   - `skills/uds-asset-moderator/rules/shared-cross-generator-consistency.md`
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
   param-mapping rules. Generate a kebab-case `requestId` (≤56 chars) from the subject.

4. **Show the user** the assembled UnifiedBrief JSON plus a one-line plain-English summary of
   what will be generated. Let them tweak any field before submitting.

5. **Offer to submit (do not auto-fire).** Ask: submit now, or hand back the brief?
   Detect context first, then use the matching path:

   **A. Local dev** (`$HOME/pipeline-local/secrets/agent-svc.env` exists):
   Write the payload to a temp `*.json` and run `dev/gen.sh <file>` from the uds-moderator
   checkout — it builds the `{requestId, payload, callbackUrl}` envelope, supplies the bearer
   token, and prints inspect commands.

   **B. External / VPN** (default when local dev stack is absent):
   Requires `UDS_IMAGINE_TOKEN` env var (= the `N8N_INBOUND_TOKEN` shared secret). If the var
   is unset, show the setup instructions below and stop — do not proceed without it.

   **First-time setup (show this when `UDS_IMAGINE_TOKEN` is missing):**
   > **Get the token:** contact **Bowei Xiao** at **bowei.xiao@ionos.com** to request access
   > to the UDS asset pipeline. He will share the `N8N_INBOUND_TOKEN` value with you.
   >
   > **Set it permanently** (one-time, persists across all Claude Code sessions):
   > ```bash
   > claude config set env.UDS_IMAGINE_TOKEN <token-value>
   > ```
   > This writes to `~/.claude/settings.json` and is picked up automatically from then on.
   > Confirm with: `echo $UDS_IMAGINE_TOKEN` (open a new terminal or re-source your shell).
   >
   > **VPN required:** `n8nwh.ionos.org` is only reachable over the IONOS internal VPN.
   > Connect before running `/imagine`.

   Once the token is set:

   1. **Smoke-test connectivity** before submitting (only on first use per session):
      ```bash
      curl -s -o /dev/null -w "%{http_code}" --max-time 8 \
        -H "Authorization: Bearer $UDS_IMAGINE_TOKEN" \
        "https://n8nwh.ionos.org/webhook/moderator-jobs?requestId=smoke-test"
      ```
      - `404` → connected and authenticated (requestId just not found — proceed).
      - `403` / `401` → token wrong; tell the user to check `UDS_IMAGINE_TOKEN`.
      - curl error / timeout → VPN not connected; tell the user.

   2. **Submit** the envelope `{requestId, payload, callbackUrl}` to the n8n intake:
      ```bash
      curl -s -X POST \
        -H "Authorization: Bearer $UDS_IMAGINE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"requestId":"<id>","payload":<UnifiedBrief>,"callbackUrl":"https://n8nwh.ionos.org/webhook/mock-callback"}' \
        "https://n8nwh.ionos.org/webhook/moderator-trigger"
      ```
      Confirm `status: "accepted"` in the response. If the server returns an error, show it and stop.

   3. **Monitor in background** — write a polling script to `/tmp/poll-<requestId>.sh`:
      ```bash
      #!/usr/bin/env bash
      TOKEN="$1" REQ="$2"
      for i in $(seq 1 90); do
        RESP=$(curl -s --max-time 10 \
          -H "Authorization: Bearer $TOKEN" \
          "https://n8nwh.ionos.org/webhook/moderator-jobs?requestId=$REQ")
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
      Run it with `run_in_background: true` passing `$UDS_IMAGINE_TOKEN` and `<requestId>` as
      args. Tell the user: *"Job `<requestId>` submitted — monitoring in background (polls every
      15 s, up to 22 min)."*

   4. **Render results** once the background Bash notifies completion: read
      `/tmp/<requestId>-result.json`. For each entry in `variantUrls`:
      - Image assets → display inline: `![v0](url)`
      - Video/animation assets → display as a labelled link: `[variant v0](url)`
      Show all variants. On `error` status, display the `error` field instead.

   **Hand back (either path):** print the UnifiedBrief JSON and the submission one-liner so
   the user can fire it themselves.

Keep it conversational and fast. Never block on questions you can answer from the brief or
sensible defaults.
