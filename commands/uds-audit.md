---
description: "Audit an existing project for UDS configuration issues"
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

# /uds-audit

Audit an existing project for UDS configuration issues and report findings.

## Instructions

1. **Read the audit checklist** at `skills/uds-project-setup/rules/setup-audit-checklist.md`.

2. **Read the troubleshooting guide** at `skills/uds-project-setup/rules/setup-troubleshooting.md`.

3. **Check package installation**:
   - Read `package.json` for UDS dependencies
   - Verify `@ionos-web-design-system/core` and `@ionos-web-design-system/react` are installed
   - Check version compatibility

4. **Check CSS entry file**:
   - Find the CSS entry file (glob for `index.css`, `globals.css`, `global.css`)
   - Verify `@import 'tailwindcss'` is first
   - Verify brand and platform CSS imports are present and in order
   - Verify `react/style.css` import is present
   - Check for CSS imports in JS/TS files (should not exist)

5. **Check HTML root attributes**:
   - For Vite: Read `index.html`
   - For Next.js: Read `app/layout.tsx` or `pages/_document.tsx`
   - Verify `data-brand`, `data-platform`, `data-color-scheme` are set

6. **Check ThemeProvider**:
   - Grep for `ThemeProvider` in entry components
   - Verify it wraps the component tree

7. **Scan for anti-patterns**:
   - Grep for hardcoded hex colors (`#[0-9a-fA-F]{3,8}`) in `src/`
   - Grep for `rgb(` and `rgba(` in `src/`
   - Grep for raw Tailwind colors (`bg-red`, `text-gray`, `border-blue`) in TSX/JSX
   - Grep for single-dash border tokens (`border-base` without double-dash) in TSX/JSX
   - Grep for `text-base` used as font size in TSX/JSX
   - Grep for `icon={.*()}` (icon function calls instead of references)

8. **Check font loading**:
   - Look for Google Fonts links in `index.html`
   - Look for @fontsource or next/font imports

9. **Generate report** with:
   - Summary: total issues found, categorized by severity (Critical / High / Medium / Low)
   - For each issue: file path, line number, what's wrong, how to fix it
   - Reference the troubleshooting guide for complex fixes
