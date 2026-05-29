---
name: illustration-pipeline
description: Concrete rules for using the skill-iteration skill against the agent-svc illustration pipeline. Supplies DB path, SQL queries, replay endpoint, Player URL pattern, and token resolution.
metadata:
  tags: eval, illustration-pipeline, agent-svc, internal
---

## Inputs

| Resource | Value |
|---|---|
| SQLite trace DB | `$HOME/pipeline-local/agent-data/agent-svc.db` |
| Replay endpoint | `http://localhost:8080/eval/replay` |
| Player URL pattern | `http://localhost:8080/debug/preview/<runId>/<variantId>?token=$TOKEN` |
| `AGENT_AUTH_TOKEN` source | `$HOME/pipeline-local/secrets/agent-svc.env` (line `AGENT_AUTH_TOKEN=…`) |
| Health endpoint | `http://localhost:8080/health` |
| Inlined skills (the three this loop edits) | `remotion-best-practices`, `uds-style-guide`, `uds-wireframe` |
| Skill source of truth | `$HOME/uds-orchestrator/skills/<slug>/SKILL.md` |

## Token resolution

Run this once at the start of any invocation:

```bash
TOKEN=$(grep '^AGENT_AUTH_TOKEN=' ~/pipeline-local/secrets/agent-svc.env | cut -d= -f2)
```

If `$TOKEN` is empty, stop and tell the human to populate
`agent-svc.env`.

## Step 1 — SQL queries

Run in order. All against `$DB_PATH`. Use `sqlite3 -header -separator '|'`
for stable parsing.

```bash
DB=~/pipeline-local/agent-data/agent-svc.db
RUN_ID="<provided>"
# RUN_ID is interpolated directly into SQL. agent-svc's zod validator
# constrains it to UUID-or-alphanumeric (max 64 chars), so single-quote
# injection is not possible in practice. Do not relax this without
# revisiting the queries below.

# Q1 — run header
sqlite3 "$DB" "SELECT id, status, brand, showroom, feature, intent, width, height, duration_sec, variants, llm_provider, llm_model, started_at, total_duration_ms FROM runs WHERE id = '$RUN_ID';"

# Q2 — attempts
sqlite3 "$DB" "SELECT id, attempt_no, llm_duration_ms, parse_error FROM attempts WHERE run_id = '$RUN_ID' ORDER BY attempt_no;"

# Q3 — gate diagnostics
sqlite3 "$DB" "SELECT g.gate, g.ok, substr(g.diagnostics, 1, 200) AS diag_preview FROM gate_runs g JOIN attempts a ON a.id = g.attempt_id WHERE a.run_id = '$RUN_ID' ORDER BY a.attempt_no, g.id;"

# Q4 — skill versions used
sqlite3 "$DB" "SELECT ask.slug, substr(ask.sha, 1, 16) AS sha_prefix FROM attempt_skills ask JOIN attempts a ON a.id = ask.attempt_id WHERE a.run_id = '$RUN_ID';"

# Q5 — exact skill bodies the model saw (per slug)
sqlite3 "$DB" "SELECT slug, sha, content FROM skill_versions WHERE (slug, sha) IN (SELECT ask.slug, ask.sha FROM attempt_skills ask JOIN attempts a ON a.id = ask.attempt_id WHERE a.run_id = '$RUN_ID');"

# Q6 — final artifacts
sqlite3 "$DB" "SELECT path, length(content) AS bytes FROM artifacts WHERE run_id = '$RUN_ID' AND is_final = 1 ORDER BY path;"

# Q7 — renders
sqlite3 "$DB" "SELECT variant_id, status, mp4_path, duration_ms FROM renders WHERE run_id = '$RUN_ID' ORDER BY variant_id;"

# Q8 — compare-mode probe
sqlite3 "$DB" "SELECT original_run_id FROM eval_replays WHERE replay_run_id = '$RUN_ID';"
```

