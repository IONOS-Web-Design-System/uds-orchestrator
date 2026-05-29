---
name: uds-wireframe
description: >
  Build brand-specific interface wireframe illustrations using UDS components,
  Tailwind utilities, and the IONOS design system. Use this skill whenever the
  user wants to sketch, mock up, or illustrate an interface layout, screen, page,
  or UI composition using real UDS components — even if they say "wireframe",
  "mockup", "sketch", "prototype", "interface illustration", "lo-fi layout", or
  just "show me what this screen could look like". Also triggers when the user
  wants to combine a pixel image or Figma frame with a component layout, or wants
  micro-animations on a UI illustration. Outputs a .tsx file — real UDS components,
  real IONOS brand colors, placeholder content. Not a full production implementation
  — a composed illustration of structure and intent. Requires uds-style-guide and
  uds-usage-best-practices. For animation: references remotion-best-practices.
---

# UDS Wireframe

A wireframe here means a **live, renderable React composition** using real UDS components arranged to illustrate a layout. It uses real IONOS brand colors and typography — the "low fidelity" comes from placeholder content and simplified interaction, not greyscale or outline aesthetics.

Think of it as the middle ground between a Figma mockup and production code: structurally complete, visually on-brand, but not wired up to data or full business logic.

## Before You Start — Ask Two Questions

Always ask the user these before generating, unless already answered:

1. **Images?** — "Do you want to include any images in this wireframe? If so, paste a local file path (e.g. `/Users/you/assets/hero.jpg`) or a Figma URL, and I'll embed it."
2. **Animations?** — "Should any elements have micro-animations (hover effects, entrance transitions, loading states)?"

These shape the output significantly. If the user has already described images or animations in their prompt, skip asking.

## Wireframe Composition Rules

Read `rules/wireframe-composition.md` for the full layout and component selection guide.

Key principles:
- Wrap everything in `<ThemeProvider brand="ionos">` (or user-specified brand)
- Use `<Surface>` for layout regions — it handles background, text color, and theming
- Select components for visual structure: `Card`, `Button`, `NavigationBar`, `Hero`, `Grid` etc.
- Stub callbacks: `onClick={() => {}}`, `onChange={() => {}}`
- Placeholder text should be contextually appropriate — not generic "Lorem ipsum" but plausible content matching the layout intent
- Mark the file clearly: add a comment at the top: `// Wireframe illustration — not production code`

## Brand Reference

Before choosing colors or fonts, check `uds-style-guide`:
- IONOS primary brand colors and when to use each
- Typography rules (Overpass for headlines, Open Sans for body)
- `data-brand="ionos"` on the ThemeProvider root

Currently only `ionos` brand is fully documented in `uds-style-guide`. For other brands, set `data-brand` appropriately and note that brand-specific tokens will resolve via CSS.

## Image Integration

Read `rules/wireframe-asset-integration.md` for the full image workflow.

Quick rules:
- **Local path** → use UDS `Picture` component with `src` prop, or plain `<img>` for simplicity
- **Figma URL** → use the Figma MCP tool (`get_screenshot`) to fetch a rendered image of the frame, then embed that URL
- Images are content elements inside the wireframe, not backgrounds or overlays

## Micro-Animations

Read `rules/wireframe-micro-animations.md` for when to use CSS vs Remotion.

Quick rules:
- Hover states, transitions, entrance fades → native CSS / Tailwind
- Sequenced animations, video export, timeline-based → use `remotion-best-practices` skill

## Output Format

Produce a single `.tsx` file. Structure:

```tsx
// Wireframe illustration — not production code
import { ThemeProvider, Surface, Button, Card } from '@ionos-web-design-system/react';
// ... other imports

export default function [ScreenName]Wireframe() {
  return (
    <ThemeProvider brand="ionos">
      {/* layout composition */}
    </ThemeProvider>
  );
}
```

Name the file descriptively based on the screen/layout (e.g. `HeroBannerWireframe.tsx`, `DashboardLayoutWireframe.tsx`).

## Related Skills

- **`uds-style-guide`** — brand colors, typography, identity principles for IONOS
- **`uds-usage-best-practices`** — component APIs, token usage, prop patterns
- **`remotion-best-practices`** — when animations go beyond CSS transitions
