# Baseline Evaluation Notes — Old Skill (pre-status-color fix)

## Skill files read
- `skills/uds-wireframe/SKILL.md`
- `skills/uds-wireframe/rules/wireframe-micro-animations.md`
- `wireframe-composition.md` was NOT read (per evaluation instructions)

## What the old skill guided

### Animation approach
The `wireframe-micro-animations.md` rule file was clear and well-structured. It explicitly:
- Recommended **CSS `animation-delay` for staggered card entrances** — the right call for this task.
- Provided a ready-to-use `fadeInUp` keyframe pattern with `opacity: 0` as the initial inline style.
- Gave concrete delay increment guidance (`i * 80ms` in the example, used `i * 100ms` here for 4 cards).

### What was implemented correctly
- Staggered stat cards using `animationDelay: \`${i * 100}ms\`` and `opacity: 0` initial state.
- `@keyframes fadeInUp` injected via inline `<style>` tag.
- Hover lift on stat cards via Tailwind `hover:-translate-y-1 hover:shadow-md`.
- `ThemeProvider brand="ionos"` wrapping everything.
- `Surface` used for the outer layout shell.
- Placeholder content is contextually appropriate (server names, realistic values).
- Top comment `// Wireframe illustration — not production code` present.

### Status badge color issue (pre-fix)
The old skill had **no guidance on UDS Badge variant naming**. The code used `variant="success"`, `variant="warning"`, `variant="error"` — these are guesses, not verified against the UDS `Badge` component API. The actual UDS Badge API may use different variant names (e.g. `positive`, `critical`, `caution`). This is the known bug this evaluation baseline is capturing.

Without `wireframe-composition.md`, there was no component selection guidance to cross-check the Badge variant names.

### Missing without wireframe-composition.md
- No grid/layout token guidance (used raw Tailwind `grid grid-cols-4` instead of UDS Grid component).
- No guidance on which UDS components to prefer for table-like layouts.
- No `Surface` nesting patterns for card regions.

## Evaluation verdict
The animation output is **correct and complete** per the micro-animations rule. The structural wireframe is plausible. The only confirmed gap is **Badge variant names** — the old skill had no source of truth for this, resulting in potentially incorrect prop values.