If Q8 returns a row, this is a replay. Re-run Q1-Q7 for the
`original_run_id` and build a side-by-side comparison.

## Step 2 — Summary format

```
RUN <runId>{compare-mode: ` (replay of <originalRunId>)`}
brief:    <brand> / <showroom> / "<feature>" / <intent>
result:   <status> · <variants> variant(s) · <total_ms>ms · gates <ok>/<total> pass
attempts: <count>{retries: ` (<retries> retries)`}
skills:   remotion-best-practices@<sha-prefix>, uds-style-guide@<sha-prefix>, uds-wireframe@<sha-prefix>
artifacts: <path> (<bytes>B), ...

▶ Preview: http://localhost:8080/debug/preview/<runId>/<variantId>?token=<TOKEN>
```

Compare mode appends:

```
                   ORIGINAL                  REPLAY
gates              <orig-gates>              <replay-gates>
attempts           <orig-attempts>           <replay-attempts>
final TSX bytes    <orig-bytes>              <replay-bytes>
skill diff         <slug>@<orig-sha>  vs  <slug>@<replay-sha>  (<n> lines changed)
```

## Steps 3–6 — unchanged

The overlay only overrides Steps 1, 2, and 7. Steps 3 (collect human
input), 4 (identify implicated skill), 5 (propose edit), and 6 (apply on
approval) follow `SKILL.md` verbatim — no pipeline-specific overrides.

## Step 7 — Replay command

```bash
TOKEN=$(grep '^AGENT_AUTH_TOKEN=' ~/pipeline-local/secrets/agent-svc.env | cut -d= -f2)
curl -sS -X POST http://localhost:8080/eval/replay \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"originalRunId":"<runId>","skillOverrides":[],"temperature":0}'
```

Empty `skillOverrides` is intentional: agent-svc reads the on-disk
`SKILL.md` (which the human just edited) at the next `/generate`.

## Failure modes

| Condition | Response |
|---|---|
| `DB` file does not exist | "Expected DB at `~/pipeline-local/agent-data/agent-svc.db`. Compose mounts `agent-data:/shared/data` — check the host volume." Stop. |
| `Q1` returns no row | "Run `$RUN_ID` not in DB. Try `cd ~/agent-svc/eval-cli && DB_PATH=$DB node . list --limit 30`." Stop. |
| `Q2` returns zero rows | "Pipeline failed before any LLM attempt — likely an infra issue (Figma fetch, workspace clone, etc.). Out of scope for skill iteration; check `runs.status` and the agent-svc container logs." Stop. |
| Any attempt has `parse_error IS NOT NULL` | Surface clearly: "this run failed at the OUTPUT CONTRACT parse stage, not at a skill-driven behavior. Editing a skill rarely fixes that — the fix is usually in `agent-svc/src/agents/prompt.ts`. Continue anyway? (y/N)" |
| `Q8` returns empty | Diagnose mode — fresh investigation, no compare panel. |
| A `SKILL.md` file missing on disk | "Cannot propose edits — `~/uds-orchestrator/skills/<slug>/SKILL.md` is missing. Fix your orchestrator clone first." Stop. |
| `curl http://localhost:8080/health` non-200 | "Agent-svc container is not reachable. `cd ~/pipeline-local && docker compose up -d agent-svc` and retry." Stop. |
| `EVAL_MODE` not enabled. The agent-svc auth middleware runs before routing, so an unauthenticated probe always returns 401. Probe with `curl -sS -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/eval/replay -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}'`. **400** = route registered (validation rejected empty body — fine); **404** = route not registered (EVAL_MODE off); **401** = token wrong. | "`/eval/replay` returned 404 — set `EVAL_MODE=1` in `~/pipeline-local/secrets/agent-svc.env` and `docker compose up -d agent-svc`." Stop. |
| Triage ambiguity (Step 4) | Surface ranked list, wait for pick. |
| Diff refined > 3 rounds | Surface "step back" prompt (see SKILL.md). |
