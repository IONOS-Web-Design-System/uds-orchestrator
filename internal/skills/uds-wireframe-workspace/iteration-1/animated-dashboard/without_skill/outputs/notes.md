# Baseline Notes — Without Skill

## Approach
Built from general knowledge of React, UDS component library (`@ionos-web-design-system/components`), and CSS transitions.

## What was used
- `Surface` for card/panel containers
- `Text` for headings, labels, body copy
- `Badge` with `variant` prop for server status indicators
- `Button` with `variant` and `size` props for actions
- Plain inline CSS objects for layout (grid, table, flexbox)

## Animation Strategy
- `useState` initializes all 4 stat cards as invisible (`opacity: 0`, `translateY(20px)`)
- `useEffect` on mount fires `setTimeout` for each card with a 150 ms stagger (100, 250, 400, 550 ms)
- Each card flips its visibility flag independently, triggering a CSS `transition` for `opacity` and `transform`
- The transition duration is 500 ms with `ease` timing

## Uncertainties / potential issues
- Unsure if `Surface` accepts arbitrary `style` prop — may need a wrapping `<div>` instead
- `Badge` variant naming (`success`, `critical`, `warning`) guessed from common UDS patterns; actual API may differ (e.g., `positive`, `negative`)
- `Text` variant strings (`headline-l`, `body-m`, `label-s`) guessed — real tokens may use different naming conventions
- `Button` `size="s"` — size prop naming guessed
- No `ThemeProvider` wrapper included — real usage likely requires it for design tokens to resolve
- Table built with raw `<table>` HTML rather than a UDS Table component (unsure if one exists)
- Inline style objects used throughout because Tailwind CSS class names were not confirmed
