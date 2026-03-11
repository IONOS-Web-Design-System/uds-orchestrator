---
description: "Quick reference lookup for a UDS component"
allowed-tools: ["Read", "Glob"]
---

# /uds-component

Look up usage reference for a specific UDS component.

## Arguments

- `$ARGUMENTS` — Component name (e.g., `button`, `text`, `price`, `theme-inverter`)

## Instructions

1. **Parse the component name** from `$ARGUMENTS`. Normalize to kebab-case lowercase.

2. **Find the rule file**:
   - First check: `skills/uds-usage-best-practices/rules/react-{name}.md`
   - If not found, check: `skills/uds-usage-best-practices/rules/shop-ui-{name}.md`
   - If not found, check: `skills/uds-usage-best-practices/rules/core-{name}.md`
   - If still not found, glob for `skills/uds-usage-best-practices/rules/*{name}*.md`

3. **Read the rule file** and present a summary including:
   - Component import statement
   - Key props and their values
   - Usage examples
   - Common mistakes to avoid
   - Related components (if any)

4. **Also read the SKILL.md** quick reference (section 4) if the user might
   benefit from seeing the full component table.

5. **Present the information** concisely — the user wants a quick lookup,
   not a full tutorial.
