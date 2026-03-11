---
description: "Verify UDS implementation against a Figma design"
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

# /uds-verify

Verify that the current implementation matches a Figma design. Uses both
static code analysis and Playwright MCP for runtime verification.

## Arguments

- `$ARGUMENTS` — A Figma URL to verify against (e.g., `https://figma.com/design/ABC123/...?node-id=1-2`)

## Instructions

1. **Parse the Figma URL** from `$ARGUMENTS`. Extract `fileKey` and `nodeId`.

2. **Read the verification workflow** at `skills/uds-usage-best-practices/rules/workflow-verification.md`.

3. **Get a Figma screenshot** using `get_screenshot` for the target node.

4. **Read the usage skill** at `skills/uds-usage-best-practices/SKILL.md` for
   the verification checklist (section 11).

5. **Static code analysis** — Scan the implementation files:
   - Grep for hardcoded colors (`#[0-9a-fA-F]`, `rgb(`, `rgba(`)
   - Grep for raw Tailwind colors (`bg-red`, `text-gray`, etc.)
   - Grep for single-dash border tokens (`border-base` without `--`)
   - Grep for `text-base` used as font size
   - Grep for `icon={.*()}` (should be reference, not call)
   - Grep for raw `<img>` tags that should use `AspectRatio`
   - Grep for manual price markup that should use `Price` component
   - Verify `ThemeInverter` used for inverted sections

6. **Runtime verification** (if app is running) — Use Playwright MCP:
   - Navigate to the running app
   - Take a screenshot for comparison with Figma screenshot
   - Verify computed spacing values match expected token values
   - Verify computed colors resolve to UDS token values
   - Verify font family matches the brand's font
   - Verify data attributes are set on `<html>`

7. **Cross-reference with Figma design**:
   - Compare Figma screenshot with implementation screenshot
   - Check each verification category from section 11:
     1. Custom components — pixel accuracy
     2. Typography — variant, weight, color
     3. Spacing — padding/margin/gap accuracy
     4. Corner radius — correct tokens
     5. Theme inversion — ThemeInverter usage
     6. Icons — correct name, size, group
     7. Colors — UDS tokens only
     8. Assets — correct category handling

8. **Generate report**:
   - List all discrepancies found (static + runtime)
   - For each: location, expected vs actual, severity, fix suggestion
   - Overall pass/fail status
   - Screenshots for visual comparison
