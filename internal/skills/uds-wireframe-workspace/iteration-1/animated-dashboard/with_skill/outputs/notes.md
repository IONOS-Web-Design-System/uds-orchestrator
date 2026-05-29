# AnimatedDashboardWireframe — Implementation Notes

## Skill guidance followed

### Wireframe composition rules (wireframe-composition.md)
- Wrapped in `<ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">` as required
- Used `<Surface>` as the root layout region
- Used `<Card>` for stat cards and the server table container
- Used `<Button>` for all actions with stubbed `onClick={() => {}}`
- Used `<NavigationBar>` for the top nav
- Placeholder content is contextually plausible (real server names, real locations, realistic traffic/uptime values) — no lorem ipsum
- CSS variables used throughout; hex values avoided

### Brand colors (ionos-color-palette.md, shared-identity-principles.md)
- IONOS Blue (`var(--brand/ionos-blue-600)`) used for primary text accents (server names, logo)
- Dark Midnight (`var(--brand/ionos-blue-800)`) used for all body text — the spec calls this out as "primary text color for screen"
- Sky (`var(--brand/ionos-sky-300)`) used for the traffic stat accent bar and the CPU progress bar (under 50%) — one focal use per section
- Cloud (`var(--neutral/cool-grey-100)`) used for page background and table header
- Secondary colors (Green-300, Amber/Yellow-300) used only for semantic status meaning in the server table — this is an explicitly approved use case in shared-identity-principles.md § Product UI / dashboard

### Typography (ionos-typography.md)
- Overpass (`var(--base/font/heading)`) used for the page headline, the section h2, and the large stat values — all impact/attention contexts
- Open Sans (`var(--base/font/body)`) used for labels, table columns, badges, button text — all utility/information contexts
- Overpass is not used below 16px anywhere
- Uppercase tracking (`letterSpacing: '0.56px'`) applied to small uppercase labels per the typography spec

### Animations (wireframe-micro-animations.md)
- Staggered entrance animations via CSS `animation-delay`, not Remotion (correct choice: these are page-load entrance fades, not a timeline sequence)
- Two keyframes defined: `fadeInUp` (for cards and headers) and `fadeIn` (for rows)
- Delay ladder:
  - Nav: 0ms
  - Page header: 80ms
  - Stat card 1–4: 200ms, 320ms, 440ms, 560ms (120ms stagger)
  - Server section header: 700ms
  - Server rows 1–3: 820ms, 920ms, 1020ms (100ms stagger)
  - Footer: 1100ms
- Duration: 400–450ms, within the 400–600ms entrance window specified by the rule
- No animations on non-interactive elements beyond the entrance fade

## Decisions made without explicit guidance
- Server table uses a CSS grid layout (not a UDS `Table` component) since the composition rule's dashboard pattern shows a card-grid pattern and a `Table` component isn't documented in the wireframe rules
- CPU mini-progress bar added to the server rows for visual richness — it uses Sky for normal load and Amber for >50% load (semantic color use)
- The page header sub-text uses `opacity: 0.6` on Dark Midnight rather than a lighter color, to stay within the primary palette
