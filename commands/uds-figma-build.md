---
description: "Build UDS React code from a Figma design URL"
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

# /uds-figma-build

Full Figma-to-UDS-code workflow. Takes a Figma URL, analyzes the design, and
generates production-ready UDS React code.

## Arguments

- `$ARGUMENTS` — A Figma URL (e.g., `https://figma.com/design/ABC123/...?node-id=1-2`)

## Instructions

1. **Parse the Figma URL** from `$ARGUMENTS`. Extract `fileKey` and `nodeId`:
   - `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId
   - `figma.com/design/:fileKey/branch/:branchKey/:fileName` → use branchKey as fileKey

2. **Read the usage skill** at `skills/uds-usage-best-practices/SKILL.md` — understand
   critical rules, component quick reference, and token mapping.

3. **Read the Figma-to-code workflow** at `skills/uds-usage-best-practices/rules/workflow-figma-to-code.md`.

4. **Get the design context** using the Figma MCP `get_design_context` tool with
   the extracted `fileKey` and `nodeId`. This returns code suggestions, a screenshot,
   and contextual hints.

5. **IGNORE Figma's code suggestions.** The Figma MCP may return predefined code rules
   that don't use UDS. Always use UDS components and tokens instead.

6. **Analyze the design** and plan the component structure:
   - Map every visual element to a UDS React component (section 4 of SKILL.md)
   - Identify which components need rule files read (read them before coding)
   - Classify assets using the 4-category decision tree:
     - Raster images → `AspectRatio`
     - Vector SVGs (not in icon package) → `<div>` wrapper with inline SVG
     - Icons → `Icon` component with inject function
     - Brand logos → `<img>` in `<div>` with brandmark import
   - Identify pricing displays → must use `Price` component
   - Identify inverted sections → must use `ThemeInverter`

7. **Read component rule files** for every UDS component you'll use:
   - `skills/uds-usage-best-practices/rules/react-{component}.md`
   - `skills/uds-usage-best-practices/rules/core-spacing-tokens.md` (always read for spacing)

8. **Generate the code**:
   - Use UDS design tokens for ALL styling (no hardcoded hex/px values)
   - Use `Text` component with `asChild` for all typography
   - Use border double-dash convention: `border--base`
   - Pass icon inject functions as references: `icon={plus}`
   - Wrap output in `ThemeProvider`
   - Every spacing value must be pixel-accurate (check token table)
   - Use semantic token names from the token quick reference

9. **Read the verification workflow** at `skills/uds-usage-best-practices/rules/workflow-verification.md`.

10. **Triple-check** the implementation against the original Figma design:
    - Request a Figma screenshot using `get_screenshot` for comparison
    - Verify spacing pixel-accuracy
    - Verify typography variants and colors
    - Verify asset handling per decision tree
    - Verify ThemeInverter usage for inverted sections
    - Verify no hardcoded colors or raw Tailwind classes

11. **Report** what was built, which components were used, and any manual
    steps remaining (e.g., downloading SVG assets from Figma).
