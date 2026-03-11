---
description: "Scaffold a new project with UDS (Universal Design System) + Tailwind CSS v4"
allowed-tools: ["Bash", "Read", "Write", "Glob", "Grep"]
---

# /uds-setup

Scaffold a new UDS project or add UDS to an existing project.

## Arguments

- `$ARGUMENTS` — Expected format: `<brand> [platform]`
  - `brand` (required): One of `ionos`, `strato`, `fasthosts`, `homepl`, `strefa`, `udag`, `world4you`, `arsys`
  - `platform` (optional, default: `comfortable`): One of `comfortable`, `compact`

## Instructions

1. **Parse arguments** from `$ARGUMENTS`. If brand is missing, ask the user to provide it.

2. **Read the skill file** at `skills/uds-project-setup/SKILL.md` for complete setup instructions.

3. **Detect existing project**:
   - Check for `package.json` in the current working directory
   - If exists: add UDS to existing project
   - If not: ask user if they want to create a new Vite + React project first

4. **Install UDS packages**:
   ```bash
   npm install @ionos-web-design-system/react @ionos-web-design-system/core
   npm install @ionos-web-design-system/icon
   ```

5. **Configure CSS entry file** (`index.css` or `globals.css`):
   - Read `rules/setup-css-imports.md` for the correct import order
   - Add imports in order: tailwindcss → brand → platform → react/style.css
   - Use the specific brand from arguments (not wildcards)

6. **Set HTML root attributes**:
   - For Vite: Update `index.html` with `data-brand`, `data-platform`, `data-color-scheme`
   - For Next.js: Update `app/layout.tsx`

7. **Add ThemeProvider** to the app entry component (`App.tsx` or `layout.tsx`)

8. **Set up fonts**:
   - Read `rules/setup-fonts.md` for the brand-to-font mapping
   - Add Google Fonts link to `index.html` (Vite) or use `next/font` (Next.js)

9. **Verify setup** using the checklist in SKILL.md section 5

10. **Report** what was configured and any manual steps remaining
