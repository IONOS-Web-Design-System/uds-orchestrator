---
name: skill-iteration
description: Suggest-only iteration loop for improving AI-codegen skills. Use this skill when invoked via /iter-skill <runId>. Loads a pipeline-specific overlay from rules/ that supplies the concrete DB path, SQL queries, and replay endpoint. Drives a 7-step conversation (load context → present summary → collect feedback → identify implicated skill → propose diff → apply on approval → hand off to replay). NEVER applies an edit or triggers a replay without explicit per-action human approval.
metadata:
  tags: eval, skill-iteration, internal, suggest-only
---

## When to use

Invoked by the `/iter-skill <runId>` slash command. Not auto-triggered. The
human passes a specific run ID they want to iterate on; this skill loads the
trace, proposes a skill edit, and hands off to a manual replay.

## Hard rules — read first

1. **Suggest-only.** Never edit a `SKILL.md` file or call `/eval/replay`
   without explicit per-action human approval in the current chat turn.
2. **One skill at a time.** Propose an edit to exactly one inlined skill per
   round. If multiple skills are implicated, surface a ranked triage and ask
   the human to pick.
3. **No closed-loop.** After the human approves a `curl /eval/replay`
   command, print it (do not execute), then end. The human runs it; they
   come back with a new runId and start a fresh invocation.
4. **No autonomous file writes.** Even when applying an approved edit, use
   the `Edit` tool only on the exact path the human confirmed. Never create
   new skills, never edit unrelated lines.

## Pipeline-specific overlay

This skill is generic. Read `rules/illustration-pipeline.md` for the
concrete details specific to the agent-svc illustration pipeline:
- Path to the SQLite trace database
- The exact SQL queries to run in Step 1
- Names of the inlined skills (`remotion-best-practices`,
  `uds-style-guide`, `uds-wireframe`)
- Replay endpoint URL
- How to resolve `AGENT_AUTH_TOKEN`
- Player URL pattern

If a different pipeline ever uses this skill, it provides its own
`rules/<other-pipeline>.md`. The 7-step shape below does not change.

## The 7-step loop

### Step 1 — Load context (silent, before talking)

Run the SQL queries listed in the rules overlay (Q1–Q7 for data, Q8 for compare-mode detection). Capture into
variables for use in Step 2. Probe `eval_replays` to detect compare mode.

If any query fails (DB missing, run not found, no attempts), follow the
"Failure modes" section below.

### Step 2 — Present the summary

A single markdown block to the chat covering: run ID (and "replay of X" if
compare mode), brief (brand/showroom/feature/intent), result status with
gate counts, attempt count, skill versions used (slug@sha-prefix),
artifact file paths, Player URL.

In compare mode, append a side-by-side table:
- gates (orig vs replay)
- attempt count (orig vs replay)
- final TSX line count (orig vs replay)
- skill diff (which inlined skill changed sha, and how many lines)

### Step 3 — Collect human input

- Diagnose mode: "Open the preview, then tell me what looked wrong."
- Compare mode: "Better / worse / sideways / done?" then "What changed in
  the direction you wanted, what didn't?"

Wait for the human's reply. Do not propose anything before they speak.

### Step 4 — Identify the implicated skill

Read the three current `SKILL.md` bodies. Cross-reference the human's
feedback with each. Pick the most likely candidate.

If confidence is low (e.g. the feedback could plausibly map to two of the
three skills), surface a ranked triage:

> "I think this is `uds-wireframe` (high), but it could be
> `remotion-best-practices` (medium). Which should I focus on?"

Wait for the human's pick before proceeding.

### Step 5 — Propose the edit

Output a fenced diff block plus a one-line rationale:

````
**Proposed edit to `uds-wireframe/SKILL.md`** — caps asset count to enforce visual hierarchy.

```diff
@@ Selection rules @@
 - Read each asset's `description` and pick only those whose meaning aligns with the brief.
-- Pick AT MOST 2-3 assets per composition.
+- Pick AT MOST 1 asset per composition unless the brief explicitly calls for a multi-asset montage.
+- If unsure, prefer zero assets and build from primitives.
```
````

The diff must be editor-applicable as-is. Include enough surrounding
context that a human pasting it into vim/VS Code can find the location.

### Step 6 — Apply (only on explicit confirmation)

Ask: "Apply this to `~/uds-orchestrator/skills/<slug>/SKILL.md`?"

Three branches:
- **yes** → use the `Edit` tool to apply, then proceed to Step 7
- **no, change it: <feedback>** → loop back to Step 5 incorporating the
  feedback
- **I'll paste it myself** → print the full diff for copy-paste, wait for
  the human to confirm the paste landed ("done" / "applied"), then
  proceed to Step 7

If the human refines the diff more than 3 rounds, gently surface:

> "We've revised this 3 times. Want to apply the current version and
> replay, or step back and re-read the original SKILL.md together?"

### Step 7 — Hand off to replay

Print (do **not** execute) the exact replay command. Include the token
resolution one-liner so the human can paste a single block.

End the conversation with: "Run that, wait ~90s, then `/iter-skill <new
replay id>` to compare."

## Failure modes

Refer to `rules/<pipeline>.md` for the canonical list and exact responses.
The generic principle: never propose an edit when a precondition has
failed; instead, surface the failure clearly and tell the human how to
fix it.

## Anti-patterns — do not do these

- Apply an edit "because the human seemed to imply yes" — always require
  explicit yes
- Edit two skills in one round — surface a triage instead
- Run `curl /eval/replay` for the human — print the command only
- Propose edits when no attempts were recorded — that's an infra issue
- Edit a skill that's not in the inlined set — out of scope for this loop
