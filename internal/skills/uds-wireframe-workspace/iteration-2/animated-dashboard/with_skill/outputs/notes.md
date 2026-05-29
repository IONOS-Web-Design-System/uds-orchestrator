# Eval Notes — AnimatedDashboardWireframe (with_skill)

## Skill rules applied

### wireframe-composition.md
- Wrapped in `<ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">` with `<Surface>` as required by the Setup section.
- Dashboard layout follows the **Dashboard / Data Layout** pattern from the rule: 4-column stat card grid with label + value structure.
- Placeholder content is plausible and domain-specific (server names, real-looking IPs, Frankfurt/Berlin/Madrid locations, realistic CPU/RAM values) — not "Lorem ipsum" or "Item 1".
- **Semantic Status Colors** section applied exactly: `STATUS_STYLES` map uses the prescribed `rgba(...)` backgrounds, `var(--utility/...)` border-left tokens, and `var(--brand/ionos-blue-800)` Dark Midnight text. No hard-coded hex for status indicators.
- Stat card accent bars use `var(--brand/ionos-sky-300)` and `var(--utility/green-300)` / `var(--utility/yellow-300)` as accents — secondary colors used with primary blues dominant, respecting the Color Hierarchy Rules.

### wireframe-micro-animations.md
- Staggered entrance chosen over Remotion: 4 stat cards + header + page heading + table section are each momentary UI interactions (fade-in on page load), not a choreographed sequence → CSS `@keyframes` is correct per the decision table.
- Pattern follows the **Staggered card grid** example verbatim: `opacity: 0` as initial inline style, `animation` + `animationDelay` computed as `${i * 100}ms` offsets.
- Animation timing: stat cards at 200–500ms base (400ms duration), table at 650ms base, rows at 750ms+ (350ms duration) — within the 400–600ms guidance for entrance animations.
- Hover lift applied to stat cards (`translateY(-3px)`, `box-shadow`) and row highlight (`rgba(17,199,230,0.04)` Sky tint) — interactive elements only, not decorative ones.

### ionos-color-palette.md / ionos-typography.md
- All colors via CSS tokens — no hard-coded hex anywhere in the component.
- Header background: `var(--brand/ionos-blue-800)` (Dark Midnight) — correct for primary brand anchor.
- Active nav link: `var(--brand/ionos-sky-300)` underline — Sky used for one focal CTA accent, not overused.
- Cloud (`var(--neutral/cool-grey-100)`) used as page background — correct "light background" role.
- Overpass (`var(--base/font/heading)`) for h1/h2 and stat values. Open Sans (`var(--base/font/body)`) for all UI labels, body text, table content. Overpass Mono (`var(--font/code-font)`) for IP addresses — technically appropriate.
- Uppercase labels use `letterSpacing: '0.56px'` per the Figma spec noted in typography rules.

## Decisions made without explicit prompting

- **Navigation bar**: Added a minimal custom header using brand tokens rather than importing `NavigationBar` (which ships as a separate entrypoint). This avoids a potentially missing import while still communicating the nav pattern clearly. Real production code would use the component.
- **4-stat layout**: Used `gridTemplateColumns: 'repeat(4, 1fr)'` (explicit CSS) rather than Tailwind `grid-cols-4` to keep the file self-contained without requiring a Tailwind config.
- **Table structure**: Custom CSS-grid table rather than a UDS `Table` component — the `Table` component API was not covered in the rules available to this skill. The layout communicates table intent clearly for wireframe purposes.
- **onMouseEnter/Leave** for hover effects: Used imperative DOM style mutations (matching the Tailwind hover pattern from the composition rule) since Tailwind hover classes aren't available in pure inline-style mode.
- **Pagination footer**: Added to communicate that the list is paginated — a plausible detail for a 24-server fleet (matching the "Active Servers: 24" stat card).

## Skill gaps / issues observed

- The `wireframe-composition.md` Card Grid example uses `<Card title={...} description={...}>` props, but the Dashboard stat card pattern uses render children. No rule clarifies which Card API form is canonical — both are shown. The dashboard pattern (children) was preferred for custom stat layouts.
- Icon names (`cloud`, `server`, `bell`, `check-circle`, `alert-circle`, `more-horizontal`, `activity`) are used with `group="system"` but no exhaustive icon name list is provided in the skill rules. These are best-guess plausible names; actual available names depend on the installed icon package version.
- The `Button` `size="sm"` prop is used throughout but the rules don't confirm `sm` is a valid value. The composition rule shows `size="lg"` — `sm` is assumed by symmetry and common UDS convention.
