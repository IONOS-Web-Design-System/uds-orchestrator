# Screen-content interface (illustration-first)

Applies when the brief is a **bare on-screen interface** destined to be placed onto a device's
screen in a separate photoreal image (the payload carries `screenContent: true`). The render IS
the screen content — a real device is added around it later, so:

- **Full-bleed.** The UI fills the ENTIRE frame. NO device mockup, frame, bezel, or hardware; NO
  desk/scene/background chrome; NO floating cards, panels, or highlight chips hovering outside the
  UI; NO connector lines. A device wrapper here is nonsensical — the render is placed onto a real
  device's screen downstream.
- **Realistic, not wireframe.** Render a crisp, high-fidelity product UI with real-looking content
  — concrete labels, values, and controls — NOT grey placeholder bars or lo-fi wireframe blocks.
  It must read as an actual product screenshot.
- **Static.** A single settled frame; no entrance animation or motion.
- **On-brand.** Use the brand palette and type from the uds-style-guide skill (reference color
  semantically via tokens — never hardcode a hex here). Apply the AI gradient only for a genuine
  AI affordance, per uds-style-guide.
- **Base surface theme follows `colorScheme`.** Per `shared-wireframe-surface-theme`, theme the
  bare interface's surfaces with the `colorScheme`-resolved UDS surface/text tokens — light by
  default; do NOT hardcode a dark panel background unless `colorScheme='dark'` or the brief asks
  for dark.

This REPLACES the default wireframe/composite styling for this one render — do not add the embed
contract's composite chrome.
