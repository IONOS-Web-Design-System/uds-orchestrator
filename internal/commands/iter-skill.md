---
description: Suggest-only iteration on the inlined codegen skills against an agent-svc run. Loads the run's trace from SQLite, proposes a diff against one of the three inlined SKILL.md files, then prints the replay command for you to run.
---

# /iter-skill

Use the `skill-iteration` skill with the `illustration-pipeline` rules to
drive a suggest-only iteration on the run `$1`.

The skill markdown describes the 7-step loop in full. Steps in brief:
1. Load context (SQL queries from
   `~/uds-orchestrator/internal/skills/skill-iteration/rules/illustration-pipeline.md`)
2. Present the summary + Player URL
3. Ask the human what looked wrong
4. Identify the implicated skill (with ranked triage on uncertainty)
5. Propose a diff
6. Apply ONLY on explicit yes; loop on "no, change it"
7. Print the replay curl; hand off

**HARD RULE — DO NOT VIOLATE:**
- Never apply an edit without an explicit "yes" in the same chat turn
- Never run the replay curl yourself — print it only
- One skill edited per round; if multiple plausible, surface a triage

Run ID argument: `$1`. If missing, prompt: "Pass a runId. Use
`cd ~/agent-svc/eval-cli && DB_PATH=~/pipeline-local/agent-data/agent-svc.db node . list --limit 30` to find one."
